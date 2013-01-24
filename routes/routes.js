var auth = require('../lib/auth');
var main = require('./main');
var user = require('./user');
var course = require('./course');

/*
 * Sets all the routes
 *   Params: app
 */
exports.setRoutes = function(app) {
  // Main pages
  app.get('/', main.index);
  app.get('/login', main.login);

  // User pages
  app.get('/home', auth.requireLogin, user.home);
  app.get('/my-courses', auth.requireLogin, user.courses);

  // Course pages
  app.get('/courses', course.public);
  app.get('/create-course', auth.requireLogin, course.create);
  app.post('/create-course', auth.requireLogin, course.save);
};