/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');
var app = express();
//中间件讲究顺序
//路由冲突，依次运行，可以用中间件next来控制
app.get('/:username/:id', function (req,res,next) { //参数next
   var name = req.params['username'];
    //检索数据库，如果username不存在，那么 next()
    if(检索数据库)
    {
        res.send('不能send两次');
    }
    else
    {
        next();
    }
});
app.get('/admin/login', function (req,res) {
   res.send('不能send两次');
});
app.listen(3000);