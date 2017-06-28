var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
	//不处理小图标
	if(req.url == "/favicon.ico")
	{
		return;
	}
	//stat检测状态
	fs.stat('./album/test',function(err,data){
		console.log(data.isDirectory()); //检测是否是文件夹
	});
	res.end();
});

server.listen(3000,'127.0.0.1');