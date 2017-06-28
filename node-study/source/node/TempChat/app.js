var express = require('express');
var app = express();
var router = require('./controller/router.js');

//socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

//session
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));

//路由
app.get('/',router.showIndex);
app.post('/login',router.login);
app.get('/chat',router.chat);
app.get('/paint',function(req,res,next){  //测试canvas
	res.render('paint');
});
app.get('/out',router.out);

//404
app.use(function (req, res) {
    res.render("404");
});

//socket.io
io.on("connection",function(socket){
	socket.on("words",function(msg){
		// console.log(msg);
		io.emit('words',msg);
	});
	socket.on('paint',function(msg){
		// console.log(msg);
		io.emit('paint',msg);
	});
});

http.listen(8080);