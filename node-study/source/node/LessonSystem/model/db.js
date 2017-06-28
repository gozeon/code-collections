var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/LessonSystemDB');

var db = mongoose.connection;
db.once('open', function (callback) {
    // console.log("数据库成功打开");
});

module.exports = db;

//此代码用mongoose.model声明model
//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/book');这样的用db.model
