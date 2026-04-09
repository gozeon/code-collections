use strict;
use warnings;
use IO::Socket::INET;
use utf8;
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

my $host = "abcd.mysql.rds.aliyuncs.com";
my $port = 3306;

my $socket = IO::Socket::INET->new(
    PeerAddr => $host,
    PeerPort => $port,
    Proto    => 'tcp',
    Timeout  => 5
) or die "connect fail $host:$port : $!\n";

print "\n";

# 1. Read Initial Handshake from Server
my $buf;
$socket->recv( $buf, 1024 );

if ( length($buf) > 0 ) {

# If the first byte of data (after the 4-byte header) is 0xFF, it's a MySQL Error
    my $payload_start = substr( $buf, 4, 1 );
    if ( ord($payload_start) == 0xff ) {
        print
          "FAILED: Server rejected connection immediately (Handshake Error).\n";
    }
    else {
        print "SUCCESS: TCP Connected and MySQL Handshake Received.\n";

        # Note: True password verification requires SHA1/SHA256 logic
        # which isn't native to Perl core without 'Digest::SHA'.
    }
}

print "\n";

$socket->close();
