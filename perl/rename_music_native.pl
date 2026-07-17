use strict;
use warnings;
use utf8;
use Encode qw(decode encode);
use Win32::OLE;
use File::Spec;

# Keep standard Perl terminal prints clean
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );
binmode( STDERR, ":utf8" );

my $folder_path = 'D:\yt'; 

# 启动 Windows 资源管理器引擎
my $shell = Win32::OLE->new("Shell.Application") or die "无法启动 Windows Shell 引擎: " . Win32::OLE->LastError() . "\n";
my $folder = $shell->NameSpace('D:\yt')  or die "无法载入文件夹路径\n";
print "开始使用 Windows 原生引擎处理音频文件...\n";

opendir(my $dh, $folder_path) or die "无法打开目录: $!";
my @files = readdir($dh);
closedir($dh);

my $success_count = 0;
my $skip_count    = 0;

foreach my $filename (@files) {
	# 跳过隐藏文件和目录
    next if $filename =~ /^\./;
    
    my $file_path = File::Spec->catfile($folder_path, $filename);
    next unless -f $file_path;

    # 检查后缀名是否为 MP3 或 FLAC
    my ($ext) = $filename =~ /(\.[^.]+)$/;
    next unless $ext;
    $ext = lc($ext);
    next unless ($ext eq '.mp3' || $ext eq '.flac');
	
	# 让 Windows 引擎解析该文件
    my $folder_item = $folder->ParseName($filename);
    next unless $folder_item;

    # 读取 Windows 详细信息：21 代表标题，20 代表参与创作的艺术家
    # 使用 Win32::OLE::valof 确保获取到的是纯文本字符串
    my $title  = Win32::OLE::valof($folder->GetDetailsOf($folder_item, 21));
    my $artist = Win32::OLE::valof($folder->GetDetailsOf($folder_item, 20));

    # 去除首尾空格
    $title  =~ s/^\s+|\s+$//g if $title;
    $artist =~ s/^\s+|\s+$//g if $artist;
	
	# 严格检查：标题和艺术家必须同时存在（不保留原名）
    if ($title && $artist) {
        
        # 过滤 Windows 文件名非法字符: \ / : * ? " < > |
        $title  =~ s/[\\\/:\*\?"<>\|]//g;
        $artist =~ s/[\\\/:\*\?"<>\|]//g;

        my $new_filename = "${title}-${artist}${ext}";
        my $new_file_path = File::Spec->catfile($folder_path, $new_filename);

        # 如果名字已经是 标题-艺术家 格式，则跳过
        if ($filename eq $new_filename) {
            print "无需修改: ".decode('gbk', $filename)."\n";
            next;
        }

        # 防止重命名冲突
        if (-e $new_file_path) {
            print "跳过（目标文件已存在）: $new_filename\n";
            $skip_count++;
            next;
        }

        # 执行重命名
        if (rename($file_path, $new_file_path)) {
            print "已重命名: $filename -> $new_filename\n";
            $success_count++;
        } else {
            print "重命名失败 $filename: $!\n";
            $skip_count++;
        }
    } else {
        print "跳过（缺少 Windows 属性标签）: $filename\n";
        $skip_count++;
    }
}

print "\n处理完成！\n";
print "成功重命名: $success_count 个文件\n";
print "跳过/失败: $skip_count 个文件\n";