use strict;
use warnings;
use lib './lib';
use Logic;
use utf8;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

if ( $^O eq 'MSWin32' ) {
    system("chcp 65001");
}

# This tells Perl to just exit quietly when Ctrl+C is pressed
$SIG{INT} = sub { exit };

# 读取配置
my $cfg = do './config.pl' or die "加载配置失败: $@";

my %menu_config = %{ $cfg->{menu_config} || {} };

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
        print "\n[执行中] $action->{label}...\n";
        $action->{func}->();
    }
    else {
        print "\n无效代码: $choice\n";
    }
}
