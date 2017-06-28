//这个文件讲解HTTP模块
//引用模块
var http = require("http");

//创建一个服务器,回调函数表示接收到请求之后做的事情
var server = http.createServer(function(req,res){
	
	//req参数表示请求，res表示响应
	console.log("服务器接收到了请求"+req.url);

	//设置头部
	res.writeHead(200, {'Content-Type': 'text/html;charset=UTF8'});
	res.write("<h1>这里可以填写内容</h1>");
	res.write("<h1>这里可以填写内容</h1>");
	res.write("<h1>这里可以填写内容</h1>");
	res.write("<h1>这里可以填写内容</h1>");
	res.write("end之后不能write");
	res.end();  //必须要有，可以为空
});
//监听端口
server.listen(3000,"127.0.0.1");