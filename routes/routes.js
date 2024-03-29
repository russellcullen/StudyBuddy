var auth = require('../lib/auth');
var main = require('./main');
var user = require('./user');
var course = require('./course');
var api = require('./api');

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
  app.get('/user/:id', user.profile);

  // Course pages
  app.get('/courses', course.public);
  app.get('/create-course', auth.requireLogin, course.create);
  app.post('/create-course', auth.requireLogin, course.save);
  app.post('/join-course', auth.requireLogin, course.join);
  app.get('/course/:id', course.page);
  app.post('/course/:id/change-status', auth.requireLogin, course.changeStatus);
  app.get('/course/:id/broadcast', auth.requireLogin, course.createBroadcast);
  app.post('/send-broadcast', auth.requireLogin, course.sendBroadcast);
  app.post('/remove-post', auth.requireLogin, course.removePost);

  // API
  app.get('/api/feed', auth.privateAPI, auth.requireLogin, api.feed);
  app.get('/api/course-feed/:id', auth.privateAPI, api.courseFeed);
};

/*
 * 404 page for everything else
 */
exports.pageNotFound = function (req, res) {
  res.status(404).render('404', {title : '404'});
}