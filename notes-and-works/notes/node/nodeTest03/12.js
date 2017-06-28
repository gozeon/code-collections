/**
 * Created by Goze on 2016/9/9.
 */
var express = require('express');
var app = express();
//http://127.0.0.1:3000/?&id=12&sex=nn&sex=bb
//get请求
app.get('/',function(req,res){
    console.log(req.query);
    res.send();
});
app.listen(3000);