import grpc
from concurrent import futures
import time
import logging

import helloworld_pb2
import helloworld_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class Gretter(helloworld_pb2_grpc.GreeterServicer):
  def SayHello(self, request, response):
    return helloworld_pb2.HelloReply(message='Hello, %s' % request)

def server():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  helloworld_pb2_grpc.add_GreeterServicer_to_server(Gretter(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  try:
    while True:
      time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
    server.stop()

if __name__ == '__main__':
  logging.basicConfig()
  server()
