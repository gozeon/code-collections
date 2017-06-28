# Linux基础知识
 
### linux概述  
* Linux起源于芬兰研究生LinuxTorvalds1991年的个人计划，最初只是一个简单的操作系统内核。  
* UNIX来源于AT&T贝尔实验室的一个研究项目，CSRG对其重新实现后发布了不含AT&T
代码的伯克利UNIX。这两种版本(AT&T和BSD)是很多UNIX类操作系统如Solaris、FreeBSD
等的共同祖先。
* Linux社区的开发人员借鉴了UNIX技术和使用方式，並將其融入Linux中。Linux不屬於
以上兩種unix中的任何一種。
* 基於社区合作的*开源文化*已经深刻的影响了这个世界。
* Linux内核遵循GPL协议发布，这个许可协议是GNU计划的一部分。  
 
### Linux分区问题  
硬盘一般分为IDE硬盘、SCSI硬盘和SATA硬盘。在Linux中，IDE接口的设备被成为hd，SCSI和SATA接口的设备则被称为sd。（第一块硬盘被称作sda(默认例子),第二块sdb...）Linux规定，一般硬盘上只能存在4个分区，分别被命名为sda1、sda2、sda3和sda4。逻辑分区刚从5开始标记，每多一个逻辑分区，就在末尾的分区好加1。逻辑分区没有个数限制。  
一般来说，每个系统都需要一个主分区来引导。这个分区中存放着引导整个系统所必须的程序和参数。在Windows环境中常说的C盘就是一个主分区，他是硬盘的第一个分区，在Linux下被成为sda1。其后D、E、F等属于逻辑分区，对应Linux下的sda5、sda6、sda7...
操作系统主体可以安装的主分区，也可以安装在逻辑分区，但引导程序必须安装在主分区 
对于Linux系统而言，必须有根分区(root)和交换分区(swap)两个分区。根分区被用来存放系统所必须的文件，被挂载到根目录下(/)；而交换分区相当于Windows中“虚拟内存”的概念，从某种程度上讲是对物理内存的一种补充，使操作系统在必要的时候可以把硬盘的这个分区当作低速RAM来使用。大于实际的物理内存容量，不能超过2GB(home目录单独划分了一个分区，这个目录主要用来存放登录用户的配置和私人文件)   
 
### Shell基本命令  
```
$ cd /  ##进入跟目录  
$ ls    ##列出文件和目录
```
/home :存放着系统中所有用户的主目录。主目录的名字就是用户名。  
```
$ cd /  ##进入/home目录
$ ls
guest lewis lost+found   ##两个用户：guest和lewis。
```
/etc : 存放着系统以及绝大部分应用软件的配置文件。  
```
$ cd /etc/  ##进入/etc/目录
$ ls
cat fstab   ## 查看fstab文件(fstab：定义了各硬盘分区所挂载到的目录路径。)
```
  
Shell补全(按下Tab一次，Shell自动把文件名补全；按下Tab两次，Shell会以列表的形式 给出所有以键入字符开头的文件。)  
Shell通配符：  
* “*”用于匹配文件名中任意长度的字符串。如：`ls *.cpp`  
* “?”用于匹配文件名中以键入字符(text)开头而后跟一个字符的文件。如：`ls text?`  
* “[]”用于匹配所有出现在方括号内的字符，也可以使用短线“-”来指定一个字符集范围  
  。所有包含在上下文之间的字符串都会被匹配。如：`ls text[1-3] || [a-z]`。  

### 查看目录和文件  
* 显示当前目录：pwd
* 改变目录：cd      (后跟一个路径名作为参数)
* 列出目录内容：ls  
  
+ ls -F  （每个目录后加上/，可执行文件后加*，链接文件后加@）
+ ls -a   (显示所有文件，包含隐含文件)
+ ls -aF
+ ls -l   (产看文件的各种属性)
* 列出目录内容：dir和vdir（相当于`ls -l`）
* 查看文件文本：cat(文件名作为参数，可跟通配符)和more  
  
+ cat -n test.h  命令里的'-n'显示行号
+ more命令在最后显示百分比，表示已显示的内容占整个文件的比例。空格键向下翻页,  
  Enter键向下滚动一行。Q键退出。  
* 阅读文件的开头和结尾：head和tail （-n参数指定显示的行数）  

+ head -n 2 day weather (显示两行，day和weather是文件名。tail相同)
* 更好的文本阅读工具：less （与more相似）
* 查找文件内容：grep [OPTIONS] PATTERN [FILE...]
* 按需查找某个特定的文件(包括目录)：find [OPTION][path...][expression] -print
* 更快速的定位文件-locate
* 查找特定程序：whereis  

### Linux文件系统的架构
Linux没有“盘符”的概念；已建立文件系统的硬盘分区被挂载到某一个目录下，用户用过操作目录来实现硬盘读；Linux似乎不存在想Windows\这样的系统目录；Linux使用正斜杠/。  
* /bin 构建最小系统所需要的命令(最常用的命令)
* /boot 内核与启动文件
* /dev 各种设备文件
* /etc 系统软件的启动和配置文件
* /home 用户的主目录
* /lib C编译器的库
* /media 可移动介质的安装点
* /opt 可选的应用软件包(很少用)
* /proc 进程的映像
* /root 超级用户root的主目录
* /sbin 和系统操作有关的命令
* /tmp 临时文件存放点
* /usr 非系统的程序和命令
* /var 系统专用的数据和配置文件  
  
