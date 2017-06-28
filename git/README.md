# git  
此仓库是为了练习git常用命令和使用github，并做出记录
### 第一次使用
ssh密钥： github链接已有仓库的认证
id_rsa文件是私有密钥，id_rsa.pub是公开密钥

创建：
```
$ ssh-keygen -t rsa -C "your_email@example.com"
(.../../id.rsa):回车
Enter passphraee (..):输入密码
......again:再次输入
```
查看：  
```
$ cat ~/.ssh/id_rsa.pub
ssh_rsa 公开密钥的内容 your_email@example.com

在github上创建新的ssh(一个名字，一个内容)，将公开密钥的内容复制到内容。
```
连接：
```
$ ssh -T git@github.com
此时会提示输入id_rsa,就是前面你设置的密码，而不是空格！（以后遇到也是这样的）
```
### 一系列步骤
* git clone ssh的内容  （此处我编写的是[php 文件](index.php "php")）
* git status 查询状态
* git add 提交的暂存区
* git commit -m “” 提交并注释
* git log 查看提交日志
* git push 推送到仓库  

### git基本操作  
1.  git init  初始化仓库 (此处可以先创建目录 mkdir git-tutorial 指定当前目录 cd git-tutorial)
2.  git status  查看仓库的状态
3.  git add  向暂存区添加文件
4.  git commit -m ""  将暂存区的文件保存到仓库的记录中(要规范，每次提交都要写清楚注释)
5.  git log  查看提交日志
6.  git diff  查看更改前后的差别  
7.  git branch 查看当前分支 -a  远程所有分支 
8.  git checkout (branch) 切换分支
9.  git pull/push origin (branch) 更新/推送分支
10. git merge (branch) 合并本地分支
11. git commit --amend 修改commit
***  
2016/4/25 发现push命令报错，pull 之后也是报错。只好乖乖的clone，然后再push。**要深学 git ！**   
git图解![git图解](/image/git.png) 
