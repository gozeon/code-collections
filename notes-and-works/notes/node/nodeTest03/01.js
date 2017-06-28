/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.send('main');
});
app.get('/haha',function(req,res){
    res.send('haha page');
});
app.get(/^\/student\/([\d]{10})$/,function(req,res){
    res.send("student"+req.params[0]);
});
app.get('/teacher/:gonghao',function(req,res){
    res.send('teacher id'+req.params.gonghao);
});
app.listen(3000);