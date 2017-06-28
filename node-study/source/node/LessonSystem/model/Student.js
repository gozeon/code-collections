var mongoose = require('mongoose');
var db = require('../model/db.js');

var studentSchema = new mongoose.Schema({
  stuid:Number,
  name:String,
  age:Number,
  sex:String
});

studentSchema.index({stuid:1});

var Student = mongoose.model('Student',studentSchema);
module.exports = Student;
