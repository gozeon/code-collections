import logging


def user_logging(func):
  def wrapper(name):
    logging.warn("%s is running" % func.__name__)
    return func(name)
  return wrapper


@user_logging
def foo(name):
  print('i am %s' % name)


foo('haha')

