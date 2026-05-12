use strict;
use warnings;
use utf8;

use lib 'lib';
use DeployHelper;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

sub main {
    my ($config) = @_;
    my $vps_list = $config->{test_upload_vps};

    foreach my $vps_config (@$vps_list) {
        eval {
            my $vps = DeployHelper->new(%$vps_config)->connect();

            $vps->run("uname -a");

            # $vps->upload("./readme.md", "/root/readme.md");
            # $vps->upload_dir( "./", "/root/t/" );

            $vps->disconnect();
        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $vps_config->{host}: $err\n";
        }
    }

}
1;

__END__

=encoding utf8

=head1 NAME

test_upload.pl - 测试上传文件、文件夹

=head1 CONFIGURATION

$config->{test_upload_vps}

    [
        {
            host => '1.1.1.1',
            user => 'user',
            pass => 'pass'
        },
    ]

=head1 AUTHOR

goze(goze.qiu@gmail.com)

=cut

