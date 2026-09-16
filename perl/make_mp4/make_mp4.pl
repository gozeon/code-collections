#!/usr/bin/env perl
# -*- coding: utf-8 -*-
#
# make_mp4.pl -- 把「音频 + 图片」批量合成为 mp4 视频（Windows 友好，无第三方依赖）
#
# 流程：
#   1. 读取配置（音频目录 + 图片目录）
#   2. 按音频文件名「歌曲名-作者」用 ImageMagick 生成文字封面（歌曲名 / 作者各一行，居中）
#   3. 用 ffmpeg 把随机顺序的图片做成幻灯片（只在换图处打关键帧，体积小、
#      后面拷贝得快）；片头封面用 -loop 1 -t 写死 cover_seconds 秒，单独编成
#      一段放在最前面，后面的正片（图片/视频片段）再 copy 着循环铺满音频
#      时长——封面只在成片开头出现一次，循环时不会跟着重复，输出 mp4
#   4. 循环处理音频目录下每个音频文件，输出到「音频目录/out」
#
# 运行日志：<输出目录>/make_mp4.log，逐条记录执行过的命令（CMD）、退出码
#   （EXIT）、命令输出（OUT/PROBE）、封面每个候选的取舍（COVER）和产出的文件
#   及大小（FILE）。封面出不来时直接把这份日志发出来就能看到卡在哪一步。
#
# 依赖：只用 Perl 自带模块（core modules）；外部程序 ImageMagick 与 ffmpeg。
#
# 用法：
#   perl make_mp4.pl -a D:\music\audio -i D:\music\picture
#   perl make_mp4.pl -c make_mp4.ini
#   perl make_mp4.pl                       # 自动读取脚本目录 / 当前目录下的 make_mp4.ini
#   perl make_mp4.pl <音频目录> <图片目录>
#
# 音频文件名格式： 歌曲名-作者.mp3
# 图片文件名格式： Image00001.jpg（五位从 1 递增）
# 图片目录里也可以放视频片段（mp4/mov/mkv/webm/avi...）：视频按自己的时长
#   整段接到幻灯片里（原声丢弃，始终用音频文件的声音），和图片一起参与随机排序。
#
# 说明：封面文字不通过命令行参数传递（Windows 下中文容易乱码），
#       而是写成 UTF-8 文本文件后交给 ImageMagick 的 caption:@文件 读取。
#       歌名和作者各用一条命令渲染成独立图片，逐行校验后再拼成文字图落盘、
#       居中合成到底色上，保证两行都在画面里；生成后还会检查封面不是纯色
#       空图、且两行都渲染出来了，否则换字体/排版重试。
#       封面按文件名缓存，缓存签名（见 $COVER_FORMAT 等）变化时自动重建。
#       封面落盘成独立图片（<输出目录>/covers/<歌曲名>.jpg），并作为片头显示
#       cover_seconds 秒（配置 cover_seconds，0 = 不插），只出现在成片开头。
#       封面时长必须用 -loop 1 -t 显式写死，不能只靠 ffconcat 列表里的 duration：
#       concat 解复用器对静帧（尤其是列表第一项）的时长处理并不可靠，封面会被压成
#       不到一帧，合成出来的视频里就看不到封面。封面单独占一段，正片另成若干段，
#       各段编码参数完全一致，再 copy 着拼起来（封面段只放一份，循环时只重复正片段）。
#-----------------------------------------------------------------------

use strict;
use warnings;
use utf8;

use Encode qw(decode encode);
use File::Path ();
use File::Spec;
use Getopt::Long qw(GetOptions);

my $IS_WIN = ($^O eq 'MSWin32');
$| = 1;

# 命令行参数 / 文件名在本机使用的字符集。
# Windows 下 Perl 取到的参数与目录项是 ANSI 代码页字节，这里默认按系统 ACP 处理，
# 保证中文文件名不会乱码；可用 --charset 覆盖（例如 GBK / CP936 / UTF-8）。
my $SRC_ENC = $IS_WIN ? 'CP936' : 'UTF-8';

my @AUDIO_EXT = qw(mp3 m4a m4b aac flac wav wma ogg oga opus ape wv ac3 dts mka mp2 aif aiff);
my @IMAGE_EXT = qw(jpg jpeg jpe png bmp gif tif tiff webp);
# 图片目录里也可以放视频片段：它们会按自己的时长整段接入幻灯片（不取原声）
my @VIDEO_EXT = qw(mp4 m4v mov mkv webm avi wmv flv mpg mpeg m2ts ts 3gp ogv);

# 封面「有内容」的判定阈值（整图标准差），低于此值认为是纯色空封面
my $COVER_FLAT = 0.002;

# 封面排版/渲染逻辑的版本号：改动封面生成方式时 +1。
# 封面是缓存复用的，版本号变化时旧封面会自动重建，
# 不会出现「脚本已经修好、用户看到的还是旧封面」的情况。
my $COVER_FORMAT = 2;

# 小于这个字节数的 mp4 视为半成品：既不跳过它，失败时也要删掉。
my $MIN_MP4_SIZE = 1024;

# 封面配色的兜底值：配置里颜色缺失/为空时使用。
# 注意：ImageMagick 的 xc: 拿不到颜色参数时会退回默认的白色背景，
#       整张封面就成了白板，所以任何情况下都不能给 xc: 传空颜色。
my %COLOR_DEFAULT = (
    cover_color  => '#1e2a38',
    title_color  => 'white',
    artist_color => '#c8d0d8',
);

# 视频编码参数，main 里根据 vcodec 填充（必须在子程序之前声明）
my @VENC_ARGS;

# 同一类诊断只打一次（批量跑几十首歌时避免刷屏）
my %REASON_SEEN;

# 日志文件句柄（<输出目录>/make_mp4.log）
my $LOG_FH;
my $LOG_PATH;

# 配置里是否出现过不可见字符（读配置时先于日志打开，先记下来，开日志后补记一条）
my $CFG_CLEANED = 0;

my %cfg = (
    audio         => undef,
    images        => undef,
    out           => undef,          # 默认 <音频目录>/out
    font          => undef,          # 封面字体，默认自动查找中文字体
    size          => '1280x720',     # 输出视频尺寸
    fps           => 25,
    seconds       => 5,              # 每张图片显示秒数
    cover_seconds => 2,              # 成片开头显示封面的秒数（0 = 不插封面）
    cover_color   => '#1e2a38',      # 封面底色
    title_color   => 'white',
    artist_color  => '#c8d0d8',
    title_size    => undef,          # 封面主标题字号，默认按视频高度计算
    artist_size   => undef,          # 封面作者字号
    shuffle       => 1,              # 图片随机顺序
    verify_cover  => 1,              # 检查封面是否为空画面（空则重新生成）
    vcodec        => 'libx264',
    crf           => 23,
    preset        => 'ultrafast',     # 幻灯片全是静帧，ultrafast 明显更快、画质几乎无差
    acodec        => 'aac',
    abitrate      => '192k',
    pad_color     => 'black',        # 图片比例不符时的填充色
    force         => 0,              # 1 = 已存在的 mp4 也重新生成
    keep_temp     => 0,              # 1 = 保留中间文件
    keep_cover    => 1,              # 1 = 保留生成的封面图
    dry_run       => 0,
    magick        => undef,
    ffmpeg        => undef,
    charset       => undef,
    help          => 0,
);

