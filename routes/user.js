/*
 * User related routes.
 */
var db = require("../lib/db");

/*
 * User home page.
 *    Type : GET
 */
exports.home = function(req, res){
  db.getFeed(req.user._id, function (err, posts) {
    res.render('home', { title: 'Home', posts: posts});
  });
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

/*
 * User profile page
 *    Type : GET
 */
exports.profile = function (req, res, next) {
  db.getUser(req.params.id, function (err, user) {
    if (err) return next(err);
    res.render('profile', {title : user.name, profile : user});
  })
}