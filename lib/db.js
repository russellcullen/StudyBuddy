/*
 * db.js
 *   Database wrappers
 */
var async = require('async');
var models = require('./models');
var Course = models.Course;
var Status = models.Status;

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
 * DB wrapper for getting courses, with current users status. 
 *    Takes userId, db query to perform on courses, and optional limit and skip params for db call. 
 */
exports.getCoursesWithStatus = function (userId, query, limit, skip, callback) {
  Course.find(query, null, {limit : limit, skip : skip}, function (err, courses){
    if (err) return callback(err, null);
    if (!userId) return callback(null, courses);
    async.map(courses, function (course, cb) {
      Status.findOne({'course' : course._id, 'user' : userId}, function (err, status) {
        if (status) course.status = status.status;
        cb(err, course);
      });
    }, callback);
  });
}