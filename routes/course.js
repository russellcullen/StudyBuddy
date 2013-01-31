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
  db.getCoursesWithStatus(req.loggedIn ? req.user._id : null, {public : true}, 20, page*20, function (err, courses) {
    if (err) return next(err);
    res.render('courses', { title: 'Courses', courses: courses});
  });
}

/*
 * Course page
 *    Type : GET
 */
exports.page = function(req, res, next){
  var id = req.params.id;
  db.getCourse(id, req.loggedIn ? req.user._id : null, function (err, course) {
    if (err) return next(err);
    if (!course) return res.redirect('/courses');
    res.render('course', { title: course.name, course: course});
  });
}

/*
 * Update status endpoint
 *    Type : POST
 */
exports.changeStatus = function(req, res, next){
  db.updateStatus(req.params.id, req.user._id, req.body.status, function (err) {
    if (err) return next(err);
    res.redirect('back');
  });
}

/*
 * Create message page
 *    Type : GET
 */
exports.broadcast = function(req, res, next){
  var id = req.params.id;
  db.getCourse(id, req.loggedIn ? req.user._id : null, function (err, course) {
    if (err) return next(err);
    if (!course) return res.redirect('/courses');
    res.render('create-broadcast', { title: course.name, course: course});
  });
}

/*
 * Send message page
 *    Type : POST
 */
exports.sendBroadcast = function(req, res, next){
  db.sendBroadcast(req.user._id, req.body.id, req.body.msg, function (err) {
    if (err) return next(err);
    res.redirect('/home');
  });
}