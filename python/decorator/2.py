import logging


def user_logging(func):
  logging.warn("%s is running" % func.__name__)
  func()

def foo():
  print('i am foo')

user_logging(foo)