#-----------------------------------------------------------------------
# 帮助
#-----------------------------------------------------------------------
sub usage {
    my ($code) = @_;
    print <<'USAGE';
make_mp4.pl - build mp4 videos from audio files + images

Usage:
  perl make_mp4.pl -a <audio_dir> -i <image_dir> [options]
  perl make_mp4.pl -c <config.ini>
  perl make_mp4.pl <audio_dir> <image_dir>

Options:
  -a, --audio DIR        audio directory (required)
  -i, --images DIR       image/video directory (required)
                         (video clips are used as slideshow segments as-is)
  -o, --out DIR          output directory (default: <audio_dir>/out)
  -c, --config FILE      read settings from an ini file (UTF-8)
      --font FILE        ttf/ttc font used for cover text (default: auto)
      --size WxH         video size (default: 1280x720)
      --fps N            frame rate (default: 25)
  -s, --seconds N        seconds each image is shown (default: 5)
      --cover-color C    cover background color (default: #1e2a38)
      --cover-seconds N  show the cover image for the first N seconds of the
                         mp4 (default: 2, 0 = no cover intro); the cover plays
                         once at the start and is not repeated by the loop
      --title-color C    cover title color (default: white)
      --artist-color C   cover artist color (default: #c8d0d8)
      --title-size N     cover title point size
      --artist-size N    cover artist point size
      --shuffle          random image order (default: on), --no-shuffle keeps sorted order
      --verify-cover     re-render covers that came out blank (default: on)
      --force            rebuild mp4 files that already exist
      --keep-temp        keep temporary files (cover text, photo list, slideshow mp4)
      --dry-run          only print the commands that would run
      --magick CMD       ImageMagick command (magick / convert / full path)
      --ffmpeg CMD       ffmpeg command (default: ffmpeg)
      --charset NAME     charset of console args and file names (default: auto)
  -h, --help             show this help

Every run also writes a log to <out_dir>/make_mp4.log: executed commands (CMD),
their exit status (EXIT), captured output (OUT), probe results (PROBE), the cover
decision for each candidate (COVER) and every produced file with its size (FILE).

Encoding: the slideshow is encoded once (images only); the final mp4 is then
produced by copying the cover clip once, followed by the slideshow video stream
looped to cover the audio, so crf, preset, fps and seconds decide both the file
size and how long the last step takes. A keyframe is forced at every image
change (see the code comment), which keeps slideshows small; if the result is
still too big, raise crf (26~28), lower fps (10~15) or set preset = veryfast.

Config file keys (ini, UTF-8, 'key = value', '#' starts a comment):
  audio_dir    = D:\music\audio
  image_dir    = D:\music\picture    (images and/or video clips)
  out_dir      = D:\music\audio\out
  font         = C:\Windows\Fonts\msyh.ttc
  size         = 1280x720
  fps          = 25
  seconds      = 5
  cover_seconds = 2
  cover_color  = #1e2a38
  title_color  = white
  artist_color = #c8d0d8
  vcodec       = libx264
  crf          = 23
  abitrate     = 192k
  shuffle      = 1
  verify_cover = 1
  force        = 0
USAGE
    exit $code;
}

#-----------------------------------------------------------------------
# 编码辅助
#   磁盘/命令行 -> 本机编码字节串（native_bytes）
#   文件内容     -> UTF-8 字节串（utf8_bytes，给 ffmpeg 的 concat 列表和 ImageMagick 的文字文件）
#-----------------------------------------------------------------------
sub dec_native {
    my ($s) = @_;
    return $s if !defined $s || utf8::is_utf8($s);
    my $d = eval { decode($SRC_ENC, $s, Encode::FB_DEFAULT) };
    return defined $d ? $d : $s;
}

sub native_bytes {
    my ($s) = @_;
    return $s if !defined $s || !utf8::is_utf8($s);
    my $b = eval { encode($SRC_ENC, $s, Encode::FB_DEFAULT) };
    return defined $b ? $b : $s;
}

sub utf8_bytes {
    my ($s) = @_;
    return $s if !defined $s;
    return encode('UTF-8', $s) if utf8::is_utf8($s);
    my $d = eval { decode($SRC_ENC, $s, Encode::FB_DEFAULT) };
    return defined $d ? encode('UTF-8', $d) : $s;
}

#-----------------------------------------------------------------------
# 输出与日志
#   Windows 控制台是 ANSI 代码页：直接 print 宽字符会警告 "Wide character"
#   并显示成乱码，所以出口统一转成本机编码的字节串。
#   命令、退出码、产出的文件都写进 <输出目录>/make_mp4.log（UTF-8），
#   出问题时可以直接照着日志对。
#-----------------------------------------------------------------------
sub pout {
    print STDOUT map { native_bytes(defined $_ ? $_ : '') } @_;
}

sub poutf {
    my $fmt = shift;
    printf STDOUT $fmt, map { native_bytes(defined $_ ? $_ : '') } @_;
}

sub pwarn {
    my $msg = join('', map { native_bytes(defined $_ ? $_ : '') } @_);
    warn $msg;
    log_write('WARN ' . $msg);
}

sub log_stamp {
    my @t = localtime;
    return sprintf('[%02d:%02d:%02d]', $t[2], $t[1], $t[0]);
}

sub log_open {
    my ($path) = @_;
    $LOG_PATH = $path;
    return 0 if $cfg{dry_run};
    my $fh;
    open($fh, '>>:raw', $path) or do { pwarn("Cannot write log: $path\n"); return 0 };
    $LOG_FH = $fh;
    log_write('=== make_mp4 run ' . scalar(localtime) . ' ===');
    return 1;
}

# 一行一条写进日志；传进来的可能是本机编码的字节串，也可能是宽字符
sub log_write {
    my ($msg) = @_;
    return unless defined $LOG_FH;
    $msg = '' unless defined $msg;
    for my $line (split /\r?\n/, $msg) {
        next if $line =~ /^\s*\z/;
        print {$LOG_FH} log_stamp(), ' ', utf8_bytes($line), "\n";
    }
    return 1;
}

# 记一条要执行的命令：日志里留完整命令行，控制台也回显一份
sub log_cmd {
    my (@cmd) = @_;
    my $text = join(' ', map { cmd_arg($_) } @cmd);
    log_write('CMD  ' . $text);
    pout("    > $text\n");
    return $text;
}

sub cmd_arg {
    my ($a) = @_;
    return '' unless defined $a;
    return $a =~ /\s/ ? qq{"$a"} : $a;
}

# 记一个产出/需要的文件（路径 + 大小），方便核对「文件到底有没有生成」
sub log_file {
    my ($tag, $path) = @_;
    return unless defined $path && length $path;
    my $size = -s $path;
    log_write(sprintf('FILE %-6s %s (%s)', $tag, $path,
                      defined $size ? "$size bytes" : 'MISSING'));
    return;
}

# 探测类命令的输出折成一行，避免日志被刷屏
sub one_line {
    my ($s) = @_;
    return '(none)' unless defined $s && length $s;
    my $o = $s;
    $o =~ s/\s+/ /g;
    $o =~ s/^\s+|\s+\z//g;
    $o = '(blank)' if $o eq '';
    $o = substr($o, 0, 200) . '...' if length($o) > 200;
    return $o;
}

#-----------------------------------------------------------------------
# 配置值清理：去掉从网页/聊天窗口复制路径时带进来的不可见字符
# （零宽空格、双向控制符 U+202A、BOM 等）。它们肉眼看不见，却足以让
# 「C:\Windows\Fonts\xx.ttf」变成 ImageMagick 读不出的字体名，
# 于是悄悄退回默认字体、中文一行都画不出来。
#-----------------------------------------------------------------------
sub strip_invisible {
    my ($s) = @_;
    return $s unless defined $s;
    my $before = $s;
    $s =~ s/[\x{00AD}\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{2066}-\x{2069}\x{FEFF}]//g;
    $CFG_CLEANED = 1 if $s ne $before;
    return $s;
}

# 字节串版本的清理（命令行参数是本机编码的字节）
sub clean_bytes {
    my ($s) = @_;
    return $s unless defined $s;
    my $d = dec_native($s);
    $d = strip_invisible($d);
    return native_bytes($d);
}

# 交给 ImageMagick 的路径一律写成正斜杠。
# ImageMagick 把反斜杠当转义符，直接传 Windows 路径会被吃成
# 「C:WindowsFontsSTCAIYUN.TTF」，于是报 unable to read font 并悄悄退回
# 默认字体（中文就画不出来）。先解码成字符再替换，避免 CP936 双字节里
# 正好是 0x5C 的字节被改坏。
sub slash_path {
    my ($p) = @_;
    return undef unless defined $p;
    my $s = dec_native($p);
    $s =~ s!\\!/!g;
    return native_bytes($s);
}

# 交给 system/exec 的命令行参数统一先降成本机编码的字节串。
# 配置里的值（decode 之后是宽字符串，连 "black" 都是）一旦和文件名拼在同一条
# 命令里，join / system 会把整条命令按 Latin-1 升级成宽字符串，中文路径就变成
# 「æ³°è¿ª」这种乱码，写出来的文件名也跟着错。这里逐个降级，谁都别想升级整条命令。
sub native_cmd {
    my (@cmd) = @_;
    return map { defined $_ ? native_bytes($_) : $_ } @cmd;
}

#-----------------------------------------------------------------------
# 小工具
#-----------------------------------------------------------------------
sub ensure_dir {
    my ($dir) = @_;
    return 1 if -d $dir;
    return 1 if $cfg{dry_run};
    eval { File::Path::make_path($dir) };
    if ($@ || !-d $dir) {
        pwarn("Cannot create directory: $dir ($@)\n");
        return 0;
    }
    return 1;
}

#-----------------------------------------------------------------------
# 运行外部命令并回收输出（stdout + stderr）
#
# 这里刻意不用 open(FH, '-|', @cmd) 管道：部分 Windows 版 Perl 的管道实现会把
# 命令交给 cmd.exe 执行，参数里那个占位的 '-' 就成了要执行的命令，控制台刷出
#   '-' is not recognized as an internal or external command,
#   operable program or batch file.
# 命令其实一次都没跑，封面自然一张都生成不出来（用户日志里正是这一串报错）。
#
# 改成最朴素的重定向：把本进程的 STDOUT/STDERR 临时指到一个临时文件，再用
# system(@cmd列表) 执行。不经过 shell，参数不会被二次解析；stdout 和 stderr
# 也能一并收回来——ImageMagick 的「unable to read font」警告是打在 stderr 上的，
# 只收 stdout 就永远看不到这种「退出码为 0 的失败」。
# 重定向本身都搭不起来时才退回列表形式的管道，管道也开不了就直接执行。
#-----------------------------------------------------------------------
my $CAP_SEQ = 0;

sub capture_tmpfile {
    for my $dir (File::Spec->tmpdir, File::Spec->curdir) {
        next unless defined $dir && length $dir && -d $dir;
        my $p = File::Spec->catfile($dir,
                                    sprintf('make_mp4_cap_%d_%d.txt', $$, ++$CAP_SEQ));
        if (open(my $fh, '>', $p)) { close($fh); return $p; }
    }
    return undef;
}

# 返回 (是否成功, 输出文本, 原始退出码)。
# 退出码为 undef 表示命令压根没跑起来（重定向搭不起来），由 run_capture 换别的办法。
sub run_capture_redirect {
    my (@cmd) = @_;
    my $tmp = capture_tmpfile();
    return (0, '', undef) unless defined $tmp;

    my ($saved_out, $saved_err);
    if (!open($saved_out, '>&', \*STDOUT)) { unlink($tmp); return (0, '', undef); }
    if (!open($saved_err, '>&', \*STDERR)) {
        close($saved_out); unlink($tmp); return (0, '', undef);
    }
    if (!open(STDOUT, '>', $tmp) || !open(STDERR, '>&', \*STDOUT)) {
        open(STDOUT, '>&', $saved_out);
        open(STDERR, '>&', $saved_err);
        close($saved_out);
        close($saved_err);
        unlink($tmp);
        return (0, '', undef);
    }

    my $rc = system(@cmd);

    open(STDOUT, '>&', $saved_out);
    open(STDERR, '>&', $saved_err);
    close($saved_out);
    close($saved_err);
    # 重新打开 STDOUT 会把 $| 重置掉，恢复成行缓冲，控制台才不会攒着不吐
    my $old = select(STDOUT);
    $| = 1;
    select($old);

    my $out = read_bytes($tmp);
    unlink($tmp);
    $out = '' unless defined $out;
    return (($rc == 0 ? 1 : 0), $out, $rc);
}

sub run_capture_pipe {
    my (@cmd) = @_;
    my $pid = open(my $fh, '-|', @cmd);
    return (0, '', undef) unless defined $pid;
    local $/ = undef;
    my $out = <$fh>;
    close($fh);
    my $rc = $?;
    $out = '' unless defined $out;
    return (($rc == 0 ? 1 : 0), $out, $rc);
}

# 统一入口：返回 (是否成功, stdout+stderr 文本)。
# 只要命令确实跑起来了就用它的结果（哪怕没有任何输出），不会重复执行一次。
sub run_capture {
    my @cmd = native_cmd(@_);
    my ($ok, $out, $rc) = run_capture_redirect(@cmd);
    return ($ok, $out) if defined $rc;
    my ($ok2, $out2, $rc2) = run_capture_pipe(@cmd);
    return ($ok2, $out2) if defined $rc2;
    my $rc3 = system(@cmd);
    return (($rc3 == 0 ? 1 : 0), '');
}

sub capture {
    my @cmd = native_cmd(@_);
    my $text = join(' ', map { cmd_arg($_) } @cmd);
    my ($ok, $out) = run_capture(@cmd);
    $out = '' unless defined $out;
    log_write(sprintf('PROBE %s -> %s', $text, one_line($out)));
    return $out;
}

# 从命令输出里取一个数字。stderr 现在和 stdout 合并了，探测命令的警告里也可能
# 夹着数字，所以优先取「整行就是一个数」的那一行，取不到才退回最后一个数字。
sub num_from_output {
    my ($out) = @_;
    return undef unless defined $out && length $out;
    my $fallback;
    for my $line (split /\r?\n/, $out) {
        my $s = $line;
        $s =~ s/^\s+|\s+\z//g;
        return $s + 0 if $s =~ /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?\z/;
        $fallback = $1 + 0 if $s =~ /([-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/;
    }
    return $fallback;
}

# 读取媒体时长（秒），音频/视频都用它。用 ffprobe：它把结果打在 stdout 上，
# 既不用去捞 ffmpeg 的 stderr，也不需要 fork 管道（Windows 上那玩意儿不一定可靠）。
# 没有 ffprobe 就算了，只是少一个「幻灯片比音频长时提前截断」的优化。
sub probe_duration {
    my ($ffprobe, $audio) = @_;
    return undef unless defined $ffprobe && defined $audio && length $audio;
    my $out = capture($ffprobe, '-v', 'error',
                      '-show_entries', 'format=duration',
                      '-of', 'default=noprint_wrappers=1:nokey=1',
                      $audio);
    my $sec = num_from_output($out);
    return undef unless defined $sec;
    return $sec > 0 ? $sec + 0 : undef;
}

# 产物的时长 / 分辨率 / 体积 / 平均码率，只写进日志：核对 mp4 是不是真的合成了。
sub probe_video_info {
    my ($ffprobe, $file) = @_;
    my %v;
    if (defined $ffprobe && defined $file && length $file) {
        my $out = capture($ffprobe, '-v', 'error',
                          '-select_streams', 'v:0',
                          '-show_entries', 'format=duration,size:stream=width,height',
                          '-of', 'default=noprint_wrappers=1',
                          $file);
        for my $line (split /\r?\n/, (defined $out ? $out : '')) {
            my ($k, $val) = $line =~ /^([a-zA-Z_]+)=(\S+)\z/;
            $v{$k} = $val if defined $k;
        }
    }
    my $size = -s $file if defined $file && -e $file;
    $v{size} = $size if defined $size;
    return \%v;
}

sub fmt_video_info {
    my ($v) = @_;
    my @bits;
    push @bits, "$v->{width}x$v->{height}"
        if defined $v->{width} && defined $v->{height};
    push @bits, sprintf('%.1fs', $v->{duration}) if defined $v->{duration};
    my $kbps;
    if (defined $v->{size} && defined $v->{duration} && $v->{duration} > 0) {
        $kbps = $v->{size} * 8 / $v->{duration} / 1000;
        push @bits, sprintf('%s bytes (~%.0f kbps)', $v->{size}, $kbps);
    } elsif (defined $v->{size}) {
        push @bits, "$v->{size} bytes";
    }
    return @bits ? join(' ', @bits) : '(unknown)';
}

# 码率明显偏高时提醒一次：静态幻灯片本来应该很省，几百 kbps 就够了。
my $WARNED_BITRATE = 0;
sub warn_high_bitrate {
    my ($v) = @_;
    return if $WARNED_BITRATE;
    return unless defined $v->{size} && defined $v->{duration} && $v->{duration} > 0;
    my $kbps = $v->{size} * 8 / $v->{duration} / 1000;
    return if $kbps < 2500;
    $WARNED_BITRATE = 1;
    pout(sprintf("    note: video bitrate is high (%.0f kbps).\n", $kbps));
    pout("          try crf = 26~28, fps = 10~15, preset = veryfast in the ini\n");
    log_write(sprintf('NOTE high bitrate %.0f kbps (crf/fps/preset may need tuning)', $kbps));
}

sub run_cmd {
    my @cmd = native_cmd(@_);
    my $text = log_cmd(@cmd);
    return 1 if $cfg{dry_run};
    my $t0 = time;
    my $rc = system(@cmd);
    my $ok = ($rc == 0);
    log_write(sprintf('EXIT %s  (%ds)  %s', ($ok ? 'ok' : 'FAIL ' . ($rc >> 8)), time - $t0, $text));
    pwarn("    command failed (status ", ($rc >> 8), "): $text\n") unless $ok;
    return $ok;
}

# 同 run_cmd，但把子进程的 stdout/stderr 收回来，返回 (是否成功, 全部输出)。
# 输出逐行记进日志（OUT 行）；命令失败时把原因也回显到控制台，别只藏在日志里。
sub run_cmd_out {
    my @cmd = native_cmd(@_);
    my $text = log_cmd(@cmd);
    return (1, '') if $cfg{dry_run};
    my $t0 = time;
    my ($ok, $out) = run_capture(@cmd);
    $out = '' unless defined $out;
    log_write(sprintf('EXIT %s  (%ds)  %s', ($ok ? 'ok' : 'FAIL'), time - $t0, $text));
    my @lines = grep { !/^\s*\z/ } split /\r?\n/, $out;
    log_write('OUT  ' . $_) for @lines;
    if (!$ok) {
        pwarn("    command failed: $text\n");
        pout('    ! ', $_, "\n") for @lines;
    }
    return ($ok, $out);
}

# ImageMagick 读不出 -font 时只打一行警告、退出码仍是 0，然后悄悄退回
# 默认字体（中文往往就画不出来）。这种情况要当成「这个字体不能用」，
# 去换下一个候选字体，而不是拿输出凑合。
sub font_warning {
    my ($out, $font) = @_;
    return 0 unless defined $out && $out =~ /unable to read (?:the )?font/i;
    note_reason('font unusable: ' .
        (defined $font && length $font ? $font : '(ImageMagick default)'));
    return 1;
}

# 同一类诊断只打一次，避免几十首歌反复刷屏
sub note_reason {
    my ($msg) = @_;
    return if $REASON_SEEN{$msg}++;
    pwarn("    note: $msg\n");
}

sub find_tool {
    my ($kind, $explicit, @candidates) = @_;
    my @try = (defined $explicit && length $explicit) ? ($explicit) : @candidates;
    # --dry-run 时不做实际探测，只按配置/默认名继续
    return defined $explicit && length $explicit ? $explicit : $candidates[0] if $cfg{dry_run};
    for my $exe (@try) {
        my $ver = capture($exe, '-version');
        if ($ver !~ /\S/) {
            # 收不到输出的极少数环境：用户明确给出的、确实存在的可执行文件也认
            return $exe if $exe =~ m![\\/]! && -f $exe;
            next;
        }
        next if $kind eq 'magick' && $ver !~ /ImageMagick/i;
        next if $kind eq 'ffmpeg' && $ver !~ /ffmpeg version/i;
        next if $kind eq 'ffprobe' && $ver !~ /ffprobe version/i;
        return $exe;
    }
    return undef;
}

sub write_bytes {
    my ($file, $bytes) = @_;
    if ($cfg{dry_run}) {
        my ($preview) = split(/\n/, $bytes);
        pout("    [dry-run] write $file: $preview\n");
        return 1;
    }
    open(my $fh, '>', $file) or do { pwarn("Cannot write: $file\n"); return 0 };
    binmode($fh, ':raw');
    print $fh $bytes;
    close($fh);
    return 1;
}

sub read_bytes {
    my ($file) = @_;
    open(my $fh, '<:raw', $file) or return undef;
    local $/ = undef;
    my $data = <$fh>;
    close($fh);
    return defined $data ? $data : undef;
}

sub shuffle_list {
    my ($list) = @_;
    for (my $i = @$list - 1; $i > 0; $i--) {
        my $j = int(rand($i + 1));
        @$list[$i, $j] = @$list[$j, $i];
    }
    return $list;
}

sub strip_ext {
    my ($p) = @_;
    my $n = $p;
    $n =~ s!.*[\\/]!!;
    $n =~ s!\.[^.]*\z!!;
    return $n;
}

sub split_name {
    my ($name_native) = @_;
    my $name = dec_native($name_native);
    my ($title, $artist) = split(/\s*[-－—–]\s*/, $name, 2);
    $title  = '' unless defined $title;
    $artist = '' unless defined $artist;
    $title  =~ s/\s+/ /g;
    $artist =~ s/\s+/ /g;
    $title  =~ s/^\s+|\s+\z//g;
    $artist =~ s/^\s+|\s+\z//g;
    if ($title eq '') { $title = $name; $artist = ''; }
    return ($title, $artist);
}

sub scan_dir {
    my ($dir, $exts, $kind) = @_;
    my @out;
    opendir(my $dh, $dir) or die "Cannot open $kind directory: $dir\n";
    my @names = sort grep { $_ !~ /^\./ } readdir($dh);
    closedir($dh);
    for my $n (@names) {
        next unless $n =~ /^(.*)\.([^.]+)\z/s;
        next unless $exts->{lc $2};
        my $p = File::Spec->catfile($dir, $n);
        next unless -f $p;
        push @out, $p;
    }
    return @out;
}

#-----------------------------------------------------------------------
# 字体查找：优先用户指定，其次扫描系统字体目录里的中文字体
#-----------------------------------------------------------------------
sub list_font_files {
    my ($dir, $depth) = @_;
    return () if $depth < 0 || !defined $dir || !-d $dir;
    my @out;
    opendir(my $dh, $dir) or return ();
    my @names = readdir($dh);
    closedir($dh);
    for my $n (sort @names) {
        next if $n =~ /^\./;
        my $p = File::Spec->catdir($dir, $n);
        if (-d $p) {
            push @out, list_font_files($p, $depth - 1);
        } elsif ($n =~ /\.(?:tt[cf]|ot[cf])\z/i) {
            push @out, $p;
        }
    }
    return @out;
}

sub font_candidates {
    my @out;
    my %seen;
    my $add = sub {
        for my $f (@_) {
            next unless defined $f && length $f;
            next if $seen{$f}++;
            push @out, $f;
        }
    };

    $add->($cfg{font}) if defined $cfg{font} && length $cfg{font};

    my @dirs;
    push @dirs, ('C:/Windows/Fonts', 'C:/WINNT/Fonts') if $IS_WIN;
    push @dirs, ('/usr/share/fonts', '/usr/local/share/fonts', '/Library/Fonts', '/System/Library/Fonts');

    my @all;
    for my $d (@dirs) {
        push @all, list_font_files($d, 2) if -d $d;
    }

    # 常见中文字体文件名（只按 ASCII 文件名匹配，避免编码问题）
    my @prefer = (
        qr/^msyh/i,      qr/^msjh/i,      qr/^simhei/i,   qr/^simsun/i,
        qr/^simkai/i,    qr/^simfang/i,   qr/^deng/i,     qr/^stzhongs/i,
        qr/^stsong/i,    qr/^stkaiti/i,   qr/^stfangsong/i,
        qr/^yugoth/i,    qr/^msmincho/i,  qr/^meiryo/i,   qr/^malgun/i,
        qr/^notosanscjk/i, qr/^notoserifcjk/i, qr/^sourcehan/i,
        qr/^wqy/i,       qr/^pingfang/i,  qr/^hiragino/i, qr/^stheiti/i,
        qr/^arialuni/i,  qr/^arial.?unicode/i, qr/^uming/i, qr/^ukai/i,
    );
    for my $re (@prefer) {
        my @m = grep { my ($n) = m!([^/\\]+)\z!; defined $n && $n =~ $re } @all;
        $add->(@m) if @m;
    }
    $add->(@all);
    splice(@out, 10) if @out > 10;    # 最多尝试 10 个
    return @out;
}

#-----------------------------------------------------------------------
# 图片「是否为空画面」检查：整图标准差接近 0 说明只有背景色、没有内容。
# 透明底的图不能直接量（透明像素的 RGB 各版本不一样），要先用
# line_has_content 压到底色上再量。
#-----------------------------------------------------------------------
sub image_stddev {
    my ($magick, @args) = @_;
    for my $fmt ('%[fx:standard_deviation]', '%[standard-deviation]') {
        my $out = capture($magick, @args, '-format', $fmt, 'info:');
        my $v = num_from_output($out);
        next unless defined $v;
        return $v if $v == $v && $v < 1e30;   # 排除 nan / inf
    }
    return undef;
}

sub cover_stddev {
    my ($magick, $file) = @_;
    return undef unless defined $magick && defined $file && -e $file;
    return image_stddev($magick, slash_path($file));
}

# 一行文字图里是否真的画上了字：先合成到封面底色上变成不透明图再量标准差。
# 这样既量得准，也能顺带发现「字色和底色一样」的白底白字。
# 返回 1 有字 / 0 没有字 / undef 量不了
sub line_has_content {
    my ($magick, $file, $bg) = @_;
    return undef unless defined $magick && defined $file && -e $file;
    $bg = $COLOR_DEFAULT{cover_color} if !defined $bg || $bg !~ /\S/;
    my $sd = image_stddev($magick, slash_path($file), '-background', $bg, '-alpha', 'remove');
    return undef unless defined $sd;
    return $sd > $COVER_FLAT ? 1 : 0;
}

#-----------------------------------------------------------------------
# 封面配色：保证每个颜色都有值，避免 xc: 拿到空参数而画出白板
#-----------------------------------------------------------------------
sub cover_palette {
    my ($bg, $title, $artist) = @_;
    $bg     = $COLOR_DEFAULT{cover_color}  if !defined $bg     || $bg     !~ /\S/;
    $title  = $COLOR_DEFAULT{title_color}  if !defined $title  || $title  !~ /\S/;
    $artist = $COLOR_DEFAULT{artist_color} if !defined $artist || $artist !~ /\S/;
    return { bg => $bg, title => $title, artist => $artist };
}

# 粗略判断颜色是否偏亮（#RGB / #RRGGBB / #RRGGBBAA 以及 white / black）
sub is_light_color {
    my ($c) = @_;
    return 0 unless defined $c;
    my $s = lc $c;
    $s =~ s/^\s+|\s+\z//g;
    return 1 if $s eq 'white';
    return 0 if $s eq 'black';
    return 0 unless $s =~ /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\z/;
    my $hex = $1;
    $hex = substr($hex, 0, 6) if length($hex) == 8;                  # 忽略 alpha
    $hex = join('', map { $_ x 2 } split //, $hex) if length($hex) == 3;
    my ($r, $g, $b) = map { hex } ($hex =~ /(..)(..)(..)/);
    return (0.299 * $r + 0.587 * $g + 0.114 * $b) > 150 ? 1 : 0;
}

# 颜色归一化：white/black、#RGB、带 alpha 的 #RRGGBBAA 都换算成 #RRGGBB 比较
sub canon_color {
    my ($c) = @_;
    return '' unless defined $c;
    my $s = lc $c;
    $s =~ s/\s+//g;
    $s =~ s/^["']//;
    $s =~ s/["']\z//;
    return '#ffffff' if $s eq 'white';
    return '#000000' if $s eq 'black';
    $s =~ s/^(#[0-9a-f]{6})[0-9a-f]{2}\z/$1/;      # 丢掉 alpha
    if ($s =~ /^#([0-9a-f]{3})\z/) {
        my $h = $1;
        $h =~ s/(.)/$1$1/g;
        return "#$h";
    }
    return $s;
}

# 底色和文字色太接近（典型的「白底白字」）时需要换对比色
sub color_needs_contrast {
    my ($pal) = @_;
    my $bg = canon_color($pal->{bg});
    return 1 if $bg eq '';
    return 1 if canon_color($pal->{title})  eq $bg;
    return 1 if canon_color($pal->{artist}) eq $bg;
    return 0;
}

# 与底色对比明显的文字色，作为「白板封面」的最后兜底
sub contrast_palette {
    my ($pal) = @_;
    my $bg = defined $pal->{bg} && $pal->{bg} =~ /\S/ ? $pal->{bg} : $COLOR_DEFAULT{cover_color};
    if (is_light_color($bg)) {
        return { bg => $bg, title => '#101418', artist => '#38424e' };
    }
    return { bg => $bg, title => 'white', artist => '#c8d0d8' };
}

#-----------------------------------------------------------------------
# 封面文字字号：render_cover 与「两行是否都渲染出来」的校验共用
#-----------------------------------------------------------------------
sub cover_point_sizes {
    my ($VH) = @_;
    my $title_pt  = defined $cfg{title_size}  ? $cfg{title_size}  : int($VH * 0.085);
    my $artist_pt = defined $cfg{artist_size} ? $cfg{artist_size} : int($VH * 0.048);
    $title_pt  = 12 if $title_pt  < 12;
    $artist_pt = 10 if $artist_pt < 10;
    return ($title_pt, $artist_pt);
}

# 读取图片像素高度（ImageMagick 的 %h），失败返回 undef
sub image_height {
    my ($magick, $file) = @_;
    return undef unless defined $magick && defined $file && -e $file;
    my $out = capture($magick, slash_path($file), '-format', '%h', 'info:');
    my $h = num_from_output($out);
    return defined $h ? int($h) : undef;
}

#-----------------------------------------------------------------------
# 封面渲染（ImageMagick）
#   $mode = lines : 歌曲名 / 作者各占一张 caption 图，再纵向拼接，字号不同（默认）
#   $mode = single: 两行合成一张 caption 图（兜底方案）
#   $pal  : 配色 { bg, title, artist }，三个值都保证非空
#
#   每一行文字都单独开一条 ImageMagick 命令渲染成独立 PNG，并逐行校验
#   （文件写出、高度 > 0、画面上确实有字），再用另一条命令纵向拼接、居中
#   合成到底色上。旧写法把两行 caption 写在同一条命令里再 -append：
#   ImageMagick 丢掉第二个输入时只打警告、退出码仍是 0，于是出现
#   「artist.txt 有内容，cover_text.png 却只有第一行」这种静默丢行。
#   每行一条命令并逐行校验后，作者行要么确实画出来，要么这一轮交回
#   make_cover 去换字体 / 排版重试。
#
#   返回 (是否渲染成功, 文字图高度, 两行是否都确认画出来了)。
#   「渲染成功」只代表封面文件已写出：校验没通过时 make_cover 会继续挑更好的
#   候选，并把最后一张渲染出来的封面留作兜底，不会因为校验太严而没有封面。
#-----------------------------------------------------------------------

# 渲染一行文字到独立 PNG。
# 返回 (ok, checked)：
#   ok=0            —— 这一行没渲染出来（命令失败 / 没写出文件 / 字体读不出来）
#   ok=1, checked=0 —— 写出图了，但没法确认画面上有字（老版本 ImageMagick）
#   ok=1, checked=1 —— 写出图了，且确认画面上有字
sub render_line_png {
    my ($magick, $png, $text_file, $font, $fill, $pt, $text_w, $bg) = @_;

    # 先删掉上一轮留下的同名文件：不能把旧图当成本次的结果
    unlink($png) if !$cfg{dry_run} && -e $png;

    my @cmd = ($magick, '-background', 'none');
    push @cmd, ('-font', slash_path($font)) if defined $font && length $font;
    push @cmd, (
        '-fill', $fill,
        '-pointsize', $pt,
        '-size', "${text_w}x",
        '-gravity', 'center',
        '-define', 'caption:encoding=UTF-8',
        'caption:@' . slash_path($text_file),
        '+repage',
        slash_path($png),
    );
    my ($rok, $out) = run_cmd_out(@cmd);
    return (0, 0) unless $rok;
    return (1, 1) if $cfg{dry_run};
    return (0, 0) if font_warning($out, $font);

    my $size = -s $png;
    if (!defined $size || $size <= 0) {
        note_reason('a text line produced no image (check --font)');
        return (0, 0);
    }
    log_file('line', $png);
    my $h = image_height($magick, $png);
    if (defined $h && $h <= 0) {
        note_reason('a text line came out 0 pixel high (check --font)');
        return (0, 0);
    }
    my $has = line_has_content($magick, $png, $bg);
    if (defined $has && !$has) {
        note_reason('a text line rendered blank (missing glyphs, or text color = cover color)');
        return (1, 0);
    }
    return (1, 1);
}

sub render_cover {
    my ($magick, $cover, $work, $title, $artist, $font, $VW, $VH, $mode, $pal) = @_;

    $pal = cover_palette($cfg{cover_color}, $cfg{title_color}, $cfg{artist_color})
        unless defined $pal;

    my $text_w = int($VW * 0.86);
    my ($title_pt, $artist_pt) = cover_point_sizes($VH);
    my $stack  = File::Spec->catfile($work, 'cover_text.png');

    my $lines_ok = 1;      # 每一行都确认画上了字？
    my $stack_h;

    if ($mode eq 'lines' && $artist ne '') {
        my $tf = File::Spec->catfile($work, 'title.txt');
        my $af = File::Spec->catfile($work, 'artist.txt');
        return (0, undef, 0) unless write_bytes($tf, utf8_bytes($title));
        return (0, undef, 0) unless write_bytes($af, utf8_bytes($artist));

        my $tp = File::Spec->catfile($work, 'title_line.png');
        my $ap = File::Spec->catfile($work, 'artist_line.png');
        my ($tok, $tchk) = render_line_png($magick, $tp, $tf, $font, $pal->{title},
                                           $title_pt,  $text_w, $pal->{bg});
        my ($aok, $achk) = render_line_png($magick, $ap, $af, $font, $pal->{artist},
                                           $artist_pt, $text_w, $pal->{bg});

        # 歌名这一行都没画出来：这张封面没有意义，交给 make_cover 换字体 / 排版
        return (0, undef, 0) unless $tok;
        $lines_ok = ($aok && $tchk && $achk) ? 1 : 0;

        # 只拼真正渲染出来的行：作者行画不出来时，至少还留一张有歌名的封面，
        # 它会在 make_cover 里作为兜底结果参与择优
        my @line_png = grep { defined $_ } ($tok ? $tp : undef, $aok ? $ap : undef);
        @line_png = grep { -e $_ } @line_png unless $cfg{dry_run};
        my @cmd = (
            $magick, '-background', 'none',
            map { slash_path($_) } @line_png,
            '-gravity', 'center', '-append', '+repage',
            slash_path($stack),
        );
        return (0, undef, 0) unless run_cmd(@cmd);
        $stack_h = $cfg{dry_run} ? undef : image_height($magick, $stack);
    } else {
        # 兜底排版：一张 caption 同时装两行，字号 / 颜色只有一组
        my $text = $artist eq '' ? $title : "$title\n$artist";
        my $f = File::Spec->catfile($work, 'cover_text.txt');
        return (0, undef, 0) unless write_bytes($f, utf8_bytes($text));

        my @cmd = ($magick, '-background', 'none');
        push @cmd, ('-font', slash_path($font)) if defined $font && length $font;
        push @cmd, (
            '-fill', $pal->{title},
            '-pointsize', $title_pt,
            '-size', "${text_w}x",
            '-gravity', 'center',
            '-define', 'caption:encoding=UTF-8',
            'caption:@' . slash_path($f),
            '+repage',
            slash_path($stack),
        );
        my ($rok, $out) = run_cmd_out(@cmd);
        return (0, undef, 0) unless $rok;
        return (0, undef, 0) if font_warning($out, $font);
        $stack_h = $cfg{dry_run} ? undef : image_height($magick, $stack);
        # 这张图里是不是两行都在，交给 make_cover 的高度检查判断
        $lines_ok = 0;
    }

    # 第二步：文字图整体居中合成到底色上。底色显式写死：xc: 一旦拿到空颜色
    # 就会用 ImageMagick 默认的白色，这正是「封面完全白板」的根因。
    my @cmd = (
        $magick,
        '-encoding', 'UTF-8',
        '-background', $pal->{bg},
        '-size', "${VW}x${VH}",
        'xc:' . $pal->{bg},
        '-gravity', 'center',
        slash_path($stack),
        '-composite',
        '-quality', '92',
        '-strip',
        slash_path($cover),
    );
    return (0, undef, 0) unless run_cmd(@cmd);
    return (1, $stack_h, $lines_ok);
}

sub make_cover {
    my ($magick, $cover, $work, $title, $artist, $VW, $VH) = @_;

    my @fonts = font_candidates();
    @fonts = (undef) unless @fonts;      # 没找到字体时交给 ImageMagick 默认字体

    my $pal = cover_palette($cfg{cover_color}, $cfg{title_color}, $cfg{artist_color});
    # 「每行一张 caption」拼出来的文字图（透明底），校验封面文字用
    my $stack_png = File::Spec->catfile($work, 'cover_text.png');

    # 候选组合：[字体, 排版模式, 配色]
    my @tries;
    my $add_tries = sub {
        my ($p, $max) = @_;
        my $n = 0;
        for my $font (@fonts) {
            # 先试「每行一张 caption」：歌曲名和作者各自成图后再纵向拼接，
            # 第二行（作者）一定在画面里，而且两行可以用不同字号 / 颜色。
            # 万一某个 ImageMagick 版本在这种排版下渲染不出内容，再退回
            # 「一张 caption 装两行」的兜底排版。
            for my $mode ($artist eq '' ? ('single') : ('lines', 'single')) {
                last if $n >= $max;
                push @tries, [$font, $mode, $p];
                $n++;
            }
            last if $n >= $max;
        }
    };
    $add_tries->($pal, 10);
    # 白底白字之类的配色事故：再换一组对比色试几次
    $add_tries->(contrast_palette($pal), 6) if color_needs_contrast($pal);
    # 最后手段：所有候选字体都读不出来时，干脆不指定 -font，让 ImageMagick
    # 用自带默认字体画一次（这种调用不会报 unable to read font）
    push @tries, [undef, ($artist eq '' ? 'single' : 'lines'), $pal];
    push @tries, [undef, 'single', $pal] if $artist ne '';

    # 要求「歌曲名 / 作者各占一行」时，文字图至少要有两行那么高。
    # 单行高度约等于 1.2 x 字号，所以用两个字号的和对不上就说明只渲染出
    # 了一行（作者行丢了）——这时继续换字体 / 排版重试，而不是直接采用。
    my $need_two_lines = ($artist ne '') ? 1 : 0;
    my ($title_pt, $artist_pt) = cover_point_sizes($VH);
    my $min_text_h = $title_pt + $artist_pt;

    my $can_verify  = 1;
    my $can_text    = 1;
    my $best;    # 最后一次渲染成功的封面：所有候选都不合格时用它兜底
    for my $t (@tries) {
        my $font_name = defined $t->[0] ? $t->[0] : '(ImageMagick default)';
        log_write("COVER try font=$font_name mode=$t->[1]");
        my ($rok, $stack_h, $lines_ok) =
            render_cover($magick, $cover, $work, $title, $artist,
                         $t->[0], $VW, $VH, $t->[1], $t->[2]);
        if (!$rok) {
            log_write("COVER reject font=$font_name mode=$t->[1]: not rendered");
            next;
        }
        if ($cfg{dry_run}) {
            log_write("COVER accept (dry-run) font=$font_name mode=$t->[1]");
            return (1, $t->[0]);
        }
        log_file('cover', $cover);
        # 每轮都覆盖同一个封面文件，所以这里记下最后一次渲染出来的结果，
        # 后面所有候选都不合格时拿它兜底，别让这首歌干脆没有封面。
        $best = $t;

        # 用文字图（透明底）压到底色上量标准差，比量成品 jpg 可靠：jpg 的压缩
        # 噪点会把纯色画面顶到阈值以上，空白封面就会被误当成有内容收下。
        my $text_state;
        if ($can_text) {
            $text_state = line_has_content($magick, $stack_png, $t->[2]{bg});
            $can_text = 0 if !defined $text_state;
        }
        if (defined $text_state && !$text_state) {
            log_write("COVER reject font=$font_name mode=$t->[1]: no text drawn");
            next;
        }

        my $sd = $can_verify ? cover_stddev($magick, $cover) : undef;
        if (!defined $sd) {
            $can_verify = 0;     # 该 ImageMagick 不支持检测，直接采用
            log_write("COVER accept font=$font_name (size not measurable)");
            return (1, $t->[0]);
        }
        if ($sd <= $COVER_FLAT) {
            log_write(sprintf('COVER reject font=%s: blank cover (sd=%.4f)', $font_name, $sd));
            next;
        }
        if ($lines_ok) {                                # 两行都确认画出来了
            log_write("COVER accept font=$font_name mode=$t->[1] (both lines verified)");
            return (1, $t->[0]);
        }
        if ($need_two_lines && defined $stack_h && $stack_h < $min_text_h) {
            log_write(sprintf('COVER reject font=%s: text height %.0f < %.0f',
                              $font_name, $stack_h, $min_text_h));
            next;
        }
        log_write("COVER accept font=$font_name mode=$t->[1]");
        return (1, $t->[0]);
    }
    if (defined $best) {
        # 没有完全合格的候选：先把最后渲染出来的那张用上（$best 就是它），
        # 但要把问题说清楚，别让用户以为封面是好的。
        my $state = line_has_content($magick, $stack_png, $best->[2]{bg});
        if (defined $state && !$state) {
            log_write('COVER accept best-effort: no text on the cover');
            pwarn("  !! cover text was not drawn (font cannot draw these characters): $title\n");
        } elsif ($need_two_lines) {
            log_write('COVER accept best-effort (artist line may be missing)');
            pwarn("  !! cover may be missing the artist line: $title\n");
        } else {
            log_write('COVER accept best-effort');
        }
        return (1, $best->[0]);
    }
    log_write('COVER FAIL: no candidate rendered');
    return (0, undef);
}

#-----------------------------------------------------------------------
# 幻灯片列表：只含图片，按（可随机）顺序依次播放
#-----------------------------------------------------------------------
sub concat_path {
    my ($p) = @_;
    # ffconcat 里的相对路径是相对「列表文件」所在目录解析的，
    # 也就是 out/_work/ 下面，图片会找不到，所以统一写成绝对路径。
    my $s = utf8_bytes(File::Spec->rel2abs($p));
    $s =~ s!\\!/!g;
    my $esc = "'\\''";
    $s =~ s/'/$esc/g;
    return $s;
}

sub write_photo_list {
    my ($file, $slides) = @_;
    my $buf = "ffconcat version 1.0\n";
    for my $s (@$slides) {
        $buf .= "file '" . concat_path($s->[0]) . "'\n";
        $buf .= sprintf("duration %.3f\n", $s->[1]) if defined $s->[1];
    }
    # 最后一张重复一次，避免 concat 忽略最后一项的 duration
    $buf .= "file '" . concat_path($slides->[-1][0]) . "'\n";
    return write_bytes($file, $buf);
}

# 合并用的 ffconcat 列表：按顺序列出要拼的视频段（幻灯片 × N）。
# 用有限次循环代替 -stream_loop -1 的无限输入，循环次数是算出来的，
# 不会出现「无限循环收不住、成片一直重复到几个 G」。
sub write_concat_list {
    my ($file, @parts) = @_;
    @parts = grep { defined $_ && length $_ } @parts;
    return 0 unless @parts;
    my $buf = "ffconcat version 1.0\n";
    $buf .= "file '" . concat_path($_) . "'\n" for @parts;
    return write_bytes($file, $buf);
}

#-----------------------------------------------------------------------
# 第一步：生成幻灯片视频（无音轨）
#   图片按 concat 列表交给 ffmpeg；片头封面单独编成一段，放在最前面，
#   各段编码参数一致，用 concat copy 拼成整条幻灯片。
#-----------------------------------------------------------------------
sub video_filter {
    my ($VW, $VH) = @_;
    return join(',',
        "scale=${VW}:${VH}:force_original_aspect_ratio=decrease:out_range=limited",
        "pad=${VW}:${VH}:(ow-iw)/2:(oh-ih)/2:color=$cfg{pad_color}",
        "fps=$cfg{fps}",
        'setsar=1',
        'format=yuv420p',
    );
}

# 一组连续图片（或单独一张片头封面）-> 一个视频片段。
#
# 封面用 -loop 1 -t 编码成精确的 cover_seconds 秒（封面不需要靠 ffconcat 的
# duration，旧写法那样做 cover 经常只剩不到一帧，成片里就看不到封面）。
# 封面单独成一段、正片另成若干段，各段参数完全一致，最后 concat copy 拼起来。
sub build_image_clip {
    my ($ffmpeg, $photo_list, $out_file, $VW, $VH, $max_sec, $cover, $cover_sec) = @_;

    my $has_list  = (defined $photo_list && length $photo_list) ? 1 : 0;
    my $has_cover = (defined $cover && length $cover) ? 1 : 0;
    # 没有图片也没有封面可编码时直接失败
    return 0 unless $has_list || $has_cover;

    my $vf = video_filter($VW, $VH);
    my @cmd = (
        # -nostdin：别让 ffmpeg 去读终端（Windows 下会把它自己挂住，看着就是「特别慢」）
        $ffmpeg, '-hide_banner', '-nostdin', '-y',
    );
    if ($has_cover) {
        # -loop 1 -t 把封面读成正好 cover_sec 秒；缺了 -t 封面就只是一帧
        my $sec = (defined $cover_sec && $cover_sec > 0) ? $cover_sec : 1;
        push @cmd, ('-loop', '1', '-t', sprintf('%.3f', $sec), '-i', $cover);
        if ($has_list) {
            push @cmd,
                ('-f', 'concat', '-safe', '0', '-i', $photo_list,
                 '-filter_complex',
                 "[0:v]${vf}[cv];[1:v]${vf}[sv];[cv][sv]concat=n=2:v=1:a=0[out]",
                 '-map', '[out]');
        } else {
            push @cmd, ('-vf', $vf);
        }
    } else {
        push @cmd, ('-f', 'concat', '-safe', '0', '-i', $photo_list, '-vf', $vf);
    }
    push @cmd, (
        '-an',
        '-c:v', $cfg{vcodec},
        @VENC_ARGS,
        '-pix_fmt', 'yuv420p',
        '-r', $cfg{fps},
    );
    # 音频比幻灯片短时只编码到音频结束，剩下的画面反正会被 -shortest 丢掉
    push @cmd, ('-t', $max_sec) if defined $max_sec && $max_sec > 0;
    push @cmd, $out_file;
    return run_cmd(@cmd);
}

# 一个视频片段 -> 规范化成和图片片段完全相同的编码参数（分辨率/帧率/像素格式/
# 编码设置都一致），这样两者才能 concat copy 到同一条视频流里。原声丢弃。
sub build_video_clip {
    my ($ffmpeg, $clip, $out_file, $VW, $VH, $max_sec) = @_;
    my @cmd = (
        $ffmpeg, '-hide_banner', '-nostdin', '-y',
        '-i', $clip,
        '-an',
        '-vf', video_filter($VW, $VH),
        '-c:v', $cfg{vcodec},
        @VENC_ARGS,
        '-pix_fmt', 'yuv420p',
        '-r', $cfg{fps},
    );
    push @cmd, ('-t', $max_sec) if defined $max_sec && $max_sec > 0;
    push @cmd, $out_file;
    return run_cmd(@cmd);
}

# 把若干片段按顺序拼成幻灯片视频：参数一致，直接 copy，不重新编码。
sub concat_segments {
    my ($ffmpeg, $list_file, $out_file) = @_;
    my @cmd = (
        $ffmpeg, '-hide_banner', '-nostdin', '-y',
        '-f', 'concat', '-safe', '0', '-i', $list_file,
        '-c', 'copy',
        $out_file,
    );
    return run_cmd(@cmd);
}

# 兜底拼接：concat demuxer 要求各段编码参数完全一致，万一某段（比如某个视频
# 片段）参数对不上它会直接拒绝。这时把每段当成独立输入，用 concat 滤镜重编
# 一遍——慢一些，但一定能拼出来。
sub concat_segments_filter {
    my ($ffmpeg, $out_file, @segs) = @_;
    return 0 unless @segs;
    my @cmd = ($ffmpeg, '-hide_banner', '-nostdin', '-y');
    my @labels;
    for my $i (0 .. $#segs) {
        push @cmd, ('-i', $segs[$i]);
        push @labels, "[$i:v]";
    }
    push @cmd, (
        '-filter_complex', join('', @labels) . 'concat=n=' . scalar(@segs) . ':v=1:a=0[out]',
        '-map', '[out]',
        '-an',
        '-c:v', $cfg{vcodec},
        @VENC_ARGS,
        '-pix_fmt', 'yuv420p',
        '-r', $cfg{fps},
        $out_file,
    );
    return run_cmd(@cmd);
}

# 把有序的媒体列表切成片段：连续的图片合成一段（省时间），视频各自成一段，
# 片头封面单独成一段。每段带 dur（预计时长），用来算「需要多长画面」的预算。
sub split_chunks {
    my ($media, $seconds) = @_;
    my @chunks;
    for my $m (@$media) {
        # 每张图自己的时长：封面用 cover_seconds，其余图片用 seconds
        my $dur = (defined $m->{dur} && $m->{type} eq 'image') ? $m->{dur} : $seconds;
        if ($m->{type} eq 'video') {
            push @chunks, {
                type    => 'video',
                files   => [ $m->{path} ],
                entries => [ [ $m->{path}, undef ] ],
                dur     => $m->{dur},
            };
        } elsif (@chunks && $chunks[-1]{type} eq 'images' && !$chunks[-1]{cover}) {
            my $c = $chunks[-1];
            push @{ $c->{files} }, $m->{path};
            push @{ $c->{entries} }, [ $m->{path}, $dur ];
            $c->{dur} += $dur;
        } else {
            push @chunks, {
                type    => 'images',
                # 封面永远是 @media 的第一项，单独占一段：这样它既能在成片开头
                # 用 -loop 1 -t 写死 cover_seconds 秒，又不会跟着正片一起被循环
                # 重复（后面的循环只重复不带封面的正片片段）。
                cover   => ($m->{cover} ? 1 : 0),
                files   => [ $m->{path} ],
                entries => [ [ $m->{path}, $dur ] ],
                dur     => $dur,
            };
        }
    }
    return @chunks;
}

#-----------------------------------------------------------------------
# 第二步：循环正片并配上音频（视频流直接 copy，快且不损失画质）
#-----------------------------------------------------------------------
# 最后一步不重新编码画面：把正片（封面之后的图片/视频片段）copy 着循环铺满
# 音频时长，片头封面只排在最前面一份，所以不会跟着循环重复出现。
# 所以这一步的体积 ≈ 幻灯片体积 × 循环次数——幻灯片小了，这里就既快又小。
#
# 循环用「同一个文件在 ffconcat 列表里写 N 遍」的有限循环，不再用
# -stream_loop -1 的无限输入：只靠 -shortest 收尾时，个别 ffmpeg 版本不会
# 在音频结束处停下，画面会一直重复下去——音频 20M、幻灯片 10M，成片却能
# 涨到几个 G 就是这么来的。这里循环次数是算好的，再给输出加一个 -t 上限，
# 两头都封死：音频多长，成片就多长。
sub make_video {
    my ($ffmpeg, $slides, $loop_list, $audio, $out_mp4, $max_sec) = @_;
    my @in = (defined $loop_list && length $loop_list)
           ? ('-f', 'concat', '-safe', '0', '-i', $loop_list)
           : ('-stream_loop', '-1', '-i', $slides);
    my @cmd = (
        # -nostdin：同上，避免 ffmpeg 读终端把批处理卡住
        $ffmpeg, '-hide_banner', '-nostdin', '-y',
        @in,
        '-i', $audio,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'copy',
        '-c:a', $cfg{acodec},
        '-b:a', $cfg{abitrate},
        '-movflags', '+faststart',
    );
    push @cmd, ('-t', $max_sec) if defined $max_sec && $max_sec > 0;
    push @cmd, '-shortest';
    push @cmd, $out_mp4;
    return run_cmd(@cmd);
}

#-----------------------------------------------------------------------
# 配置文件
#-----------------------------------------------------------------------
my %KEY_ALIAS = (
    audio_dir       => 'audio',
    audiodir        => 'audio',
    audio_directory => 'audio',
    music           => 'audio',
    music_dir       => 'audio',
    image_dir       => 'images',
    imagedir        => 'images',
    image_directory => 'images',
    picture_dir     => 'images',
    pic_dir         => 'images',
    pics            => 'images',
    pictures        => 'images',
    out_dir         => 'out',
    outdir          => 'out',
    output          => 'out',
    output_dir      => 'out',
);

my %BOOL_KEY = map { $_ => 1 } qw(force keep_temp keep_cover dry_run shuffle verify_cover);

# 值是否形如颜色（#RGB / #RRGGBB / #RRGGBBAA）。
# 用来区分颜色里的 '#' 和行尾注释的 '#'：否则 cover_color = #101418
# 会被当成注释截断成空值，封面就变成一整张白板。
sub is_color_value {
    my ($v) = @_;
    return 0 unless defined $v;
    my $s = $v;
    $s =~ s/^\s+|\s+\z//g;
    $s =~ s/^["'](.*)["']\z/$1/s;
    $s =~ s/^\s+|\s+\z//g;
    return $s =~ /^#[0-9A-Fa-f]{3,8}\z/ ? 1 : 0;
}

sub read_config {
    my ($file) = @_;
    open(my $fh, '<:raw', $file) or die "Cannot open config file: $file\n";
    my %h;
    while (my $line = <$fh>) {
        $line = decode('UTF-8', $line, Encode::FB_DEFAULT);
        $line =~ s/\r?\n\z//;
        $line =~ s/^\x{feff}//;
        next if $line =~ /^\s*[#;]/;          # 整行注释
        my ($k, $v) = $line =~ /^\s*([\w.\-]+)\s*[=:]\s*(.*?)\s*\z/;
        next unless defined $k;
        my $quoted = 0;
        if ($v =~ /^"(.*)"\z/s || $v =~ /^'(.*)'\z/s) { $v = $1; $quoted = 1; }
        # 去掉行尾注释；值是颜色时保留 '#'，否则颜色会被吃掉变成空值
        $v =~ s/\s+[#;].*\z// unless $quoted || is_color_value($v);
        $v =~ s/^\s+|\s+\z//g;
        $v = strip_invisible($v);
        next if $v eq '';                     # 空值不覆盖默认配置
        $k = lc $k;
        $k = $KEY_ALIAS{$k} if exists $KEY_ALIAS{$k};
        next unless exists $cfg{$k};
        if ($BOOL_KEY{$k}) {
            $v = ($v =~ /^(1|true|yes|on)$/i) ? 1 : 0;
        }
        $h{$k} = $v;
    }
    close($fh);
    return \%h;
}

#=======================================================================
# main
#=======================================================================

# 1) 命令行
my %cli;
GetOptions(
    'a|audio=s'       => \$cli{audio},
    'i|images=s'      => \$cli{images},
    'o|out=s'         => \$cli{out},
    'c|config=s'      => \$cli{config},
    'font=s'          => \$cli{font},
    'size=s'          => \$cli{size},
    'fps=i'           => \$cli{fps},
    's|seconds=i'     => \$cli{seconds},
    'cover-seconds=f' => \$cli{cover_seconds},
    'cover-color=s'   => \$cli{cover_color},
    'title-color=s'   => \$cli{title_color},
    'artist-color=s'  => \$cli{artist_color},
    'title-size=i'    => \$cli{title_size},
    'artist-size=i'   => \$cli{artist_size},
    'vcodec=s'        => \$cli{vcodec},
    'crf=i'           => \$cli{crf},
    'preset=s'        => \$cli{preset},
    'abitrate=s'      => \$cli{abitrate},
    'pad-color=s'     => \$cli{pad_color},
    'shuffle!'        => \$cli{shuffle},
    'verify-cover!'   => \$cli{verify_cover},
    'force'           => \$cli{force},
    'keep-temp'       => \$cli{keep_temp},
    'keep-cover!'     => \$cli{keep_cover},
    'dry-run'         => \$cli{dry_run},
    'magick=s'        => \$cli{magick},
    'ffmpeg=s'        => \$cli{ffmpeg},
    'charset=s'       => \$cli{charset},
    'h|help'          => \$cli{help},
) or usage(1);
usage(0) if $cli{help};

# 2) 配置文件（默认脚本目录 / 当前目录下的 make_mp4.ini）
my $script_dir = $0;
$script_dir =~ s![\\/][^\\/]*\z!!;
$script_dir = '.' if $script_dir eq $0 || $script_dir eq '';

my $config_file = defined $cli{config} ? clean_bytes($cli{config}) : undef;
if (!defined $config_file) {
    for my $c (File::Spec->catfile($script_dir, 'make_mp4.ini'),
               File::Spec->catfile(File::Spec->curdir(), 'make_mp4.ini')) {
        if (-f $c) { $config_file = $c; last; }
    }
}
if (defined $config_file) {
    my $h = read_config($config_file);
    for my $k (keys %$h) { $cfg{$k} = $h->{$k} if !defined $cli{$k}; }
    pout("config: $config_file\n");
}

# 3) 合并优先级：命令行 > 配置文件 > 默认值
for my $k (keys %cli) {
    next unless exists $cfg{$k};
    next unless defined $cli{$k};
    # 命令行参数是本机编码的字节串：先清掉不可见字符再合并
    $cfg{$k} = ref($cli{$k}) ? $cli{$k} : clean_bytes($cli{$k});
}

# 4) 位置参数：音频目录 图片目录
if (!defined $cfg{audio} && @ARGV && $ARGV[0] !~ /^-/) { $cfg{audio}  = shift @ARGV; }
if (!defined $cfg{images} && @ARGV && $ARGV[0] !~ /^-/) { $cfg{images} = shift @ARGV; }

# 5) 字符集
if (defined $cfg{charset} && length $cfg{charset}) {
    $SRC_ENC = $cfg{charset};
} elsif ($IS_WIN) {
    my $acp;
    eval { require Win32; $acp = eval { Win32::GetACP() }; };
    $SRC_ENC = ($acp && $acp =~ /^\d+$/) ? "cp$acp" : 'CP936';
}
eval { decode($SRC_ENC, '', Encode::FB_DEFAULT) };
if ($@) {
    pwarn("Unknown charset '$SRC_ENC', fallback to UTF-8\n");
    $SRC_ENC = 'UTF-8';
}

# 6) 校验路径
usage(1) if !defined $cfg{audio} || !length $cfg{audio};

my $audio_dir = native_bytes($cfg{audio});
my $image_dir = defined $cfg{images} && length $cfg{images} ? native_bytes($cfg{images}) : undef;

if (!-d $audio_dir) { die "audio directory not found: $audio_dir\n"; }
if (!defined $image_dir) { die "image directory is required (-i <dir>)\n"; }
if (!-d $image_dir) { die "image directory not found: $image_dir\n"; }

my $out_dir   = defined $cfg{out} && length $cfg{out}
              ? native_bytes($cfg{out})
              : File::Spec->catdir($audio_dir, 'out');
my $cover_dir = File::Spec->catdir($out_dir, 'covers');
my $work_dir  = File::Spec->catdir($out_dir, '_work');

# 7) 视频尺寸
my ($VW, $VH) = $cfg{size} =~ /^\s*(\d+)\s*[xX*]\s*(\d+)\s*\z/;
if (!defined $VW || !defined $VH) { die "invalid --size '$cfg{size}', expected e.g. 1280x720\n"; }
$VW = int($VW); $VH = int($VH);
$VW -= 1 if $VW % 2; $VH -= 1 if $VH % 2;

# 7.5) 片头封面时长：成片开头显示封面多少秒（0 = 不插封面）
my $cover_sec = 0;
if (defined $cfg{cover_seconds} && $cfg{cover_seconds} =~ /\A\s*(\d+(?:\.\d+)?)\s*\z/) {
    $cover_sec = $1 + 0;
} elsif (defined $cfg{cover_seconds} && $cfg{cover_seconds} =~ /\S/) {
    pwarn("cover_seconds = '$cfg{cover_seconds}' is not a number, cover intro disabled\n");
}
if ($cover_sec > 30) {
    pwarn("cover_seconds = $cover_sec is too long, clamped to 30\n");
    $cover_sec = 30;
}

# 8) 查找外部程序
my $magick = find_tool('magick', $cfg{magick}, 'magick', 'magick.exe', 'convert', 'convert.exe');
my $ffmpeg = find_tool('ffmpeg', $cfg{ffmpeg}, 'ffmpeg', 'ffmpeg.exe');
if (!defined $magick) { die "ImageMagick not found. Install it, or set --magick \"C:\\Path\\To\\magick.exe\"\n"; }
if (!defined $ffmpeg) { die "ffmpeg not found. Install it, or set --ffmpeg \"C:\\Path\\To\\ffmpeg.exe\"\n"; }

# ffprobe 用来读音频时长：结果打在 stdout 上，不用去捞 ffmpeg 的 stderr。
# 找不到也没关系，只是少一个「幻灯片比音频长时提前截断」的优化。
my @ffprobe_cand = ('ffprobe', 'ffprobe.exe');
if ($ffmpeg =~ m![\\/]!) {
    my $dir = $ffmpeg;
    $dir =~ s![\\/][^\\/]*\z!!;
    unshift @ffprobe_cand,
        File::Spec->catfile($dir, 'ffprobe.exe'),
        File::Spec->catfile($dir, 'ffprobe');
}
my $ffprobe = find_tool('ffprobe', undef, @ffprobe_cand);

# 9) 编码参数
#
# 幻灯片是「静态图切片」，这里的设置直接决定最终文件的大小：最后一步只是把
# 这段很短的视频流 copy 着循环铺满音频时长，所以幻灯片多大，成片就多大，
# 拷贝要搬的数据量（也就是耗时）也随它走。
#
# 关键点是「每次换图必须落在一个关键帧（I 帧）上」：
#   * 老写法用 -tune stillimage，x264 会把最大关键帧间隔设成无限大；
#   * 再叠加 -preset ultrafast（x264 的 scenecut 被关掉，不会自动插关键帧），
#   结果整段视频只有开头一个 I 帧，之后每次换图都只能编成「巨大的 P 帧」
#   （整张完全不同的画面按残差硬编），体积比正常大一个数量级，
#   最后合并既慢又大。
# 现在显式打关键帧：-force_key_frames 按每张图片的时长强制插 I 帧，
# -g 再兜一个最大间隔，换图处是 I 帧、静止段是几乎不占字节的 P 帧。
my $img_sec = (defined $cfg{seconds} && $cfg{seconds} > 0) ? $cfg{seconds} : 5;
if ($cfg{vcodec} =~ /x26[45]/) {
    push @VENC_ARGS, ('-crf', $cfg{crf}, '-preset', $cfg{preset});
    my $gop = int($cfg{fps} * $img_sec);
    $gop = 1 if $gop < 1;
    my $gop_max = int($cfg{fps} * 30);
    $gop = $gop_max if $gop_max > 0 && $gop > $gop_max;
    push @VENC_ARGS, ('-g', $gop);
    push @VENC_ARGS, ('-force_key_frames', sprintf('expr:gte(t,n_forced*%.3f)', $img_sec));
} else {
    push @VENC_ARGS, ('-qscale:v', 3);
}

# 10) 扫描文件
my %A_EXT = map { lc($_) => 1 } @AUDIO_EXT;
my %I_EXT = map { lc($_) => 1 } @IMAGE_EXT;
my %V_EXT = map { lc($_) => 1 } @VIDEO_EXT;

my @audios      = scan_dir($audio_dir, \%A_EXT, 'audio');
my @image_files = scan_dir($image_dir, \%I_EXT, 'image');
my @video_files = scan_dir($image_dir, \%V_EXT, 'video');

if (!@audios) { die "no audio files found in: $audio_dir\n"; }
if (!@image_files && !@video_files) {
    die "no image or video files found in: $image_dir\n";
}

# 图片和视频片段合成一个媒体列表（先按文件名排序，之后整首曲子可以再打乱）。
# dur 只有视频才需要探测（决定幻灯片总长），探到一次就缓存下来给后面的曲子用。
my @MEDIA = sort { $a->{path} cmp $b->{path} }
            (map { { type => 'image', path => $_ } } @image_files),
            (map { { type => 'video', path => $_ } } @video_files);
my $fonts = join(' | ', font_candidates());
$fonts = '(none found)' if $fonts eq '';

if (!ensure_dir($out_dir))   { die "cannot use output dir: $out_dir\n"; }
if (!ensure_dir($cover_dir)) { die "cannot use cover dir: $cover_dir\n"; }
if (!ensure_dir($work_dir))  { die "cannot use work dir: $work_dir\n"; }

# 日志：从这一刻起，每条外部命令、每个产出文件、每次封面取舍都记进去。
# 出了问题直接把 make_mp4.log 发出来就能复现现场。
my $log_path = File::Spec->catfile($out_dir, 'make_mp4.log');
log_open($log_path);
log_write("script    : $0");
log_write('config    : ' . (defined $config_file ? $config_file : '(none)'));
log_write("charset   : $SRC_ENC");
log_write("audio dir : $audio_dir (" . scalar(@audios) . ' files)');
log_write("image dir : $image_dir (" . scalar(@image_files) . ' images + '
          . scalar(@video_files) . ' videos)');
log_write("output dir: $out_dir");
log_write(sprintf("video     : %dx%d @%d fps, %.3gs per image", $VW, $VH, $cfg{fps}, $cfg{seconds}));
log_write("tools     : $magick | $ffmpeg | " . (defined $ffprobe ? $ffprobe : '(no ffprobe)'));
log_write("fonts     : $fonts");
log_write('cover     : ' . ($cover_sec > 0
    ? sprintf('%.1fs at the start of each mp4 (played once)', $cover_sec)
    : 'no cover intro (cover_seconds = 0)'));
note_reason('config contained invisible characters (zero-width / bidi); they were stripped')
    if $CFG_CLEANED;

poutf("audio dir : %s (%d file%s)\n", $audio_dir, scalar @audios, @audios == 1 ? '' : 's');
poutf("image dir : %s (%d image%s + %d video%s)\n",
      $image_dir, scalar @image_files, @image_files == 1 ? '' : 's',
      scalar @video_files, @video_files == 1 ? '' : 's');
poutf("output dir: %s\n", $out_dir);
poutf("video     : %dx%d @%d fps, %.3gs per image\n", $VW, $VH, $cfg{fps}, $cfg{seconds});
poutf("tools     : %s | %s | %s\n", $magick, $ffmpeg, (defined $ffprobe ? $ffprobe : '(none)'));
poutf("fonts     : %s\n", $fonts);
poutf("cover     : %s\n", $cover_sec > 0
    ? sprintf('%.1fs at the start of each mp4 (played once)', $cover_sec)
    : 'no cover intro');
poutf("log       : %s\n", $log_path);

# 封面是按文件名缓存的，只看「非空」是不够的：渲染逻辑或配色改过之后，
# 旧封面必须重建，否则修好的排版永远看不到。这里把封面格式版本和相关
# 配置一起写成签名存进 covers 目录，签名变了就强制重建（不用手动 --force）。
my $cover_stamp = File::Spec->catfile($cover_dir, '.cover_format');
my $cover_sig   = utf8_bytes(join('|',
    $COVER_FORMAT,
    (defined $cfg{size}         ? $cfg{size}         : '-'),
    (defined $cfg{font}         ? $cfg{font}         : '-'),
    (defined $cfg{cover_color}  ? $cfg{cover_color}  : '-'),
    (defined $cfg{title_color}  ? $cfg{title_color}  : '-'),
    (defined $cfg{artist_color} ? $cfg{artist_color} : '-'),
    (defined $cfg{title_size}   ? $cfg{title_size}   : '-'),
    (defined $cfg{artist_size}  ? $cfg{artist_size}  : '-'),
));
my $cover_stale = 1;
{
    my $old = read_bytes($cover_stamp);
    $cover_stale = 0 if defined $old && $old eq $cover_sig;
}
if ($cover_stale) {
    # 缓存作废（脚本更新了封面排版，或改了封面相关配置）：旧封面在下次用到
    # 时会自动重建。
    my @old_covers;
    my $cdh;
    if (opendir($cdh, $cover_dir)) {
        @old_covers = grep { $_ !~ /^\./ && -f File::Spec->catfile($cover_dir, $_) } readdir($cdh);
        closedir($cdh);
    }
    if (@old_covers) {
        pout("cover format/settings changed: ", scalar(@old_covers),
             " cached cover(s) will be regenerated\n");
    }
    write_bytes($cover_stamp, $cover_sig) unless $cfg{dry_run};
}

# 11) 逐个音频处理
my ($ok, $fail, $skip, $no_cover) = (0, 0, 0, 0);
my $total = scalar @audios;
my $n = 0;
my $font_used;

for my $audio (@audios) {
    $n++;
    my $base    = strip_ext($audio);
    my $out_mp4 = File::Spec->catfile($out_dir, $base . '.mp4');

    if (-e $out_mp4 && !$cfg{force}) {
        my $old_size = -s $out_mp4;
        if (defined $old_size && $old_size >= $MIN_MP4_SIZE) {
            pout("[$n/$total] skip (exists): $base.mp4\n");
            $skip++;
            next;
        }
        # 上次失败留下的半成品：删掉重做，否则会被永久跳过
        pwarn("  removing broken output ($old_size bytes): $base.mp4\n");
        unlink($out_mp4) unless $cfg{dry_run};
    }

    pout("[$n/$total] $base\n");
    log_write("[$n/$total] $base");

    my ($title, $artist) = split_name($base);
    my $cover = File::Spec->catfile($cover_dir, $base . '.jpg');
    log_write("TEXT  title=$title artist=$artist");
    log_write("COVER target=$cover");

    # 封面：已存在、不是空画面、且是当前格式生成的才复用
    my $have_cover = -e $cover ? 1 : 0;
    my $need_cover = !$have_cover || $cfg{force} || $cover_stale;
    if (!$need_cover && $cfg{verify_cover} && !$cfg{dry_run}) {
        my $sd = cover_stddev($magick, $cover);
        if (defined $sd && $sd <= $COVER_FLAT) {
            pwarn("  cover looks blank, regenerating: $base.jpg\n");
            $need_cover = 1;
        }
    }

    if (!$need_cover) {
        log_file('cover', $cover);        # 复用已有封面：也记一笔，方便核对
    }
    if ($need_cover) {
        my ($cok, $cused) = make_cover($magick, $cover, $work_dir, $title, $artist, $VW, $VH);
        if ($cok) {
            $have_cover = 1;
            if (defined $cused && (!defined $font_used || $font_used ne $cused)) {
                pout("    cover font: $cused\n");
                $font_used = $cused;
            }
        } else {
            pwarn("  !! cannot render cover text for: $base\n");
            unlink($cover) if -e $cover && !$cfg{dry_run};
            $have_cover = 0;
            $no_cover++;
        }
    }

    # 图片 + 视频片段随机顺序（视频按自身时长整段接入）
    my @media = @MEDIA;
    shuffle_list(\@media) if $cfg{shuffle};

    # 片头封面：当成「第一张幻灯片」插进同一个图片片段里，和后面的画面同一趟
    # 编码出来。以前是单独编一段封面再 concat copy 上去，两段视频在接缝处的
    # 起点时间戳、时间基、关键帧位置都对不齐，播放时封面之后那几秒就会抖动。
    my $cover_used = 0;
    if ($cover_sec > 0) {
        if ($have_cover && ($cfg{dry_run} || -e $cover)) {
            $cover_used = $cover_sec;
            unshift @media, {
                type  => 'image',
                path  => $cover,
                dur   => $cover_sec,
                cover => 1,
            };
            log_write(sprintf('COVER  intro %.1fs encoded with the first image chunk', $cover_sec));
        } elsif (!$cfg{dry_run}) {
            note_reason('cover_seconds is set but no cover image exists - no cover intro');
        }
    }

    # 视频片段要先知道时长：决定幻灯片总长和「只编码需要的部分」的预算
    for my $m (@media) {
        next unless $m->{type} eq 'video' && !defined $m->{dur};
        next if $cfg{dry_run};
        $m->{dur} = probe_duration($ffprobe, $m->{path});
        note_reason('cannot read the length of some video clips - no trimming')
            if !defined $m->{dur};
    }

    # 画面总时长：图片按自身时长算（封面是 cover_seconds，其余是 seconds），
    # 视频按自身时长算
    my $slides_sec = 0;
    my $slides_sec_known = 1;
    for my $m (@media) {
        if ($m->{type} eq 'video') {
            if (defined $m->{dur}) { $slides_sec += $m->{dur}; }
            else                   { $slides_sec_known = 0; }
        } else {
            $slides_sec += (defined $m->{dur} ? $m->{dur} : $cfg{seconds});
        }
    }

    # 画面只需要覆盖音频长度（+1 秒余量）：封面已经算在 @media 里，不用再单独减。
    # 音频比这还短时只编码到音频结束即可，多出来的画面反正会被 -t 丢掉。
    my $audio_sec;
    my $bound_sec;
    if (!$cfg{dry_run}) {
        $audio_sec = probe_duration($ffprobe, $audio);
        log_write(sprintf('DUR  audio=%s slides=%s cover=%.1fs',
                          (defined $audio_sec ? sprintf('%.1fs', $audio_sec) : '(unknown)'),
                          ($slides_sec_known ? sprintf('%.1fs', $slides_sec) : '(unknown)'),
                          $cover_used));
        note_reason('no audio duration (no ffprobe) - the loop count cannot be bounded')
            if !defined $audio_sec;
        # 画面只要能铺满音频长度（+1 秒余量）就够了，多余的画面不编码
        if ($slides_sec_known && defined $audio_sec && $audio_sec > 0) {
            my $need = $audio_sec + 1;
            $need = 1 if $need < 1;
            $bound_sec = $need if $need < $slides_sec;
        }
    }

    # 幻灯片 = 若干片段：连续图片编成一段，每个视频片段单独规范化成一段，
    # 再按顺序 concat copy 成整条幻灯片（参数一致才能 copy）。
    my $slides_mp4 = File::Spec->catfile($work_dir, $base . '.slides.mp4');
    my $slides_ok = 0;
    my @segs;
    my $cover_seg;          # 片头封面那一段（只播一次）
    my @body_segs;          # 正片片段（封面之外的部分，循环时重复这些）
    my $segs_copyable = 1;  # 各段能否直接 concat copy（filter 兜底重编时置 0）
    my @chunks = split_chunks(\@media, $cfg{seconds});
    my $budget = $bound_sec;
    my $used_chunks = 0;
    for (my $ci = 0; $ci < @chunks; $ci++) {
        my $ch = $chunks[$ci];
        last if defined $budget && $budget <= 0;
        my $seg = File::Spec->catfile($work_dir, $base . ".seg$ci.mp4");
        my $ok  = 0;
        if ($ch->{type} eq 'video') {
            log_write(sprintf('CHUNK %d video %s %s', $ci + 1,
                              (defined $ch->{dur} ? sprintf('%.1fs', $ch->{dur}) : '?'),
                              $ch->{files}[0]));
            $ok = build_video_clip($ffmpeg, $ch->{files}[0], $seg, $VW, $VH, $budget);
        } else {
            # 图片段：把图片 concat 列表交给 ffmpeg。
            # 封面段：这一项就是封面，用 -loop 1 -t 写死 cover_seconds 秒；
            # 封面单独成段，循环正片时不会被重复带上。
            my @entries = @{ $ch->{entries} };
            my ($cv_path, $cv_sec);
            if ($ch->{cover} && @entries) {
                ($cv_path, $cv_sec) = @{ shift @entries };
            }
            my $pl;
            $pl = File::Spec->catfile($work_dir, $base . ".photos$ci.txt") if @entries;
            if (defined $cv_path && @entries) {
                log_write(sprintf('CHUNK %d cover %.1fs + images x%d (%.1fs)', $ci + 1,
                                  $cv_sec, scalar(@entries),
                                  $ch->{dur} - $cv_sec));
            } else {
                log_write(sprintf('CHUNK %d %s x%d (%.1fs)', $ci + 1,
                                  (defined $cv_path ? 'cover' : 'images'),
                                  scalar @{ $ch->{files} }, $ch->{dur}));
            }
            if (defined $pl && !write_photo_list($pl, \@entries)) {
                pwarn("  !! cannot write the image list for chunk " . ($ci + 1) . "\n");
            } else {
                $ok = build_image_clip($ffmpeg, $pl, $seg, $VW, $VH, $budget, $cv_path, $cv_sec);
            }
            unlink($pl) if defined $pl && !$cfg{keep_temp} && !$cfg{dry_run};
        }
        if ($ok) {
            push @segs, $seg;
            if ($ch->{cover}) { $cover_seg = $seg; } else { push @body_segs, $seg; }
            $used_chunks = $ci + 1;
        } else {
            pwarn("  !! chunk " . ($ci + 1) . " failed, skipped: $base\n");
            $used_chunks = $ci + 1;
        }
        if (defined $budget && defined $ch->{dur}) {
            $budget -= ($ch->{dur} > $budget ? $budget : $ch->{dur});
        }
    }
    if ($used_chunks < @chunks) {
        log_write(sprintf('CHUNK skipped %d chunk(s): the audio is shorter than the slideshow',
                          scalar(@chunks) - $used_chunks));
    }

    if (@segs == 1) {
        # 只有一段，不需要再拼一次
        if ($cfg{dry_run}) {
            $slides_ok = 1;
        } else {
            unlink($slides_mp4) if -e $slides_mp4;
            if (rename($segs[0], $slides_mp4)) { $slides_ok = 1; }
            else { $slides_mp4 = $segs[0]; $slides_ok = 1; }
        }
    } elsif (@segs > 1) {
        my $seg_list = File::Spec->catfile($work_dir, $base . '.segs.txt');
        if (write_concat_list($seg_list, @segs)) {
            $slides_ok = concat_segments($ffmpeg, $seg_list, $slides_mp4);
        }
        unlink($seg_list) unless $cfg{keep_temp} || $cfg{dry_run};
        if (!$slides_ok) {
            note_reason('segments could not be joined with copy - re-encoding the slideshow');
            $segs_copyable = 0;
            $slides_ok = concat_segments_filter($ffmpeg, $slides_mp4, @segs);
        }
    }
    log_file('slides', $slides_mp4) unless $cfg{dry_run};

    # 幻灯片的实际时长（ffprobe 量出来的，不是按张数算的）：循环次数按它定
    my $slides_info  = $cfg{dry_run} ? {} : probe_video_info($ffprobe, $slides_mp4);
    my $slides_dur   = $slides_info->{duration};
    my $slides_bytes = $slides_info->{size};
    if (defined $slides_dur && $slides_dur > 0 && defined $slides_bytes) {
        log_write(sprintf('SLIDES %.1fs  %s bytes  (~%.0f kbps)',
                          $slides_dur, $slides_bytes,
                          $slides_bytes * 8 / $slides_dur / 1000));
    }
    my $slides_expect = $slides_sec;
    $slides_expect = $bound_sec if defined $bound_sec && $bound_sec < $slides_expect;
    if (defined $slides_dur && $slides_expect > 0 && $slides_dur + 0.5 < $slides_expect * 0.6) {
        pwarn(sprintf("  !! slideshow is only %.1fs, the media should add up to %.1fs\n",
                      $slides_dur, $slides_expect));
        pwarn("     (images are not being held for the configured seconds)\n");
    }

    my $video_ok = 0;
    if ($slides_ok) {
        # 循环列表：片头封面单独排在最前面，只播一次；后面重复的是「正片」
        # （封面之外的所有片段），所以封面不会在每一轮循环里重复出现。
        # 循环次数：ceil(音频剩余时长 / 正片时长) + 1 轮余量，最后用 -t 切齐。
        # 算死次数是为了不让画面无限重复（成片体积失控）。
        my $loop_list;
        my $loops = 0;
        my $head  = 0;   # 1 = 循环列表写成「封面 + 正片 × N」，封面只播一次
        if (!$cfg{dry_run} && defined $audio_sec && $audio_sec > 0) {
            # 有封面片段、且还有正片片段时，才用「封面 + 正片 × N」的写法；
            # 否则（没做成封面 / 画面只有封面）退回「整条幻灯片 × N」。
            $head = (defined $cover_seg && @body_segs && $segs_copyable) ? 1 : 0;
            my @round = $head ? @body_segs : ($slides_mp4);
            my $head_sec  = $head ? $cover_used : 0;
            my $round_sec = (defined $slides_dur && $slides_dur > 0) ? $slides_dur
                          : $slides_sec;
            $round_sec -= $head_sec;   # 幻灯片总长里去掉只播一次的封面
            if ($round_sec > 0) {
                my $need = $audio_sec - $head_sec;
                $need = 0 if $need < 0;
                $loops = int($need / $round_sec) + 1;
                $loops = 1 if $loops < 1;
                $loops = 20000 if $loops > 20000;
                my @parts;
                if ($head) {
                    @parts = ($cover_seg, map { @round } 1 .. $loops);
                } else {
                    @parts = ($slides_mp4) x $loops;
                }
                my $lp = File::Spec->catfile($work_dir, $base . '.loop.txt');
                $loop_list = $lp if write_concat_list($lp, @parts);
            }
        }
        log_write(sprintf('MERGE  cover %.1fs %s + video loop x%d (copy), output capped at %s',
                          $cover_used,
                          ($head ? 'once at the front' : 'in the slideshow'),
                          $loops,
                          (defined $audio_sec ? sprintf('%.1fs', $audio_sec) : 'audio end')));
        $video_ok = make_video($ffmpeg, $slides_mp4, $loop_list, $audio, $out_mp4, $audio_sec);
        if (!$cfg{dry_run} && $video_ok) {
            my $size = -s $out_mp4;
            if (!defined $size || $size < $MIN_MP4_SIZE) {
                pwarn("  !! output file looks broken: $out_mp4\n");
                $video_ok = 0;
            }
        }
    }

    if (!$cfg{keep_temp}) {
        unlink($slides_mp4);
        unlink($_) for @segs;      # 各段片段（单段时已 rename 成 $slides_mp4）
        unlink(File::Spec->catfile($work_dir, 'title.txt'));
        unlink(File::Spec->catfile($work_dir, 'artist.txt'));
        unlink(File::Spec->catfile($work_dir, 'cover_text.txt'));
        unlink(File::Spec->catfile($work_dir, 'cover_text.png'));
        unlink(File::Spec->catfile($work_dir, 'title_line.png'));
        unlink(File::Spec->catfile($work_dir, 'artist_line.png'));
        unlink(File::Spec->catfile($work_dir, $base . '.loop.txt'));
    }
    if (!$cfg{keep_cover} && $have_cover && -e $cover && !$cfg{dry_run}) {
        unlink($cover);
    }

    if ($video_ok) {
        pout("    ok: $out_mp4\n");
        log_file('mp4', $out_mp4);
        my $info = probe_video_info($ffprobe, $out_mp4);
        log_write('VIDEO ' . $base . '.mp4 -> ' . fmt_video_info($info));
        warn_high_bitrate($info);
        # 成片时长必须和音频对齐：长出一截说明循环没被剪到音频结束（体积会失控）
        if (defined $audio_sec && defined $info->{duration}
            && abs($info->{duration} - $audio_sec) > $audio_sec * 0.05 + 1) {
            pwarn(sprintf("  !! output is %.1fs but the audio is %.1fs - the video loop was not cut to the audio\n",
                          $info->{duration}, $audio_sec));
        }
        $ok++;
    } else {
        # 失败时清掉半成品，下次运行才会重做，而不是「skip (exists)」
        unlink($out_mp4) if !$cfg{dry_run} && -e $out_mp4;
        pwarn("  !! failed: $base\n");
        $fail++;
    }
}

# 清理空目录
if (!$cfg{keep_temp} && !$cfg{dry_run}) {
    my $dh;
    if (opendir($dh, $work_dir)) {
        my @left = grep { $_ !~ /^\.{1,2}\z/ } readdir($dh);
        closedir($dh);
        rmdir($work_dir) if !@left;
    }
}

pout("-" x 60, "\n");
poutf("done: %d ok, %d skipped, %d failed (total %d)\n", $ok, $skip, $fail, $total);
if ($no_cover) {
    pout("warning: $no_cover cover image(s) could not be rendered (see the note: lines above).\n");
    pout("         fix the font, e.g. --font C:\\Windows\\Fonts\\msyh.ttc, then rerun with --force.\n");
}
log_write(sprintf('done: %d ok, %d skipped, %d failed (total %d)', $ok, $skip, $fail, $total));
exit($fail ? 1 : 0);
