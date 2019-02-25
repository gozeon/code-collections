import logging


def user_logging(func):
  def wrapper():
    logging.warn("%s is running" % func.__name__)
    return func()
  return wrapper


def foo():
  print('i am foo')

foo = user_logging(foo)
foo()

