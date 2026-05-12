use strict;
use warnings;
use utf8;
use HTTP::Tiny;
use JSON::MaybeXS;    # 自动选择系统最优的 JSON 库

use lib 'lib';
use DeployHelper;

binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

sub main {
    my ($config) = @_;
    my $test_api_config = $config->{test_api_config} or die "参数错误";

    my $http = HTTP::Tiny->new( timeout => 10 );
    my $json = JSON::MaybeXS->new( utf8 => 1 );

    foreach my $req (@$test_api_config) {
        eval {
            #  uc() 转大写
            my $method  = uc( $req->{method} // 'GET' );
            my $url     = $req->{url};
            my $headers = $req->{headers} // {};
            my $payload = $req->{payload} // {};
            my $type    = uc( $req->{type} // 'JSON' );

            my %options = ( headers => $headers );
            my $resp;

            if ( $method eq 'POST' ) {
                if ( $type eq 'FORM' ) {
                    $resp = $http->post_form( $url, $payload, \%options );
                }
                else {
                    $headers->{'Content-Type'} //= 'application/json';
                    my $json_data = $json->encode($payload);
                    $options{content} = $json_data;
                    $resp = $http->post( $url, \%options );
                }
            }
            elsif ( $method eq 'GET' ) {
                $resp = $http->get( $url, \%options );
            }
            else {
                $resp = $http->request( $method, $url, \%options );
            }

            die "请求失败 $url: $resp->{status} $resp->{reason}\n"
              unless $resp->{success};

            my $content = $resp->{content};
            my $data;
            eval { $data = $json->decode($content); };
            if ($@) {
                warn "JSON 解析异常: $@\n";
                return 0;
            }

            # 检查业务逻辑 code 是否为 200
            if ( exists $data->{code} && $data->{code} == 200 ) {
                print "[Success] $method $url \n";
            }
            else {
                warn "[Error] $method $url \n";
            }

        };
        if ( my $err = $@ ) {
            warn "\n[ERROR] Failed to process $req->{url}: $err\n";
        }
    }

}
1;

__END__

=encoding utf8

=head1 NAME

test_api.pl - http api 接口测试

=head1 CONFIGURATION

$config->{test_api_config}

[
	{
		'method' => 'post', # or get
		'type' => 'form',
		'url' => 'xx',
		'payload' => {},
		'headers' => {},
	},
]

=head1 AUTHOR

goze(goze.qiu@gmail.com)

=cut

