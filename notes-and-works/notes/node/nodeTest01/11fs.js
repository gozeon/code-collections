
//取出文件夹，有bug（由于node事件机制，不能很好的将for循环执行彻底，所以要将异步转换为同步）

var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
	if(res.url == "/favicon.ico")
	{
		return;
	}
	//存储文件夹  数组
	var wenjianjia = [];

	fs.readdir('./album',function(err,files){
		//files是个文件名的数组，并不是文件的数组，表示./album这个文件夹中的所有东西
		//包括文件、文件夹
		for(var i=0; i<files.length;i++)
		{
			var thefilename = files[i];
			//又要进行一次检测
			fs.stat('./album/'+thefilename,function(err,stats){
				////如果他是一个文件夹，那么输出它：
				if(stats.isDirectory())
				{
					wenjianjia.push(thefilename);
				}
				console.log(wenjianjia);
			});
		}
	});
	res.end();
});

server.listen(3000,'127.0.0.1');