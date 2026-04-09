use strict;
use warnings;
use IO::Socket::INET;
use utf8;
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

my $host = "abcd.sql.tencentcdb.com";
my $port = 26174;
my $pass = 'abcd';                     # 如果有密码请填写

my $socket = IO::Socket::INET->new(
    PeerAddr => $host,
    PeerPort => $port,
    Proto    => 'tcp',
    Timeout  => 5
) or die "connect fail $host:$port : $!\n";

# 如果有密码，发送 AUTH
if ($pass) {
    print $socket "AUTH $pass\r\n";
    <$socket>;
}

# 发送 PING 测试
print $socket "PING\r\n";
my $response = <$socket>;

print "\n";

if ( $response =~ /PONG/ ) {
    print "SUCCESS: $host:$port: $response";
}
else {
    print "FAILED: $host:$port: $response";
}

print "\n";

$socket->close();
