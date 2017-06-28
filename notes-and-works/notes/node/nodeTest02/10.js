/**
 * Created by Goze on 2016/9/7.
 */
var http = require('http');
var querystring =require('querystring');

http.createServer(function(req,res){
    //如果你的访问地址是这个，并且请求类型是post
    if(req.url == "/dopost" && req.method.toLowerCase() == "post")
    {
        var alldtata = '';
        //下面是post请求接受的一个参数
        //node为了追求极致，他是一个小段一个小段接受的
        //接受了一小段，可能就给别人服务了  。防止一个过大的表单阻塞I/O。  node事件环机制
        req.addListener('data',function(chunk){
            alldtata+=chunk;
            console.log(chunk);
        });
        //全部传输完毕
        req.addListener('end',function(){
            var datastring = alldtata.toString();
            //console.log(alldtata.toString());
            //引入querystring模块，将字符串转换为json
            //复选框会被转换为数组
            var dataObj = querystring.parse(datastring);
           console.log(dataObj);
            res.end('test post');
        });
    }
}).listen(80,'127.0.0.1');