var http = require('http');
var url = require('url');

var server = http.createServer(function(req,res){
	res.writeHeader(200,{'Content-Type':'charset=UTF8'});
	var query = url.parse(req.url,true).query;

	var name = query.name;
	var age = query.age;
	var sex = query.sex;

	res.end(name+','+age+','+sex);
});

server.listen(3000,'127.0.0.1');