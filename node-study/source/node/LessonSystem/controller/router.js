var Student = require('../model/Student.js');
var Lesson = require('../model/Lesson.js');
// Lesson.create({"lesid":101,"name":"美术课"});
// Lesson.create({"lesid":102,"name":"体育课"});
// Lesson.create({"lesid":103,"name":"语文课"});
// Lesson.create({"lesid":104,"name":"英语课"});
// Lesson.create({"lesid":105,"name":"数学课"});
//首页
exports.showIndex = function(req,res,next){
  Student.find({},function(err,result){
    res.render('index',{
      "students":result
    });
  });
};
//添加学生
exports.addStudent = function(req,res,next){
  res.render('addStudent');
};
exports.doaddStudent = function(req,res,next){
  Student.create(req.query,function(err){
    if(err){
      res.render('temp',{
        "bool":false,
        "msg":"添加失败"
      });
    }
    res.render('temp',{
      "bool":true,
      "msg":"添加成功"
    });
  });
};

//修改学生
exports.updateStudent = function(req,res,next){
  var stuid = parseInt(req.params['stuid']);
  Student.findOne({"stuid":stuid},function(err,result){
    if(err || !result){
      res.render('temp',{
        "bool":false,
        "msg":"未知错误"
      });
    }
    res.render('updateStudent',{
      "student" : result
    });
  });
};
exports.doUpdateStudent = function(req,res,next){
  var stuid = parseInt(req.params["stuid"]);
  Student.update({"stuid":stuid},req.query,function(err,resule){
    if(err){
      res.render('temp',{
        "bool":false,
        "msg":"修改失败"
      });
    }
    res.render('temp',{
      "bool":true,
      "msg":"修改成功"
    });
  });
};

//删除
exports.deleteStudent = function(req,res,next){
  var stuid = parseInt(req.params["stuid"]);
  Student.remove({"stuid":stuid},function(err,resule){
    if(err){
      res.render('temp',{
        "bool":false,
        "msg":"删除失败"
      });
    }
    res.render('temp',{
      "bool":true,
      "msg":"删除成功"
    });
  });
};
