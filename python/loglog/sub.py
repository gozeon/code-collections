import zmq.asyncio
import aiorun
from elasticsearch import Elasticsearch, ElasticsearchException
from datetime import datetime
from settings import settings  # 导入配置
from log import get_logger

logger = get_logger()

# 设置 Elasticsearch 客户端，添加账号和密码
es = Elasticsearch(
    [settings.ELASTICSEARCH_HOST],
    http_auth=(settings.ELASTICSEARCH_USERNAME, settings.ELASTICSEARCH_PASSWORD)
)


# 检查 Elasticsearch 是否可用
def check_es_connection():
    if not es.ping():
        raise ElasticsearchException("Elasticsearch is not available!")
    logger.info("Connected to Elasticsearch")


# 发送数据到 Elasticsearch
async def send_to_es(message):
    try:
        # 获取当前时间
        timestamp = datetime.now().isoformat()
        message["timestamp"] = timestamp

        # 将数据插入到名为 'loglog' 的索引中
        response = es.index(index="loglog", document=message)
        logger.info(f"Document indexed: {response['_id']}")
    except ElasticsearchException as e:
        logger.error(f"Error sending to Elasticsearch: {e}")


context = zmq.asyncio.Context()
socket = context.socket(zmq.SUB)
socket.connect(settings.ZMQ_PUB_URL)
socket.setsockopt_string(zmq.SUBSCRIBE, "")


# 持续监听消息
async def receive_messages():
    check_es_connection()
    while True:
        message = await socket.recv_json()
        logger.info(f"Received message: {message}")
        await send_to_es(message)


async def main():
    # 启动消息接收任务
    await receive_messages()


if __name__ == '__main__':
    aiorun.run(main())
