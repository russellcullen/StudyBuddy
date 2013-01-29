/*
 *  Routes related to courses
 */
var models = require('../lib/models');
var Course = models.Course;

/*
 * GET for creating course
 */ 
exports.create = function(req, res){
  res.render('create-course', { title: 'Create Course'});
};

/*
 * POST for creating course
 */
exports.save = function(req, res){
  var course = new Course({
    name: req.body.title,
    desc: req.body.desc,
    public: req.body.privacy,
    students: [req.user._id]
  });
  course.save(function(err) {
    if (err) return next(err); // Bubble error up
    res.redirect('/my-courses');
  });
}

/*
 * POST for joining course
 */
exports.join = function(req, res){
  Course.findOne({ '_id' : req.body.courseId}, function (err, course) {
    course.addStudent(req.user._id, function (err) {
      if (err) return next(err);
      res.redirect('/my-courses');
    });
  });
}

/*
 * GET show all courses
 */
exports.public = function(req, res){
  var page = req.query.page || 0;
  Course.find({public : true}, null, {limit : 20, skip : page*20}, function (err, courses){
    if (err) return next(err);
    res.render('courses', { title: 'Courses', courses: courses});
  });
}