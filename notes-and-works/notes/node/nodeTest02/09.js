/**
 * Created by Goze on 2016/9/7.
 */
var http = require('http');
var route = require('./route.js');

http.createServer(function(req,res){
    if(req.url == '/')
    {
        route.showIndex(req,res);
    }
    else if(req.url.substr(0,9) == '/student/')
    {
        route.showStudent(req,res);
    }
    else
    {
       route.show404(req,res);
    }
}).listen(80,'127.0.0.1');