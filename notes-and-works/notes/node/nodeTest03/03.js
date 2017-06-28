/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');
var app = express();

app.set('view engine','ejs');
app.get('/',function(req,res){
    res.render('haha',{
        "news":[123,456,789]
    });
});
app.listen(3000);