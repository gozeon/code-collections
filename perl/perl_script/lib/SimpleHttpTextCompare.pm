package SimpleHttpTextCompare;

use strict;
use warnings;
use HTTP::Tiny;
use File::Spec;
use utf8;

sub new {
    my ( $class, %args ) = @_;
    my $dir = $args{out_dir} || '.';

    unless ( -d $dir ) {
        mkdir $dir or die "无法创建目录 $dir:$!\n";

    }
    my $self = {
        http    => HTTP::Tiny->new(),
        out_dir => $dir,
    };
    mkdir $dir unless -d $dir;
    return bless $self, $class;
}

# 将 URL 转换为安全文件名
sub url_to_filename {
    my ( $self, $url ) = @_;
    $url =~ s{https?://}{};
    $url =~ s{[/:?&=]}{_}g;
    return File::Spec->catfile( $self->{out_dir}, $url . ".txt" );
}

# 获取 HTTP 内容
sub fetch_content {
    my ( $self, $url ) = @_;
    my $resp = $self->{http}->get($url);
    die "请求失败 $url: $resp->{status} $resp->{reason}\n" unless $resp->{success};
    return $resp->{content};
}

# 简单文本 diff
# TODO: Text::Diff
sub text_diff {
    my ( $self, $text1, $text2 ) = @_;
    return $text1 eq $text2 ? 0 : 1;
}

# 主对比方法
sub compare_urls {
    my ( $self, $url1, $url2 ) = @_;

    my $text1 = $self->fetch_content($url1);
    my $text2 = $self->fetch_content($url2);

    print "=" x 10, " 对比请求结果\n";
    print $url1,    "\n", $url2, "\n";
    print "-" x 10, "\n";
    if ( !$self->text_diff( $text1, $text2 ) ) {
        print "通过：两个请求返回内容一致\n";
        return 1;
    }
    else {
        print "失败：两个请求返回内容不一致\n";

        # 写入文件
        my $file1 = $self->url_to_filename($url1);
        my $file2 = $self->url_to_filename($url2);

        open my $fh1, '>', $file1 or die "无法写入 $file1: $!\n";
        print $fh1 $text1;
        close $fh1;

        open my $fh2, '>', $file2 or die "无法写入 $file2: $!\n";
        print $fh2 $text2;
        close $fh2;

        print "差异文件已保存：\n$file1\n$file2\n";
        print "=" x 10, " end\n";
        return 0;
    }
}

1;
