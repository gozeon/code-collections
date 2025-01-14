import aiohttp_cors
import zmq.asyncio
import asyncio
from aiohttp import web
from settings import settings
from log import get_logger

logger = get_logger()

# 设置 ZeroMQ 发布者
context = zmq.asyncio.Context()
socket = context.socket(zmq.PUB)
socket.bind(settings.ZMQ_PUB_URL)


async def send_message(message):
    await socket.send_json(message)


async def handle_query(request):
    query_params = dict(request.query)
    # 判断查询参数是否为空
    if not query_params:
        raise web.HTTPBadRequest()

    query_params["user-agent"] = request.headers.get('user-agent')
    # 直接异步发送消息
    asyncio.create_task(send_message(query_params))
    return web.Response(text="ok")


async def handle_body(request):
    body = await request.json()
    print(dict(body))
    if not dict(body):
        raise web.HTTPBadRequest()
    body["user-agent"] = request.headers.get('user-agent')
    # 直接异步发送消息
    asyncio.create_task(send_message(body))
    return web.Response(text="ok")


app = web.Application(logger=logger)
app.add_routes([web.get('/', handle_query), web.post('/', handle_body)])

cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_headers="*",
        expose_headers="*",
        allow_credentials=True,
    )
})

for route in list(app.router.routes()):
    cors.add(route)

if __name__ == '__main__':
    web.run_app(app, host=settings.HTTP_HOST, port=settings.HTTP_PORT, access_log=logger)
