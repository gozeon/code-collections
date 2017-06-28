/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');

var app = express();
//静态服务
app.use(express.static('./static'));

app.get('/haha',function(req,res){
    res.send('haha');
});
app.listen(3000);