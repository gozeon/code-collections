FROM debian:12-slim

# 只安装运行所需的动态库，保持镜像精简
RUN apt-get update && apt-get install -y \
    librtmp1 \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY rtmp_record .
COPY streams.txt .

# 启动程序
ENTRYPOINT ["/app/rtmp_record"]