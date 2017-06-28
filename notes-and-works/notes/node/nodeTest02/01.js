/**
 * Created by Goze on 2016/9/6.
 */
var http = require('http');

 server = http.createServer(function(req,res){
     //每次接受请求之后做的事情
     res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
     res.write('<h1>哈哈</h1>');
     res.write('<h1>哈哈</h1>');
     res.write('<h1>哈哈</h1>');
     res.write('<h1>哈哈</h1>');
    res.end('success');
}).listen(80,'127.0.0.1');