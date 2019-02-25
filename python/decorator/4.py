import logging


def user_logging(func):
  def wrapper():
    logging.warn("%s is running" % func.__name__)
    return func()
  return wrapper


@user_logging
def foo():
  print('i am foo')


foo()
