def foo():
  print("foo")


def bar(func):
  func()

bar(foo)
