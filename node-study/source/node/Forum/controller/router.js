var formidable = require('formidable');
var db = require('../model/db.js');
var md5 = require('../model/md5.js');
var path = require("path");
var fs = require("fs");
var gm = require("gm");

//首页
exports.showIndex = function (req, res, next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登录了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登录
        var username = "";  //制定一个空用户名
        var login = false;
    }
    //已经登录了，那么就要检索数据库，查登录这个人的头像
    db.find("users", {username: username}, function (err, result) {
        if (result.length == 0) {
            var avatar = "moren.jpg";
        } else {
            var avatar = result[0].avatar;
        }
        res.render("index", {
            "login": login,
            "username": username,
            "active": "首页",
            "avatar": avatar    //登录人的头像
        });
    });
};
//注册页面
exports.showRegist = function(req,res,next){
	res.render('regist',{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "注册"
    });
};
//注册处理界面
exports.doRegist = function(req,res,next){
	//得到用户注册账户和密码
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var username = fields.username;
        var password = fields.password;
        var dbpaw = md5(password);
        //查询数据库中是否存在
        db.find("users",{"username":username},function(err,result){
        	if(err){
        		res.send('-3');  //服务器错误
        		return;
        	}
        	if(result.length != 0){
        		res.send('-1');   //用户名重复
        		return;
        	}
        	//存数据库
        	db.insertOne("users",{
        		"username":username,
        		"password":dbpaw,
                "avatar": "moren.jpg"
        	},function(err,result){
        		if (err) {
        			res.send('-3');  //服务器
        			return;
        		}
        		req.session.login = "1"; //app文件引包，通过req携带
        		req.session.username = username;

        		res.send("1"); //注册成功，写入session
        	});
        });
    });
};
//登录
exports.showLogin = function(req,res,next){
    res.render('login',{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "登录"
    });
};
//登录处理界面
exports.doLogin = function(req,res,next){
    //得到用户注册账户和密码
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var password = fields.password;
        var dbpaw = md5(password);

        //查询数据库
        db.find("users",{"username":username},function(err,result){
           //服务器错误
            if(err){
                res.send('-3');
                return;
            }
            //用户不存在
            if(result.length == 0 ){
                res.send('-1');
                return;
            }
            //验证密码
            if(dbpaw == result[0].password){
                req.session.login = "1";
                req.session.username = username;
                res.send('1');
                return;
            }else{
                res.send('-2');  //密码错误
                return;
            }

        });
    });
};
//设置头像,登录成功后
exports.showsetsetavatar = function(req,res,next){
    if (req.session.login != "1") {
        res.end("请先登录！");
        return;
    }
    res.render("setavatar", {
        "login": true,
        "username": req.session.username,
        "active": "修改头像"
    });
};
//设置头像
exports.dosetavatar = function (req, res, next) {
    //必须保证登录
    if (req.session.login != "1") {
        res.end("请先登录！");
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../avatar");
    form.parse(req, function (err, fields, files) {
        // console.log(files);
        var oldpath = files.touxiang.path;
        var newpath = path.normalize(__dirname + "/../avatar") + "/" + req.session.username + ".jpg";
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
            req.session.avatar = req.session.username + ".jpg"; //传到切页面 
            //跳转到切页面
            res.redirect("/cut");
        });
    });
}

//显示切图页面
exports.showcut = function (req, res,next) {
    //必须保证登录
    if (req.session.login != "1") {
        res.end("请先登录！");
        return;
    }
    res.render("cut", {
        avatar: req.session.avatar
    })
};

//执行切图
exports.docut = function (req, res, next) {
    //必须保证登录
    if (req.session.login != "1") {
        res.end("请先登录！");
        return;
    }
    //这个页面接收几个GET请求参数
    //w、h、x、y
    var filename = req.session.avatar;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("../avatar/" + filename)
        .crop(w, h, x, y)
        .resize(100, 100, "!")
        .write("../avatar/" + filename, function (err) {
            if (err) {
                // res.send("-1");
                //更改数据库当前用户的avatar这个值
                db.updateMany("users", {"username": req.session.username}, {
                    $set: {"avatar": req.session.avatar}
                }, function (err, results) {
                    if(err){
                        console("更新失败");
                        return;
                    }
                    res.send("1");
                });
                return;
            }

            // //更改数据库当前用户的avatar这个值
            // db.updateMany("users", {"username": req.session.username}, {
            //     $set: {"avatar": req.session.avatar}
            // }, function (err, results) {
            //     if(err){
            //         console("更新失败");
            //         return;
            //     }
            //     res.send("1");
            // });
        });
};

//发帖子
exports.dopost = function(req,res,next){
        //必须保证登录
    if (req.session.login != "1") {
        res.end("请先登录！");
        return;
    }

    //得到用户名
    var username = req.session.username;

    //formidable得到content
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //fields得到content
        var content = fields.content;

        //存数据库
        db.insertOne("posts",{
            "username" : username,
            "datetime" : new Date(),
            "content" : content
        },function(err,result){
            if (err) {
                res.send("-3");
                return;
            }
            res.send('1');
        });
    });
};
//得到所有贴子
exports.getalltie = function(req,res,next){
    var page = req.query.page;
    db.find("posts",{},{"pageamount":12,"page":page,"sort":{"datetime":-1}},function(err,result){
        res.json(result);
        // console.log(result);
    });
}
//得到某个人的帖子、时间、头像
exports.getusertie = function(req,res,next){
    var username = req.query.username;

    db.find("users",{"username":username},function(err,result){
        if(err || result.length == 0){
            res.send('');
            return;
        }

        //将结果组成json，并去掉密码项
        var obj = {
            "username" : result[0].username,
            "avatar" : result[0].avatar,
            "_id" : result[0]._id,
        }
        res.json(obj);
    });
};
//得到帖子总数
exports.gettieamount = function(req,res,next){
    db.getAllCount("posts",function(count){
        res.send(count.toString());
    })
};
//显示所有用户
exports.showuserlist = function(req,res,next){
    db.find("users",{},function(err,result){
        res.render("userlist",{
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username : "",
            "active" : "成员列表",
            "allusers" : result
        });
    });
};
//显示某个用户的所有帖子
exports.showuser = function(req,res,next){
    var username = req.params["username"];
    //查找帖子
    db.find("posts",{"username":username},function(err,result){
        //查找其它
        db.find("users",{"username":username},function(err,result2){
            res.render("user",{
               "login": req.session.login == "1" ? true : false,
               "username": req.session.login == "1" ? req.session.username : "",
               "user" : username,
               "active" : "我的主页",
               "cirenshuoshuo" : result,
               "cirentouxiang" : result2[0].avatar
            });
        });
    });
};
//退出
exports.out = function(req,res,next){
    req.session.login = '';
    res.render('index',{
        "login": false,
        "username": '',
        "active": "首页",
        "avatar": 'moren.jpg' 
    });
};