var express = require('express');
var app = express();

var router = require("./controller/router.js");

//使用session
var session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//设置模板
app.set("view engine","ejs");

//静态资源
app.use(express.static('./public'));
app.use("/avatar",express.static('./avatar')); //头像文件夹

//路由
app.get('/',router.showIndex);

app.get('/regist',router.showRegist);  //注册
app.post('/doregist',router.doRegist);

app.get('/login',router.showLogin);    //登陆
app.post('/dologin',router.doLogin);

app.get('/setavatar',router.showsetsetavatar);  //设置头像
app.post("/dosetavatar",router.dosetavatar);

app.get("/cut",router.showcut);    //裁剪头像
app.get("/docut",router.docut); 

app.post('/post',router.dopost);  //发贴

app.get('/getalltie',router.getalltie);
app.get('/getusertie',router.getusertie);
app.get('/gettieamount',router.gettieamount);

app.get('/userlist',router.showuserlist);
app.get('/user/:username',router.showuser);

app.get('/out',router.out);

//404
app.use(function (req, res) {
    res.render("404");
});

app.listen(8080);