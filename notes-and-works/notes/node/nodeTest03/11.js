/**
 * Created by Goze on 2016/9/9.
 */
var express = require('express');
var app = express();

//设置模板引擎
//app.set('view engine','ejs');

//如果你不想用views文件夹的，可以添加以下语句
app.set('views','a');
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('haha', {news: []});
});

app.get('/check', function (req,res) {
   res.send({
       'user' : 'ok'
   });
});

app.listen(3000);