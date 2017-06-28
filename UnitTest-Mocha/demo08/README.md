###  浏览器测试
首先，使用**mocha init**命令在指定目录生成初始化文件。
```bash
$ mocha init demo08
```
文档目录结构变为

 - index.html
 - mocha.css
 - mocha.js
 - tests.js

新建源码文件 **add.js**
将源码文件 **add.js** 以及断言库 **chai.js**，加入 **index.html**
```html
<script src="add.js"></script>
<script src="http://chaijs.com/chai.js"></script>
```

在 **tests.js** 写入测试脚本  
运行 **index.html** 文件