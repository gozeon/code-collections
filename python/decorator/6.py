import logging


def user_logging(func):
  def wrapper(*args, **kwargs):
    logging.warn("%s is running" % func.__name__)
    return func(*args, **kwargs)
  return wrapper


@user_logging
def foo(name, age=None, height=None):
  print('i am %s, age %s, height %s' % (name, age, height))


foo('haha', 12, 40)

