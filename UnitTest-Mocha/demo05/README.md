###  异步测试
```bash
$ mocha -t 5000 timeout.test.js
```
测试用例里面，有一个done函数。it块执行的时候，传入一个done参数，当测试结束的时候，必须显式调用这个函数，告诉Mocha测试结束了。否则，Mocha就无法知道，测试是否结束，会一直等到超时报错。

Mocha默认会高亮显示超过75毫秒的测试用例，可以用-s或--slow调整这个参数。
```bash
$ mocha -t 5000 -s 1000 timeout.test.js
```
包含异步请求
```bash
$ mocha -t 10000 async.test.js
```

Mocha内置对Promise的支持，允许直接返回Promise，等到它的状态改变，再执行断言，而不用显式调用done方法
```bash
$ mocha -t 10000 promise.test.js
```