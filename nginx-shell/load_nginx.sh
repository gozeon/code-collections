#!/usr/bin/env bash

# 建议使用绝对路径
NGINX="nginx"

#打开 nginx
start() {
    check && $NGINX 
}

#测试配置文件是否有语法错误
check() {
    $NGINX -t
}

#强制停止Nginx服务
stop() {
    $NGINX -s stop
}

#优雅地停止Nginx服务（即处理完所有请求后再停止服务）
quit() {
    $NGINX -s quit
}

#重启Nginx
reopen() {
    check && $NGINX -s reopen
}

#重新加载Nginx配置文件，然后以优雅的方式重启Nginx
reload() {
    check && $NGINX -s reopen
}

case "$1" in
  start)
    start
    ;;

  check)
    check
    ;;

  stop)
    stop
    ;;

  quit)
    quit
    ;;

  reopen)
    reopen
    ;;

  reload)
    reload
    ;;

  *)
    echo "Usage: $0 {start|check|stop|quit|reopen|reload}"
    echo "  start:  打开 nginx"
    echo "  check:  测试配置文件是否有语法错误"
    echo "  stop:   强制停止Nginx服务"
    echo "  quit:   优雅地停止Nginx服务（即处理完所有请求后再停止服务）"
    echo "  reopen: 重启Nginx"
    echo "  reload: 重新加载Nginx配置文件，然后以优雅的方式重启Nginx"
    exit 1
    ;;
esac

