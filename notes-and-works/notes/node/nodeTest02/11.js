/**
 * Created by Goze on 2016/9/7.
 */
var http = require('http');
var querystring = require('querystring');
var formidable = require('formidable');
var util =require('util');

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
            if(err){throw err;}
            //console.log(fields);
            //console.log(files);
            // /所有的文本域、单选框，都在fields存放
            //所有的文件域，files
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));  //引入 util
        });

        return;
    }
}).listen(80,'127.0.0.1');