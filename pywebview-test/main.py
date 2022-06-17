# -*- coding: utf-8 -*-
import ast
import webview
import time


def full_screen_size(window):
    """
    @doc: https://pywebview.flowrl.com/examples/screens.html
    :return:
    """
    screen = webview.screens
    # @doc: https://www.geeksforgeeks.org/python-convert-a-string-representation-of-list-into-list/
    list_screen = ast.literal_eval(str(screen))
    window.resize(list_screen[0][0], list_screen[0][1])
    window.move(0, 0)


def evaluate_js(window):
    result = window.evaluate_js(
        r"""
        var h1 = document.createElement('h1')
        var text = document.createTextNode('Hello pywebview')
        h1.appendChild(text)
        document.body.appendChild(h1)

        document.body.style.backgroundColor = '#212121'
        document.body.style.color = '#f2f2f2'

        // Return user agent
        'User agent:\n' + navigator.userAgent;
        """
    )
    print(result)


def load_html(window):
    time.sleep(5)
    window.load_html('<h1>This is dynamically loaded HTML</h1>')
    window.load_url("https://github.com/gozeon")


def success_cb(window):
    # full_screen_size(window)
    evaluate_js(window)
    load_html(window)


if __name__ == '__main__':
    # window = webview.create_window(title="Gozeon", url="https://github.com/gozeon")
    window = webview.create_window(title="Gozeon",  html='<h1>This is initial HTML</h1>')

    webview.start(func=success_cb, args=window, debug=False, gui="cef", user_agent="Gozeon App")
