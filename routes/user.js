/*
 * User related routes.
 */
var async = require('async');
var models = require('../lib/models');
var Course = models.Course;
var Status = models.Status;

/*
 * User home page.
 *    Type : GET
 */
exports.home = function(req, res){
  res.render('home', { title: 'Home'});
};

/*
 * User courses page.
 *    Type : GET
 */
exports.courses = function(req, res){
  Course.find({ students : req.user._id }, function (err, courses) {
    if (err) return next(err);
    async.map(courses, function (course, cb) {
      Status.findOne({'course' : course._id, 'user' : req.user._id}, function (err, status) {
        course.status = status.status;
        cb(err, course);
      });
    }, function (err, courses) {
      res.render('courses', { title : 'My Courses', courses : courses });
    });
  });
};