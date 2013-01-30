/*
 * User related routes.
 */
var db = require("../lib/db");

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
exports.courses = function(req, res, next){
  db.getCoursesWithStatus(req.user._id, { students : req.user._id }, 0, 0, function (err, courses) {
    if (err) return next(err);
    res.render('courses', { title: 'My Courses', courses: courses});
  });
};