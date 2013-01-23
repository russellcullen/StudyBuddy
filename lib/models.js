/*
 * models.js
 *   Declare models for mongoose
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = Schema({
	fbid : String,
	name: String
});

exports.User = mongoose.model("User", User);