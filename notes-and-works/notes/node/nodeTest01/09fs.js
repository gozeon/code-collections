var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
	if(req.url == '/favicon.ico')
	{
		return;
	}
	fs.mkdir('./album/test',function(){ // 新建文件夹
		fs.rmdir('./album/test',function(){ //删除文件夹
			res.end();
		});
	});
});

server.listen(3000,'127.0.0.1');