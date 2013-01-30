/*
 *  Routes related to courses
 */
var models = require('../lib/models');
var db = require('../lib/db');
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
exports.save = function(req, res, next){
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
exports.join = function(req, res, next){
  db.joinCourse(req.body.courseId, req.user._id, function (err) {
    res.redirect('/my-courses');
  });
}

/*
 * Course listing page.
 *    Type : GET
 */
exports.public = function(req, res, next){
  var page = req.query.page || 0;
  db.getCoursesWithStatus(req.user ? req.user._id : null, {public : true}, 20, page*20, function (err, courses) {
    res.render('courses', { title: 'Courses', courses: courses});
  });
}