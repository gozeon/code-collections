import zmq.asyncio
import asyncio
from aiohttp import web
from aiohttp.abc import AbstractAccessLogger
from settings import settings
from log import get_logger

logger = get_logger()

# 设置 ZeroMQ 发布者
context = zmq.asyncio.Context()
socket = context.socket(zmq.PUB)
socket.bind(settings.ZMQ_PUB_URL)


async def send_message(message):
    await socket.send_json(message)


async def handle(request):
    query_params = dict(request.query)
    # 判断查询参数是否为空
    if not query_params:
        return web.Response(text="No query parameters found. Not sending message.")
    # 直接异步发送消息
    asyncio.create_task(send_message(query_params))
    return web.Response(text=f"Message sent: {query_params}")


app = web.Application(logger=logger)
app.add_routes([web.get('/', handle)])


# 自定义 AccessLogger
class LoguruAccessLogger(AbstractAccessLogger):
    def log(self, request, response, time_taken):
        logger.info(f"[{response.status}] | {request.query_string} ")


if __name__ == '__main__':
    web.run_app(app, host=settings.HTTP_HOST, port=settings.HTTP_PORT, access_log_class=LoguruAccessLogger)