#### 建立目录：mkdir命令可以一次建立一个或几个目录，可以是使用绝对路径  
```
$ cd ~                      #进入用户主目录
$ mkdir document picture    #新建两个目录
$ mkdir ~/picture/temp      #在主目录下新建名为temo目录
$ mkdir -p ~/tempx/job      #加入-p 选项
```
  
#### 建立空文件： touch  
```
$ touch hellp               #建立一个名为hello的文件
```
  
#### 移动和重命名：mv
```
$ mv hello bin/             #将hello文件*移动*到bin目录下
$ mv Photos/ 桌面/          #将Photos*目录*移动到桌面
```
  
#### 复制文件和目录：cp
```
$ cp test.php test/         #将test.php复制到test目录下 
$ cp -r test/ 桌面/         #解决自动跳过目录问题，将目录与文件一起复制
```
  
#### 关于mv和cp遇到的重命名问题
```
$ mv(cp) -i test.php test/      #提示功能

$ mv(cp) -b hello test/         #将目标母的的同名文件的文件名加`~`
$ mv(cp) -b hello~ hello_bak    #将其冲命名
```
  
#### 删除目录和文件 ：rmdir和rm
  
rmdir只能删除空文件夹
```
$ mkdir remove                  #新建remove目录
$ rmdir remove                  #删除remove目录
```
  
rm 删除目录或文件夹
```
$ rm test/*.php                 #删除所有.php的文件。可使用通配符
$ rm -i test/*.php              #提示一个boolean
$ rm -f test/*.php              #默认为true
```
  
#### 文件和目录的权限
Linux为3种人准备了权限——文件所有者(属主)、文件属组用户和其他人。root用户拥有完整权限。  
权限分为：读取(r)、写入(w)和执行(x)。  
查看文件和目录的属性
```
$ ls -l /bin/login
-rwxr-xr-x 1 root root 38096 2008-11-13 14:54 /bin/login
```
* "-"：表示普通文件。
* "rwxr-xr-x"：rwx、r-x、r-x表示属主、属组和其他人对应的权限。
* "root"：表示属主和属组。
* "1"：表示该文件的链接数目。  

#### 改变文件所有权: chown和chgrp  
chown命令用于改变文件的所有权  
```
chown [OPTION] ... [OWNER][:[GROUP]] FILE...

$ sudo chown lewis:root days      #修改days的所有权
$ sudo chown -R lewis iso/        # 将iso/和其下所有的文件交给用户lewis
```
  
chgrp命令用于设置文件的属组。  
```
$ sudo chgrp nogroup days         #将文件days的属组设置为nogroup组
$ sudo chgrp root iso/            #设置iso/和气息所有文件(和子目录)属组为root
```
  
改变文件权限：chmod  
chmod用于改变一个文件的权限，这个命令使用“用户组+/-权限”的表述方式来增加/删除相应的权限。具体来说，用户组包括了文件属性(u)、文件属组(g)、其他人(o)和所有人(a),而权限则包括了读取(r)、写入(w)和执行(x)。  
```
$ chmod u+x days                  
$ chmod a-x days                  
$ chmod ug=rw,o=r days            
$ chmod o=u days
```
  
### Linux文件系统  
文件系统是一种对物理空间的组织方式，通常在格式花硬盘是创建。  
#### 有关swap  
swap被称作交换分区。这是一块特殊的硬盘空间，当实际内存不够用的时候，操作系统会从内存中取出一部分暂时不用的数据，放在交换分区中，从而为当前的程序腾出足够的内存空间。这种“拆东墙，补西墙”的方式被应用于几乎所有的操作系统。其显著优点在于，通过操作系统的调度，应用程序实际可以使用的内存空间将远远超过系统的物理内存。由于硬盘空间的价格比RAM低得多，因此这种方式是非常经济和实惠的。当然，频繁的读写硬盘会显著降低系统的运行速度，这是使用交换分区最大的限制。具体使用多大的swap分区取决于物理内存大小和硬盘的容量。一般来说，swap分区容量应该要大于物理内存大小.  
#### 挂载文件系统:mount命令  
```
$ sudo mkdir /mnt/vista           #新建一个目录
$ sudo mount /dev/sda3/mnt/vista  #将Windows所在分区挂载到这个目录
$ sudo mount -r /dev/sda3/mnt/vista  #只读模式挂载
$ sudo mount -w /dev/sda3/mnt/vista  #可读写模式挂载
```
  
### 用户与用户组(知识点)  
* Linux通过用户名和口令来验证用户的身份。
* 几个用户可以组成一个“用户组”。
* useradd工具添加用户；groupadd命令添加用户组。
* history命令查看用户在shell中执行命令的历史记录。
* userdel命令删除用户帐号。
* usermod命令修改已有的用户信息。
* id命令查看特定用户的UID、GID及其所属的组。
* su命令临时切换用户身份。不带任何参数的su命令切换到root身份。
* sudo程序以更细的粒度分解系统特权。Ubuntu只允许使用sudo。
* UID唯一标识系统中的用户，root用户的UID为0；GID唯一标识系统中的用户组。
* 系统中的用户信息保存在/etc/passwd文件中，口令保存在/etc/shadow文件中
* /etc/group文件保存系统中的组信息。