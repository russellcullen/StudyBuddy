/*
 * models.js
 *   Declare models for mongoose
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
	fbid : String,
	name : String,
  // courses : [ObjectId] // Course ids, not needed for now
});

var Course = new Schema({
  name : String,
  desc : String,
  students : [ObjectId], // User ids
  public : { type: Boolean, default: true }
})

Course.methods.addStudent = function (studentId, cb) {
  return this.model('Course').update({'_id' : this._id}, { '$push' : { students : studentId }}, cb);
}

module.exports = {
  User: mongoose.model("User", User),
  Course: mongoose.model("Course", Course)
}