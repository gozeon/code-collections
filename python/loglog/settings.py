import os
from dotenv import load_dotenv

# 加载 .env 配置
load_dotenv()


class Settings:
    # ZeroMQ 配置
    ZMQ_PUB_URL = os.getenv("ZMQ_PUB_URL")

    # Elasticsearch 配置
    ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST")
    ELASTICSEARCH_USERNAME = os.getenv("ELASTICSEARCH_USERNAME")
    ELASTICSEARCH_PASSWORD = os.getenv("ELASTICSEARCH_PASSWORD")

    # 日志配置
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

    # HTTP 服务配置
    HTTP_HOST = os.getenv("HTTP_HOST", "0.0.0.0")
    HTTP_PORT = int(os.getenv("HTTP_PORT", 8000))


# 创建一个设置实例
settings = Settings()
