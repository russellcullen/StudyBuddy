/*
 * db.js
 *   Database wrappers
 */
var async = require('async');
var models = require('./models');
var Course = models.Course;
var Status = models.Status;
var Broadcast = models.Broadcast;
var User = models.User;

/*
 * DB wrapper for creating a course. Takes object with course/status params, and student to add
 */
exports.createCourse = function (params, studentId, cb) {
  var course = new Course({
    name: params.title,
    desc: params.desc,
    public: params.privacy,
    students: [studentId]
  });
  course.save(function (err) {
    if (err) return cb(err);
    var status = new Status({
      course: course._id,
      user: studentId,
      status: params.status
    });
    status.save(cb);
  });
}

/*
 * DB wrapper for joining a course. Takes student, and cousre to join
 */
exports.joinCourse = function (courseId, studentId, cb) {
  Course.findOne({ '_id' : courseId}, function (err, course) {
    course.addStudent(studentId, function (err) {
      if (err) return cb(err);
      var status = new Status({
        course: course._id,
        user: studentId,
      });
      status.save(cb);
    });
  });
}

/*
 * DB wrapper for getting courses, with supplied users status. 
 *    Takes userId, db query to perform on courses, and optional limit and skip params for db call. 
 */
exports.getCoursesWithStatus = function (userId, query, limit, skip, callback) {
  Course.find(query, null, {limit : limit, skip : skip}, function (err, courses){
    if (err) return callback(err, null);
    if (!userId) return callback(null, courses);
    async.map(courses, function (course, cb) {
      Status.findOne({course : course._id, user : userId}, function (err, status) {
        if (status) course.status = status.status;
        cb(err, course);
      });
    }, callback);
  });
}

/*
 * DB wrapper for getting a course by id. Add status field if user is logged in. 
 */
exports.getCourse = function (id, userId, cb) {
  Course.findOne({_id : id}, function (err, course) {
    if (err) return cb(err, null);
    Status.findOne({user: userId, course: course._id}, function (err, status) {
      if (status) course.status = status.status;
      cb(err, course);
    });
  });
}

/*
 * DB wrapper for getting a course by id with status, posts, and student names and pictures. 
 */
exports.getFullCourse = function (id, userId, cb) {
  Course
    .findOne({_id : id})
    .populate('students', 'name gravatar')
    .exec(function (err, course) {
      if (err) return cb(err, null);
      Status.findOne({user: userId, course: course._id}, function (err, status) {
        if (err) return cb(err, null);
        if (status) course.status = status.status;
        Broadcast
          .find({course : course._id})
          .sort('-date_added')
          .populate('from')
          .exec(function (err, posts) {
            course.posts = posts;
            cb(null, course)
        });
      });
    });
}

/*
 * DB wrapper for changing course status
 */
exports.updateStatus = function (courseId, studentId, status, cb) {
  Status.update({user : studentId, course: courseId},  {'$set': { status: status }}, cb);
}

/*
 * DB wrapper for sending a broadcast
 */
exports.sendBroadcast = function (studentId, courseId, message, callback) {
  var bcst = new Broadcast({
    from : studentId,
    course : courseId,
    message : message,
    date_added : Date.now()
  });
  bcst.save(callback);
}

/*
 * DB wrapper for getting a user's feed.
 */
exports.getFeed = function (userId, callback) {
  Course.find({students : userId}, function (err, courses) {
    async.map(courses, function (course, cb) {
      cb(null, course._id);
    }, function (err, ids) {
      if (err) callback(err, null);
      Broadcast
        .find({course : {'$in' : ids}})
        .populate('course')
        .populate('from')
        .sort('-date_added')
        .exec(callback);
    });
  });
}

/*
 * DB wrapper for getting all the posts by a user
 */
exports.getPosts = function (userId, callback) {
  Broadcast.find({from : userId})
    .populate('course')
    .sort('-date_added')
    .exec(callback);
}

/*
 * DB wrapper for getting a user with all their data
 */
exports.getUser = function (userId, callback) {
  User.findOne({_id : userId}, function (err, user) {
    if (err) return callback(err, null);
    if (!user) return callback(new Error('No user found'), null);
    exports.getCoursesWithStatus(userId, {students : userId}, 0, 0, function (err, courses) {
      if (err) return callback(err, null);
      user.courses = courses;
      exports.getPosts(userId, function (err, posts) {
        if (err) return callback(err, null);
        user.posts = posts;
        callback(null, user);
      })
    });
  });
}