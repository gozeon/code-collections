use strict;
use warnings;
use utf8;
use Encode qw(decode encode);

# Keep standard Perl terminal prints clean
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );
binmode( STDERR, ":utf8" );

my $IS_WIN = $^O eq 'MSWin32';

if ($IS_WIN) {

    # 切换控制台编码
    system("chcp 65001");
}

use File::Spec;

my $target_folder = 'D:/github/code-collections/perl/中文测试';

# my $target_folder  = '中文测试'; # 脚本当前目录

my $abs_folder = File::Spec->rel2abs($target_folder);

# 可能有中文目录
my $win_check_path = ($IS_WIN) ? encode( "gbk", $abs_folder ) : $abs_folder;

# 判断目录是否存在 -e 目录或文件 -f 文件 -d 目录
if ( !-e $win_check_path ) {

    # mkdir $abs_folder or die "无法创建 $abs_folder";
    die "$abs_folder 不存在";
}

my $search_pattern = File::Spec->catfile( $abs_folder, "*.{txt}" );
print "开始匹配 " . $search_pattern . "\n";

# 中文目录要兼容
# glob(encode("gbk", "D:/github/code-collections/perl/中文测试/*.*"))
$search_pattern = encode( "gbk", $search_pattern ) if $IS_WIN;

my @target_files = glob($search_pattern) or die "遍历文件失败!\n";

foreach my $file (@target_files) {
    $file = decode( "gbk", $file ) if $IS_WIN;
    print "待处理媒体: $file\n";

    # 写文件
    if ( open( my $fh, ">:encoding(UTF-8)", $file ) ) {
        print $fh "哈哈中文\n";
        print $fh "abcde1234\n";
        close($fh);
    }
    else {
        die "无法写入内容到: $file";
    }

    # 读文件
    if ( open( my $fh, "<:encoding(UTF-8)", $file ) ) {
        while ( my $line = <$fh> ) {

            # 去掉换行符号
            chomp($line);
            print "读取到内容: $line\n";
        }
        close($fh);
    }
    else {
        die "无法读取文件内容: $file";
    }
}
