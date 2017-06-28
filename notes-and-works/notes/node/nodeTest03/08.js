/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');
var app = express();
//如果不加中间件next,后面的语句不会被执行,
//app.use('/', function (req,res,next) {
//   console.log(new Date());
//    next();
//});
//简写
app.use(function (req,res,next) {
    console.log(new Date());
    next();
});
//use会无线拓展
app.use('/admin', function(req, res, next) {
    // GET 'http://www.example.com/admin/new'
    console.log(req.originalUrl); // '/admin/new'
    console.log(req.baseUrl); // '/admin'
    console.log(req.path); // '/new'
    next();
});
app.listen(3000);