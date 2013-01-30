/*
 * models.js
 *   Declare models for mongoose
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
 * User model
 */
var User = new Schema({
	fbid : String,
	name : String,
});

/*
 * Course model
 */
var Course = new Schema({
  name : {type: String, required: true},
  desc : {type: String, required: true},
  students : [ObjectId],
  public : {type: Boolean, default: true }
});

Course.methods.addStudent = function (studentId, cb) {
  return this.model('Course').update({'_id' : this._id}, { '$addToSet' : { students : studentId }}, cb);
}


/*
 * Status model
 */
var validateStatus = function(value) {
  return /Enrolled|Taken/i.test(value);
}

var Status = new Schema({
  course : {type: ObjectId, required: true},
  user : {type: ObjectId, required: true},
  status : { 
    type: String, 
    validate: [
      validateStatus, 'Status is not valid'
    ],
    default: 'Enrolled'}
});

module.exports = {
  User: mongoose.model("User", User),
  Course: mongoose.model("Course", Course),
  Status : mongoose.model("Status", Status)
}