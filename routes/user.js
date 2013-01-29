/*
 * User related routes.
 */
var models = require('../lib/models');
var Course = models.Course;

exports.home = function(req, res){
  res.render('home', { title: 'Home'});
};

exports.courses = function(req, res){
  Course.find({ students : req.user._id }, function (err, courses) {
    if (err) return next(err);
    res.render('courses', { title : 'My Courses', courses : courses });
  });
};