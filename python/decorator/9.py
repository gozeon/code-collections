from functools import wraps

def logged(func):
  @wraps(func)
  def with_logging(*args, **kwargs):
      print func.__name__
      print func.__doc__
      return func(*args, **kwargs)
  return with_logging

@logged
def f(x):
  """does some math"""
  return x + x * x

f(12)
