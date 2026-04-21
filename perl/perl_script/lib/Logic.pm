package Logic;

use strict;
use warnings;
use utf8;
use JSON::MaybeXS;    # 自动选择系统最优的 JSON 库
use DeployHelper;
use SimpleHttpTextCompare;

sub test_upload {
    my ($vps_list) = @_;

    foreach my $config (@$vps_list) {
        eval {
            my $vps = DeployHelper->new(%$config)->connect();

            # $vps->run("uname -a");
            # $vps->upload("./readme.md", "/root/readme.md");
            $vps->upload_dir( "./", "/root/t/" );
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_download {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            my $vps = DeployHelper->new(%$config)->connect();
            $vps->download_dir( "/root/t/", "." );
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_goserver {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            print "部署测试配置文件";
            my $vps = DeployHelper->new(%$config)->connect();
            $vps->upload(
                'D:\gitlab\wise-ai-goserver\src\config\debug.yaml',
                "/root/wise-ai-goserver/src/config/debug.yaml"
            );
            $vps->run(" supervisorctl restart goserver");
            $vps->run(" supervisorctl status");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub prod_goserver {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            print "部署正式配置文件";
            my $vps = DeployHelper->new(%$config)->connect();
            $vps->upload(
                'D:\gitlab\wise-ai-goserver\src\config\release.yaml',
                "/root/wise-ai-goserver/src/config/release.yaml"
            );
            $vps->run(" supervisorctl restart go-server");
            $vps->run(" supervisorctl status");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_innerservice {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            print "部署测试配置文件";
            my $vps = DeployHelper->new(%$config)->connect();
            $vps->upload(
                'D:\gitlab\wise-ai-inner-app-service\config\develop.yaml',
                "/root/wise-ai-innerAppService/config/develop.yaml"
            );
            $vps->run(" supervisorctl restart inner-app-server");
            $vps->run(" supervisorctl status");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub prod_innerservice {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            print "部署正式配置文件";
            my $vps = DeployHelper->new(%$config)->connect();
            $vps->upload(
                'D:\gitlab\wise-ai-inner-app-service\config\release.yaml',
                "/home/wise-ai-innerAppService/config/release.yaml"
            );
            $vps->run(" supervisorctl restart inner-app-server");
            $vps->run(" supervisorctl status");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_redis {
    my ( $vps_list, $redis ) = @_;
    foreach my $config (@$vps_list) {
        eval {
            my $vps         = DeployHelper->new(%$config)->connect();
            my $script_temp = "/tmp/script_temp_" . time() . ".pl";
            $vps->upload( './scripts/test_redis.pl', $script_temp );
            $vps->run(
"perl $script_temp --host=$redis->{host} --port=$redis->{port} --pass=$redis->{pass}"
            );
            $vps->run("rm -rf $script_temp");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_mysql {
    my ( $vps_list, $mysql ) = @_;
    foreach my $config (@$vps_list) {
        eval {
            my $vps         = DeployHelper->new(%$config)->connect();
            my $script_temp = "/tmp/script_temp_" . time() . ".pl";
            $vps->upload( './scripts/test_mysql.pl', $script_temp );
            $vps->run(
                "perl $script_temp --host=$mysql->{host} --port=$mysql->{port}"
            );
            $vps->run("rm -rf $script_temp");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub compare_http_get {
    my ($api_list) = @_;
    foreach my $api (@$api_list) {
        eval {
            my $cpre =
              SimpleHttpTextCompare->new( out_dir => "http_compare" . time() );
            $cpre->compare_urls( $api->{url1}, $api->{url2} );
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to check: $err\n";
        }
    }
}

sub test_api {
    my ($api_list) = @_;
    foreach my $api (@$api_list) {
        eval {
            my $cpre =
              SimpleHttpTextCompare->new( out_dir => "http_compare" . time() );

            my $response = $cpre->post_request( $api->{url}, $api->{payload},
                $api->{headers} );

            # 如果不需要可以不解析
            my $json = JSON::MaybeXS->new( utf8 => 1 );
            my $data;
            eval { $data = $json->decode($response); };
            if ($@) {
                warn "JSON 解析异常: $@\n";
                return 0;
            }

            # 检查业务逻辑 code 是否为 200
            if ( exists $data->{code} && $data->{code} == 200 ) {
                print "[Success] $api->{url} \n";
            }
            else {
                warn "[Error] $api->{url} \n";
            }
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to check: $err\n";
        }
    }
}

1;
