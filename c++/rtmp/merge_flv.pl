#!/usr/bin/perl
use strict;
use warnings;
use File::Spec;
use File::Temp qw(tempfile);
use Cwd 'abs_path';
use utf8;

binmode(STDOUT, ":utf8");

# --- 配置区 ---
my $input_dir   = "./records/tjradio/XINWEN/";   # FLV 文件所在的目录（可以是相对路径）
my $start_time  = "20260423000000";  # 开始时间
my $end_time    = "20260424010000";   # 结束时间
my $output_file = "merged.flv";       # 输出文件名（也会转为绝对路径）
my $ffmepg_bin = "/dev/shm/ffmpeg-7.0.2-amd64-static/ffmpeg";

# 1. 获取目录的绝对路径
my $abs_input_dir = abs_path($input_dir);
die "错误: 找不到目录 $input_dir" unless defined $abs_input_dir;

# 2. 读取目录并筛选符合条件的文件
opendir(my $dh, $abs_input_dir) or die "无法打开目录: $!";
my @files = sort grep {
    /\.flv$/ && $_ ge "$start_time.flv" && $_ le "$end_time.flv"
} readdir($dh);
closedir($dh);

if (!@files) {
    print "在范围 $start_time 到 $end_time 内未找到文件。\n";
    exit;
}

# 3. Create a temporary file in /tmp
# UNLINK => 1 means it will be deleted automatically when the script ends
my ($tmp_fh, $tmp_filename) = tempfile(
    "ffmpeg_list_XXXXX",
    DIR => File::Spec->tmpdir(),
    SUFFIX => '.txt',
    UNLINK => 1 # 自动删除，0不删除
);
binmode($tmp_fh, ":encoding(UTF-8)");

# 3. 写入绝对路径到 FFmpeg 列表文件
foreach my $file (@files) {
    # 核心修改：将文件名拼接成完整的绝对路径
    my $full_path = File::Spec->catfile($abs_input_dir, $file);

    # 打印到 tempfile，FFmpeg 要求路径需要用单引号包裹
    print $tmp_fh "file '$full_path'\n";
    print "待合并: $full_path\n";
}
close($tmp_fh);

print "\n 生成list文件: $tmp_filename";
# 4. 获取输出文件的绝对路径并执行 FFmpeg
my $abs_output = File::Spec->rel2abs($output_file);
print "\n正在启动 FFmpeg 合并到: $abs_output\n";

# 使用 -safe 0 允许 FFmpeg 读取绝对路径
my @cmd = ($ffmepg_bin, "-f", "concat", "-safe", "0", "-i", $tmp_filename, "-c", "copy", "-y", $abs_output);

if (system(@cmd) == 0) {
    print "\n成功！合并完成。\n";
} else {
    print "\n失败！FFmpeg 执行出错。\n";
}
