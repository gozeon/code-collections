import logging


def user_logging(level):
  def decorator(func):
    def wrapper(*args, **kwargs):
      if level == "warn":
        logging.warn("%s is running" % func.__name__)
      elif level == "info":
        logging.info("%s is running" % func.__name__)
      return func(*args, **kwargs)
    return wrapper
  return decorator

@user_logging('info')
def foo(name, age=None, height=None):
  print('i am %s, age %s, height %s' % (name, age, height))


foo('haha', 12, 40)

