use strict;
use warnings;
use utf8;

use lib 'lib';
use DeployHelper;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

sub main {
    my ($config) = @_;
    my $vps_list = $config->{ping_redis_config}->{vps}  or die "参数错误";
    my $redis    = $config->{ping_redis_config}->{addr} or die "参数错误";

    foreach my $vps_config (@$vps_list) {
        eval {
            my $vps         = DeployHelper->new(%$vps_config)->connect();
            my $script_temp = "/tmp/script_temp_" . time() . ".pl";
            $vps->upload( './scripts/test_redis.pl', $script_temp );
            $vps->run(
"perl $script_temp --host=$redis->{host} --port=$redis->{port} --pass=$redis->{pass}"
            );
            $vps->run("rm -rf $script_temp");
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

ping_redis.pl - 测试是否访问redis地址

=head1 CONFIGURATION

$config->{ping_redis_config}

	{
		addr => {
			host => '123',
			port => 26174,
			pass => 'pass'
		},
		vps => [
			{
				host => '1.1.1.1',
				user => 'user',
				pass => 'pass'
			},
		]
	}

=head1 AUTHOR

goze(goze.qiu@gmail.com)

=cut

