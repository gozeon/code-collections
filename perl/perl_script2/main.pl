use strict;
use warnings;
use utf8;

use File::Basename;
use Pod::Simple::PullParser;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

if ( $^O eq 'MSWin32' ) {
    system("chcp 65001");
}

# This tells Perl to just exit quietly when Ctrl+C is pressed
$SIG{INT} = sub { exit };

my $cfg = do './config.pl' or die "加载配置失败: $@";

my $tasks_dir = "./tasks";    # 你的函数文件存放目录
my %menu_config;

# 1. 扫描 tasks 文件夹，动态构建菜单
my @files = glob("$tasks_dir/*.pl");
foreach my $file (@files) {
    my $task_id = basename( $file, ".pl" );

    # 提取 POD 描述作为 label
    my $label  = "无描述";
    my $parser = Pod::Simple::PullParser->new;
    $parser->set_source($file);
    while ( my $token = $parser->get_token ) {
        if ( $token->is_start && $token->tagname eq 'head1' ) {
            my $text_token = $parser->get_token;
            if ( $text_token->is_text && $text_token->text =~ /NAME/i ) {
                while ( my $next_token = $parser->get_token ) {
                    if ( $next_token->is_text ) {
                        $label = $next_token->text;
                        $label =~ s/^\s+|\s+$//g;
                        last;
                    }
                }
                last;
            }
        }
    }

    # 将任务存入 menu_config
    $menu_config{$task_id} = {
        label => $label,
        func  => sub {
            print "\n[执行文件 $file ]...\n";

            require $file;
            no strict 'refs';
            if ( defined &main ) {

                main($cfg);
            }
            else {
                warn "错误：在 $file 中找不到函数 main\n";
            }
        }
    };
}

$menu_config{'q'} = {
    label => '退出 (Exit)',
    func  => sub { exit }
};

# 如果没有参数，才进入 while(1) 菜单循环
if (@ARGV) {
    my $cmd_id = $ARGV[0];
    my $action = $menu_config{$cmd_id};
    if ($action) {
        $action->{func}->();
        exit;
    }
}

# Get all keys EXCEPT 'q' and sort them
my @sorted_ids = sort grep { $_ ne 'q' } keys %menu_config;

# Push 'q' to the very end of the list
push( @sorted_ids, 'q' ) if exists $menu_config{'q'};

while (1) {
    print "\n=== Menu (OS: $^O) ===\n\n";
    foreach my $id (@sorted_ids) {
        printf "%-50s : %s\n", $id, $menu_config{$id}->{label};
    }
    print "=" x 10, "\n请输入操作代码: ";

    my $choice = <STDIN>;
    last if !defined $choice;
    chomp($choice);

    # 缓存查找到的哈希引用
    my $action = $menu_config{$choice};

    if ($action) {
        $action->{func}->();
    }
    else {
        print "\n无效代码: $choice\n";
    }
}
