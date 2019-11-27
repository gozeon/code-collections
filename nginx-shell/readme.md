nginx脚本，简单使用

# 注意
权限 
```
chmod 755 ./load_nginx.sh
```

修改nginx为绝对路径

# 测试

```
docker run --rm -it -v "$PWD":/usr/src/app -w /usr/src/app nginx /bin/bash
./load_nginx.sh
```