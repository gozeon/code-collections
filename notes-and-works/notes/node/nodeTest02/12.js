/**
 * Created by Goze on 2016/9/8.
 */
var http = require('http');
var formidable = require('formidable');
var util =require('util');
var fs = require('fs');
var datetime = require('silly-datetime');
var path = require('path');

http.createServer(function(req,res){
    //如果你的访问地址是这个，并且请求类型是post
    if(req.url == "/dopost" && req.method.toLowerCase() == "post")
    {
        // parse a file upload
        // form用来存
        var form = new formidable.IncomingForm();
        //设置文件上传的存放地址
        form.uploadDir = "./upload";
        //执行里面的回调函数的时候，表单已经全部接受完毕了。
        form.parse(req, function(err, fields, files) {
            //console.log(fields);
            //console.log(files);
            //扩展名
            var extname = path.extname(files.photo.name);
            //时间
            var t =datetime.format(new Date(), 'YYYYMMDDHHmmss');
            //5位随机数
            var r = parseInt(Math.random()*89999+10000);
            //两个名字
            var oldpath = __dirname+"/"+files.photo.path;
            var newpath = __dirname+"/upload/"+t+r+extname;
            //改名
            fs.rename(oldpath,newpath,function(err){
            	if(err){
            		throw Error('上传失败');
            	}
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end(util.inspect({fields: fields, files: files}));  //引入 util
            });
            // /所有的文本域、单选框，都在fields存放
            //所有的文件域，files
        });
    }
    else if(req.url == "/")
    {
    	//呈现11.html页面
    	fs.readFile('./11.html',function(err,data){
    		if (err) {throw Error('读取失败');}
    		res.writeHead(200,{'Content-Type':'text/html;charset=UTF8'});
    		res.end(data);
    	});
    }
}).listen(80,'127.0.0.1');
