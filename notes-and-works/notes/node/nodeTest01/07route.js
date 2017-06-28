var http = require('http');
var url = require('url');

var server = http.createServer(function(req,res){
	var userurl = req.url;

	res.writeHeader(200,{'Content-Type':'text/heml;charset=UTF8'});

	//substr函数来判断此时的开头
	if(userurl.substr(0,9) == '/student/')
	{
		var studentid = userurl.substr(9);  //第九位到最后一位
		
		if(/^\d{10}$/.test(studentid))
		{
			res.end('您要查询学生信息,id为'+studentid);
		}
		else
		{
			res.end('学习学生id不正确');
		}
	}
	else if(userurl.substr(0,9) == '/teacher/')
	{
		var teacherid = userurl.substr(9);
		
		if(/^\d{6}$/.test(teacherid))
		{
			res.end('您要查询的教师信息，id为'+teacherid);
		}
		else
		{
			res.end('教师id不正确');
		}
	}
	else
	{
		res.end('请检查路由');
	}
});

server.listen(3000,'127.0.0.1');