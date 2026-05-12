use strict;
use warnings;
use utf8;
use HTTP::Tiny;
use JSON::MaybeXS;    # 自动选择系统最优的 JSON 库

use lib 'lib';
use DeployHelper;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

1;

sub main {
    my ($config) = @_;
    my $innerservice_deploy_config = $config->{innerservice_deploy_config}
      or die "参数错误";

    my @menu = (
        {
            label => "测试环境，部署配置文件",
            func  => sub {
                _deploy( $innerservice_deploy_config, 'test', 'config_only' );
            }
        },
        {
            label => "测试环境，部署配置文件 + 程序文件",
            func  =>
              sub { _deploy( $innerservice_deploy_config, 'test', 'all' ) }
        },
        {
            label => "正式环境，部署配置文件",
            func  => sub {
                _deploy( $innerservice_deploy_config, 'prod', 'config_only' );
            }
        },
        {
            label => "正式环境，部署配置文件 + 程序文件",
            func  =>
              sub { _deploy( $innerservice_deploy_config, 'prod', 'all' ) }
        },
    );

    print "\n--- 部署目标选择 ---\n";
    for my $i ( 0 .. $#menu ) {
        printf "[%d] %s\n", $i + 1, $menu[$i]->{label};
    }
    print "[q] 退出当前任务\n";
    print "请输入编号: ";
    my $idx = <STDIN>;
    chomp($idx);
    return if $idx eq 'q';

    # 校验输入并执行
    if ( $idx =~ /^\d+$/ && $menu[ $idx - 1 ] ) {
        my $task = $menu[ $idx - 1 ];
        print "\n>>> 启动: $task->{label}...\n";

        # 执行绑定的匿名函数
        $task->{func}->();

        print "\n[OK] 任务执行完毕。\n";
    }
    else {
        print "\n[!] 无效输入。\n";
    }

}

sub _deploy {
    my ( $cfg, $env, $type ) = @_;
    print "执行中... 目标环境: $env, 部署模式: $type\n";

    my $vps_list = $cfg->{$env};

    foreach my $config (@$vps_list) {
        eval {
            my $vps = DeployHelper->new(%$config)->connect();
            if ( $env eq 'test' ) {

                $vps->upload(
                    'D:\gitlab\wise-ai-inner-app-service\config\develop.yaml',
                    "/root/wise-ai-innerAppService/config/develop.yaml"
                );

                if ( $type eq 'all' ) {
                    $vps->run(" supervisorctl stop inner-app-server");

                    $vps->upload(
                        'D:\gitlab\wise-ai-inner-app-service\InnerAppService',
                        "/root/wise-ai-innerAppService/InnerAppService"
                    );

                    $vps->run(
" chmod +x /root/wise-ai-innerAppService/InnerAppService"
                    );
                }
            }

            if ( $env eq 'prod' ) {

                $vps->upload(
                    'D:\gitlab\wise-ai-inner-app-service\config\release.yaml',
                    "/home/wise-ai-innerAppService/config/release.yaml"
                );

                if ( $type eq 'all' ) {
                    $vps->run(" supervisorctl stop inner-app-server");

                    $vps->upload(
                        'D:\gitlab\wise-ai-inner-app-service\InnerAppService',
                        "/home/wise-ai-innerAppService/InnerAppService"
                    );

                    $vps->run(
" chmod +x /home/wise-ai-innerAppService/InnerAppService"
                    );
                }

            }

            $vps->run(" supervisorctl restart inner-app-server");
            $vps->run(" supervisorctl status");
            $vps->disconnect();
        } if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

__END__

=encoding utf8

=head1 NAME

innerservice_deploy.pl - 部署innerservice程序

=head1 CONFIGURATION

$config->{innerservice_deploy_config}

{
	test => [@test_vps],
	prod => [@innerservice_prod_vps],
}

=head1 AUTHOR

goze(goze.qiu@gmail.com)

=cut
