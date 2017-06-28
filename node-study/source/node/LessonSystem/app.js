var express = require('express');
var app = express();
var router = require('./controller/router.js');

app.set('view engine',"ejs");
app.use(express.static('./public'));

app.get('/',router.showIndex);

app.get('/addStudent',router.addStudent);
app.get('/doaddStudent',router.doaddStudent);

app.get('/update/:stuid',router.updateStudent);
app.get('/doUpdateStudent/:stuid',router.doUpdateStudent);

app.get('/delete/:stuid',router.deleteStudent);

//404
app.use(function(req,res){
  res.render('404');
});
app.listen(8080);
