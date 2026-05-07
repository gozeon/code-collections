> 仅支持解析视频，根据关键帧拆分


## 运行

```bash
make run
```

## 模拟rtmp

```bash
# rtmp 服务器
docker run --rm -p 11935:1935 --name rtmp-server alfg/nginx-rtmp

# ffmpeg 推流, -stream_loop -1 表示循环推流，这样就一直有数据
ffmpeg -re -stream_loop -1 -i "test.mp4" -c copy -f flv rtmp://localhost:11935/stream/test
```
