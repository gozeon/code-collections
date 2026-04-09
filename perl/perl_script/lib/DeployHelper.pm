package DeployHelper;

use strict;
use warnings;
use utf8;
use Net::SSH2;
use Carp qw(croak);
use Archive::Tar;
use File::Find;
use Cwd qw(cwd abs_path);
use Encode;

# 构造函数
sub new {
    my ( $class, %args ) = @_;

    # 强制要求必要的参数
    croak "Missing host" unless $args{host};
    croak "Missing user" unless $args{user};
    croak "Missing pass" unless $args{pass};

    my $self = {
        host  => $args{host},
        user  => $args{user},
        pass  => $args{pass},
        port  => $args{port} || 22,
        ssh2  => Net::SSH2->new(),
        debug => $args{debug} // 1,
    };

    return bless $self, $class;
}

# 连接并认证
sub connect {
    my $self = shift;
    print "[*] Connecting to $self->{host}..." if $self->{debug};

    $self->{ssh2}->connect( $self->{host}, $self->{port} )
      or croak "\n[!] Connection failed: $!";

    $self->{ssh2}->auth_password( $self->{user}, $self->{pass} )
      or croak "\n[!] Authentication failed for $self->{user}";

    print " [OK]\n" if $self->{debug};
    return $self;
}

# 执行命令并实时打印输出 (支持超时处理逻辑的简化版)
sub run {
    my ( $self, $cmd ) = @_;
    print "[>] Executing: $cmd\n" if $self->{debug};

    my $chan = $self->{ssh2}->channel() or croak "Could not create channel: $!";
    $chan->blocking(1);

    # 注入 UTF-8 环境变量，解决远程命令输出乱码
    my $full_cmd = "export LANG=en_US.UTF-8; export LC_ALL=en_US.UTF-8; $cmd";

    $chan->exec($full_cmd) or croak "Exec failed: $!";

    # 实时读取输出
    while ( my $line = <$chan> ) {
        $line = Encode::decode( "UTF-8", $line );
        print $line;
    }

    my $exit_code = $chan->exit_status();
    $chan->close();

    if ( $exit_code != 0 ) {
        warn "[!] Command exited with code: $exit_code\n";
    }
    return $exit_code;
}

# 上传文件 (SCP)
sub upload {
    my ( $self, $local, $remote ) = @_;
    print "[^] Uploading $local to $remote..." if $self->{debug};

    $self->{ssh2}->scp_put( $local, $remote )
      or croak "\n[!] Upload failed: $!";

    print " [DONE]\n" if $self->{debug};
}

# 下载文件 (SCP)
sub download {
    my ( $self, $remote, $local ) = @_;
    print "[v] Downloading $remote to $local..." if $self->{debug};

    $self->{ssh2}->scp_get( $remote, $local )
      or croak "\n[!] Download failed: $!";

    print " [DONE]\n" if $self->{debug};
}

# 打包并上传目录
sub upload_dir {
    my ( $self, $local_dir, $remote_path ) = @_;

    my $archive_name   = 'deploy_temp.tar.gz';
    my $original_dir   = cwd();                  # 记录当前位置
    my $abs_local_path = abs_path($local_dir);
    print "[*] Packaging $local_dir..." if $self->{debug};

    # 切换到目标目录内部，这样打包的文件路径就是相对的
    chdir($abs_local_path) or die "Cannot chdir to $local_dir: $!";

    # 递归添加目录下所有文件
    my @files;
    find(
        sub { push @files, $File::Find::name if -f $_ && $_ ne $archive_name; },
        "."
    );

    # 1. 创建 Tar 包
    my $tar = Archive::Tar->new;
    $tar->add_files(@files);

    # 将 Tar 包写到原来的目录下（防止写在正在打包的目录里）
    my $archive_full_path = "$original_dir/$archive_name";
    $tar->write( $archive_full_path, COMPRESS_GZIP );

    # 切回原目录
    chdir($original_dir);
    print " [OK]\n" if $self->{debug};

    # 2. 上传压缩包
    $self->upload( $archive_name, "/tmp/$archive_name" );

    # 3. 远程创建目录并解压
    # -p 确保父目录存在，-C 指定解压目标目录
    $self->run(
        "mkdir -p $remote_path && tar -xzf /tmp/$archive_name -C $remote_path");

    # 4. 清理临时文件
    unlink($archive_name);                  # 删除本地临时包
    $self->run("rm /tmp/$archive_name");    # 删除远程临时包

    print "[*] Directory deployed to $remote_path\n" if $self->{debug};
}

# Download a remote directory to a local path
sub download_dir {
    my ( $self, $remote_dir, $local_target_dir ) = @_;

    my $temp_archive  = "/tmp/download_temp_" . time() . ".tar.gz";
    my $local_archive = "download_temp.tar.gz";

  # 1. Ask the VPS to compress the directory
  # -C changes to the parent directory so the tar doesn't contain absolute paths
    print "[*] Remote packaging $remote_dir..." if $self->{debug};
    $self->run(
"tar -czf $temp_archive -C \$(dirname $remote_dir) \$(basename $remote_dir)"
    );
    print " [OK]\n" if $self->{debug};

    # 2. Download the single compressed file
    $self->download( $temp_archive, $local_archive );

    # 3. Extract locally using Perl (Cross-platform)
    print "[*] Extracting to $local_target_dir..." if $self->{debug};

    # 将相对路径转换为绝对路径，防止 chdir 后找不到文件
    my $abs_archive_path = abs_path($local_archive)
      or die "Cannot find archive file: $local_archive";

    # 创建并切换到目标目录
    mkdir $local_target_dir unless -d $local_target_dir;
    my $old_dir = cwd();
    chdir($local_target_dir) or die "Cannot chdir to $local_target_dir: $!";

    my $tar = Archive::Tar->new;
    $tar->read($abs_archive_path) or die "Cannot read tar: " . $tar->error;
    $tar->extract();    # 现在会解压到 $local_target_dir 内部
    chdir($old_dir);    # 切回原目录
    print " [DONE]\n" if $self->{debug};

    # 4. Cleanup
    unlink($local_archive);            # Delete local temp file
    $self->run("rm $temp_archive");    # Delete remote temp file
}

# 断开连接
sub disconnect {
    my $self = shift;
    $self->{ssh2}->disconnect() if $self->{ssh2};
}

1;    # 必须返回 1
