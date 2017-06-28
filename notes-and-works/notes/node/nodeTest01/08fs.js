var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
	//不处理小图标
	if(res.url == '/favicon.ico')
	{
		return;
	}
	//验证事件机制,给用户加5位数id
	var userid = parseInt(Math.random()*8999)+10000;
	console.log('欢迎'+userid);

	res.writeHeader(200,{'Content-Type':'charset=UTF8'});
	//两个参数，第一个是完整路径，当前目录写./
	//第二个参数，就是回调函数，表示文件读取成功之后，做的事情
	fs.readFile('./test/yuan.html',{'charset':'utf-8'},function(err,data){
		if(err)
		{
			throw err;
		}
		console.log(userid+'文件验证完毕');
		res.end(data);
	});	
});

server.listen(3000,'127.0.0.1');