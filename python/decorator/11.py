#coding=utf-8
# -*- coding=utf-8 -*-
from functools import wraps

def my_decorator(func):
    def wrapper(*args, **kwargs):
        '''decorator'''
        print('Calling decorated function...')
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def example():
    """Docstring"""
    print('Called example function')

print(example.__name__, example.__doc__)
