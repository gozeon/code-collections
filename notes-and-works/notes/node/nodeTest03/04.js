/**
 * Created by Goze on 2016/9/8.
 */
var express = require('express');
var app = express();

app.get('/student/:id',function(req,res){
    var id = req.params['id'];
    var rex = /^[\d]{6}$/;
    if(rex.test(id))
    {
        res.send(id);
    }
    else
    {
        res.send('检查格式');
    }
});
app.get('/:name/:id', function (req,res) {
    var name = req.params['name'];
    var id = req.params['id'];
    res.send(name+id);
});
app.listen(3000);
