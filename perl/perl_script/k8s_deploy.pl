use strict;
use warnings;
use utf8;
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );

if ( $^O eq 'MSWin32' ) {
    system("chcp 65001");
}

# This tells Perl to just exit quietly when Ctrl+C is pressed
$SIG{INT} = sub { exit };

# 1. 环境配置 (保持你的 C# 逻辑)
$ENV{KUBECONFIG} = 'D:\\k8s\\config\\ai\\config';
$ENV{PATH}       = "D:\\k8s;" . $ENV{PATH};

# 2. 切换 Context
print "--- [Step 1] 正在读取可用 Context ---\n";
my @contexts = qx(kubectl config get-contexts -o name);
chomp(@contexts);

for my $i ( 0 .. $#contexts ) {
    print "[$i] $contexts[$i]\n";
}
print "请选择 Context 编号 [默认 0]: ";
my $ctx_idx = <STDIN>;
chomp($ctx_idx);
$ctx_idx = 0 if $ctx_idx eq '';
my $target_context = $contexts[$ctx_idx] // die "无效的选择\n";

system("kubectl config use-context $target_context");

# 3. 列出并选择 Deployment
print "\n--- [Step 2] 当前 Context ($target_context) 中的 Deployments ---\n";

# 获取 Deployment 列表及其状态
my @pods_raw =
qx(kubectl get deployments --no-headers -o custom-columns="NAME:.metadata.name,CREATED:.metadata.creationTimestamp");
chomp(@pods_raw);

if ( !@pods_raw ) {
    die "当前 Namespace 下没有找到任何 Deployment。\n";
}

for my $i ( 0 .. $#pods_raw ) {
    printf( "[%2d] %s\n", $i, $pods_raw[$i] );
}

print "\n请输入 Deployment 编号 或 关键字搜索 (例如 'ai'): ";
my $input = <STDIN>;
chomp($input);

my $target_pod;

# 判断输入的是数字还是字符串
if ( $input =~ /^\d+$/ && $pods_raw[$input] ) {

    # 如果是数字，直接通过索引取名字（取第一列）
    ($target_pod) = split( /\s+/, $pods_raw[$input] );
}
else {
    # 如果是字符串，进行模糊匹配
    my @matches = grep { /$input/i } @pods_raw;
    if (@matches) {
        ($target_pod) = split( /\s+/, $matches[0] );
        print "匹配到: $target_pod\n";
    }
}

if ( !$target_pod ) {
    die "未找到匹配 '$input' 的 Deployment。\n";
}

# 4. 输出日志
print "\n--- [Step 3] 正在重启 $target_pod ---\n";

# --tail=20 可以让你看到最近的几行，不用等太久
system("kubectl rollout restart  deployment $target_pod");

print "\n--- [Step 4] 查看状态 $target_pod ---\n";
system("kubectl rollout status   deployment $target_pod");
print "\n--- done ---\n";

