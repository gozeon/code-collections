# import sys
# import mod
# print(sys.path)
# print(mod.s)

# from mod import Foo
# x = Foo()
# print(x)

# from mod import *
# print(s)

# from mod import s as str
# print(str)

# try:
#     import baz
# except ImportError:
#     print('Module not found')

# import mod
# print(dir())

# import pkg
# pkg.A
# print(pkg.A)

# from pkg import mod1
# mod1.foo()

# import pkg
# pkg.mod1.foo()
# pkg.mod2.bar()

from pkg2 import *
print(dir())
mod2.bar()