/**
 * Created by Goze on 2016/9/6.
 */
/**
 * Created by Goze on 2016/9/6.
 */
var http = require('http');

server = http.createServer(function(req,res){
    //每次接受请求之后做的事情
    if(req.url == '/')
    {
        res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
        res.end('成功');
    }
    else
    {
        res.writeHead(404,{'Content-Type':'text/html;charset=UTF8'});
        res.end('失败');
    }

}).listen(80,'127.0.0.1');
