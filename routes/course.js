/*
 *  Routes related to courses
 */
var db = require('../lib/db');

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
  db.createCourse(req.body, req.user._id, function (err) {
    if (err) return next(err);
    res.redirect('/my-courses');
  });
}

/*
 * Join courses route.
 *    Type : POST
 */
exports.join = function(req, res, next){
  db.joinCourse(req.body.courseId, req.user._id, function (err) {
    if (err) return next(err);
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
    if (err) return next(err);
    res.render('courses', { title: 'Courses', courses: courses});
  });
}