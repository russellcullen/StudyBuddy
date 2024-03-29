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
  email : String,
  receive_emails : {
    type: Boolean,
    default: true
  },
  gravatar : String
});

/*
 * Course model
 */
var Course = new Schema({
  name : {
    type: String,
    required: true
  },
  desc : {
    type: String,
    required: true
  },
  students : [{
    type: ObjectId,
    ref: 'User'
  }],
  public : {
    type: Boolean,
    default: true 
  }
});

Course.methods.addStudent = function (studentId, cb) {
  return this.model('Course').update({'_id' : this._id}, { '$addToSet' : { students : studentId }}, cb);
}


/*
 * Status model
 */
var Status = new Schema({
  course : {
    type: ObjectId,
    ref: 'Course',
    required: true
  },
  user : {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  status : { 
    type: String, 
    enum: ['Enrolled', 'Taken'],
    default: 'Enrolled'
  }
});

/*
 * Broadcast model
 */
var Broadcast = new Schema({
  from : { 
    type: ObjectId,
    ref: 'User' 
  },
  course: { 
    type: ObjectId,
    ref: 'Course' 
  },
  message: {type: String, required: true},
  date_added: Date
})

module.exports = {
  User: mongoose.model("User", User),
  Course: mongoose.model("Course", Course),
  Status : mongoose.model("Status", Status),
  Broadcast : mongoose.model("Broadcast", Broadcast)
}