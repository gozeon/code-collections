/**
 * Created by Goze on 2016/9/9.
 */
var express = require('express');
var bodyParser = require('body-parser');  //模块
var app = express();
//POST请求

//模板引擎
app.set('view engine','ejs');
app.get('/',function(req,res){
    res.render('form');
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req,res) {
   console.log(req.body);
    res.send();
});
app.listen(3000);