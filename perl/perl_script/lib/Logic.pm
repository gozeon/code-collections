package Logic;

use strict;
use warnings;
use utf8;
use DeployHelper;

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

sub test_redis {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            my $vps         = DeployHelper->new(%$config)->connect();
            my $script_temp = "/tmp/script_temp_" . time() . ".pl";
            $vps->upload( './scripts/test_redis.pl', $script_temp );
            $vps->run("perl $script_temp");
            $vps->run("rm -rf $script_temp");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

sub test_mysql {
    my ($vps_list) = @_;
    foreach my $config (@$vps_list) {
        eval {
            my $vps         = DeployHelper->new(%$config)->connect();
            my $script_temp = "/tmp/script_temp_" . time() . ".pl";
            $vps->upload( './scripts/test_mysql.pl', $script_temp );
            $vps->run("perl $script_temp");
            $vps->run("rm -rf $script_temp");
            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $config->{host}: $err\n";
        }
    }
}

1;
