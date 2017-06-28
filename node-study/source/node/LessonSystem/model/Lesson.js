var mongoose = require('mongoose');

//Schema
var lessonSchema = new mongoose.Schema({
    lesid : Number,
    name : String,
    students : [Number]
});

//索引
lessonSchema.index({lesid:1});

lessonSchema.statics.addStudent = function(lesidary,stuid,callback){
  for(var i = 0 ; i < lesidary.length ; i++){
        Lesson.update({"kid":lesidary[i]},{$push :{"students":stuid}},function(){
            console.log("课程添加报名学生成功");
        })
    }
}

//model
var Lesson = mongoose.model('Lesson',lessonSchema);

module.exports = Lesson;
