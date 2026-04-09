use strict;
use warnings;
use File::Find;
use File::Basename;
use Cwd qw(abs_path);
use utf8;

# 1. 定义要处理的目录（默认当前目录）
my $target_dir = $ARGV[0] // '.';

my $current_dir = abs_path($target_dir);

print "[*] Starting perltidy in: $current_dir\n";

find(
    sub {
        # 2. 只处理 .pl 和 .pm 文件
        if ( -f $_ && /\.(pl|pm)$/ ) {
            my $file = $File::Find::name;
            print "Processing: $file\n";

            # 3. 执行 perltidy
            # -b (backup): 修改原文件
            # -nst (no-standard-output): 不把结果打印到屏幕
            system( "perltidy", "-b", "-nst", $file );

            # 4. 删除生成的备份文件 .bak
            my $bak_file = "$file.bak";
            if ( -f $bak_file ) {
                unlink($bak_file) or warn "Could not delete $bak_file: $!";
            }
        }
    },
    $current_dir
);

print "[OK] All done!\n";
