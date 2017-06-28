var http = require('http');

var server = http.createServer(function(req,res){
	res.writeHeader(200,{'Content-Type':'text/html;charset=UTF8'});
	res.end('<h1>hello world</h1>');
});

server.listen(3000,'127.0.0.1');