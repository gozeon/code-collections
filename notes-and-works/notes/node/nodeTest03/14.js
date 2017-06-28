/**
 * Created by Goze on 2016/9/9.
 */
var express = require('express');

var app = express();
//设置模板引擎
app.engine('jade', require('jade').__express);
app.set('view engine','jade');

app.get('/', function (req,res) {
    console.log(req.ip);
    res.render('xixi');
});
app.listen(3000);