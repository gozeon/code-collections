
## 配置

`cp streams.txt.example streams.txt`

## 运行

```bash
make
./rtmp_record
```

## 清理

```bash
# crontab
# 每天凌晨 1 点执行，删除 7 天前的 .flv 文件
0 1 * * * find /你的录制目录 -name "*.flv" -mtime +7 -exec rm {} \;
``

## docker

```bash
docker run -d --rm
    -v /etc/localtime:/etc/localtime:ro \
    -v /data/records:/app/records \
    --log-driver json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    rtmp_record
```

## 合并

下载ffmpeg可点击 https://johnvansickle.com/ffmpeg/

```bash
# 修改脚本里的配置
perl merge_flv.pl
```
