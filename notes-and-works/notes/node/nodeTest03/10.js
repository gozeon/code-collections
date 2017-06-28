/**
 * Created by Goze on 2016/9/9.
 */
var express = require('express');
var app = express();

//静态服务
//app.use(express.static('./static'));
app.use('/static',express.static('./static'));

//新的路由
app.get('/imges', function (req,res) {
    res.send('哈哈');
});
//自定义404 自动识别err参数，如果有，那么就这个函数能捕获err
app.use(function (req,res) {
        res.status(404).send('没有这个页面');
});
app.listen(3000);