var auth = require('../lib/auth');
var home = require('./home');

/*
 * Sets all the routes
 *   Params: app
 */
exports.setRoutes = function(app) {
  app.get('/', home.index);
    
  app.get('/login', home.login);
  app.get('/home', auth.requireLogin, home.home);
};