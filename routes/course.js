/*
 *  Routes related to courses
 */
var async = require('async');
var models = require('../lib/models');
var Course = models.Course;
var Status = models.Status;

/*
 * Create courses page.
 *    Type : GET
 */
exports.create = function(req, res){
  res.render('create-course', { title: 'Create Course'});
};

/*
 * Create courses route.
 *    Type : POST
 */
exports.save = function(req, res){
  var course = new Course({
    name: req.body.title,
    desc: req.body.desc,
    public: req.body.privacy,
    students: [req.user._id]
  });
  course.save(function (err) {
    if (err) return next(err); // Bubble error up
    var status = new Status({
      course: course._id,
      user: req.user._id,
      status: req.body.status
    });
    status.save(function (err) {
      res.redirect('/my-courses');
    });
  });
}

/*
 * Join courses route.
 *    Type : POST
 */
exports.join = function(req, res){
  Course.findOne({ '_id' : req.body.courseId}, function (err, course) {
    course.addStudent(req.user._id, function (err) {
      if (err) return next(err);
      var status = new Status({
        course: course._id,
        user: req.user._id,
      });
      status.save(function (err) {
        res.redirect('/my-courses');
      });
    });
  });
}

/*
 * Course listing page.
 *    Type : GET
 */
exports.public = function(req, res){
  var page = req.query.page || 0;
  Course.find({public : true}, null, {limit : 20, skip : page*20}, function (err, courses){
    if (err) return next(err);
    async.map(courses, function (course, cb) {
      if (!req.loggedIn) return cb(err, course);
      Status.findOne({'course' : course._id, 'user' : req.user._id}, function (err, status) {
        if (status) course.status = status.status;
        cb(err, course);
      });
    }, function (err, courses) {
      res.render('courses', { title: 'Courses', courses: courses});
    });
  });
}