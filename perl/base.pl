#!/usr/bin/perl
use utf8;
# 整数
print 0;
print 2024;
print -1;
print 20_231_000;
# 八进制
print 0377;
print 0o377;

# 16进制
print 0xff;
# 二进制
print 0b11111111;
# 浮点数
print 1.24;
print 2666.0000;
print -7.23e23;
# 运算
print 2+3;
print 4.1-2.1;
print 3 * 2;
print 3.2 * 241.12;
print 3/2; # 1.5
print 32 / 123.23;

# 字符串 区分单双引号
print 'fred';
print "hello world";
print "\x{2668}";
print "\N{SNOWMAN}";

print "a"." "."b";
print "a" x 3; # aaa
print "b" x (4 + 1); # bbbbb
print 5 x 4.8; # ="5" x 4

print oct('0377');
print hex('AFF');
# 16进制转10进制 10 -> 16
print hex(10); 
# 先把0x10转为10进制 16, 然后 16 转为 转为16进制22
print hex(0x10); 

# 变量
$a = "a";
$b = "b";
print $a x 3;
print "$a",5/2,"$b" ;

# 比较 区分数字和字符串
print 1 == 1;
if ($a eq 'b') {
    print "yes";
} else {
    print "no";
}

# boolean
$still_true = !! 'Fred';
$still_false = !! '0';

# 获取用户输入
# $line = <STDIN>;
# if ($line eq "\n") {
#     print "That was just a blank line!\n";
# } else {
#     print "That line of input was: $line";
# }

# 去掉换行符
# chomp($text = <STDIN>);
# print $text;

# 是否定义变量
if ( defined($c) ) {
    print "The input was $c";
} else {
    print "No input available!\n";
}

# 数组
# $fred[0] = 1;
# $fred[1] = 1;
# $fred[2] = 1;
# print $fred[2];

# 取值
($fred, $barney, $dino) = ("flintstone", "rubble", undef);
print $fred;

# pop push shift unshift splice foreach reverse sort each
@arr = 5..9;
$f = pop(@arr);
print $f;
push(@arr, 2);
push(@arr, 1..3);

print "\n";

@people = qw( fred barney betty );
@sorted = sort @people; # list context: barney, betty, fred
$number = 42 + @people; # scalar context: 42 + 3 gives 45
@list = @people;
$n = @people;
print scalar @people;

# hash
%some_hash = (
    'foo' => 1,
    'dino' => 'a'
);
print %some_hash;

# keys values each existes delete
my %hash = ('a' => 1, 'b' => 2, 'c' => 3);
my @k = keys %hash;
my @v = values %hash;

# 获取系统变量 path
print "PATH is $ENV{PATH}\n";

# 正则
# while(<STDIN>) {
#     chomp;
#     if(/fred/) {
#         print "match\n";
#         exi
#     } else {
#         print "no match\n";
#     }
# }

# 替换字符串
$_ = "He's out bowling with Barney tonight.";
s/Barney/Fred/; # Replace Barney with Fred
print "$_\n";
