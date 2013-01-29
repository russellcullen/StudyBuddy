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
  name : String,
  desc : String,
  students : [ObjectId], // User ids
  public : { type: Boolean, default: true }
});

Course.methods.addStudent = function (studentId, cb) {
  return this.model('Course').update({'_id' : this._id}, { '$addToSet' : { students : studentId }}, cb);
}

/*
 * Status model
 */
var Status = new Schema({
  course : ObjectId,
  user : ObjectId,
  status : {type: String, default: "Taking"}
});

module.exports = {
  User: mongoose.model("User", User),
  Course: mongoose.model("Course", Course),
  Status : mongoose.model("Status", Status)
}