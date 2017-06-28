# Go-Study

# GVM --> go版本管理工具

[GVM](https://github.com/moovweb/gvm)

第一次安装要先安装1.4版本 再安装高版本
```bash
gvm install go1.4 -B
gvm use go1.4
export GOROOT_BOOTSTRAP=$GOROOT
echo $GOROOT
gvm install go1.8beta2 -B
gvm use go1.8beta2 --default
echo $GOROOT
go version

```

###　安装包　
```bash
go get xxx    可选参数 -v || -u
```