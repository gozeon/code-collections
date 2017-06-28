var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

http.createServer(function(req,res){
    fs.readFile('./views/index.ejs',function(err,data){
        //绑定模板
        var templete = data.toString();
        var dictionary = {
            a:6,
            news:[
                {'title':'123','count':10},
                {'title':'456','count':20},
                {'title':'789','count':30}
            ]
        };
        var html = ejs.render(templete,dictionary);
        //输出
        res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
        res.end(html);
    });
}).listen(80,'127.0.0.1');
