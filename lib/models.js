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
  courses : [ObjectId] // Course ids
});

var Course = new Schema({
  name : String,
  desc : String,
  students : [ObjectId], // User ids
  public : { type: Boolean, default: true }
})

module.exports = {
  User: mongoose.model("User", User),
  Course: mongoose.model("Course", Course)
}