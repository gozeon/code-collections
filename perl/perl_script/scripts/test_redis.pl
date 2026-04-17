use strict;
use warnings;
use IO::Socket::INET;
use utf8;
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

use Getopt::Long;
my $host;
my $port;
my $pass;

GetOptions(
    "host=s" => \$host,    # 接收目录路径
    "port=s" => \$port,    # 接收新的占位符密钥
    "pass=s" => \$pass,    # 接收新的占位符密钥
) or die "用法: perl xx.pl --host=host --port=port\n";

if ( !$host || !$port ) {
    die "错误：必须提供 --host 和 --port 参数\n";
}

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
