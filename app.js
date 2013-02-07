
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes')
  , http = require('http')
  , path = require('path')
  , auth = require('./lib/auth')
  , util = require('./lib/util')
  , mongoose = require('mongoose')
  , flash = require('connect-flash')
  , everyauth = require('everyauth')
  , conf = require('./conf');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/studybuddy');

everyauth.everymodule.findUserById(auth.findUserById)

everyauth.facebook
  .appId(conf.fbAppId)
  .appSecret(conf.fbAppSecret)
  .scope('email')
  .findOrCreateUser(auth.fbLogin)
  .sendResponse( function (res, data) {
    var session = data.session;
    var redirectTo = session.redirectTo;
    delete session.redirectTo;
    res.redirect(redirectTo || 'back');
  });

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'russell'}));
  app.use(flash());
  app.use(util.flashMiddleware);
  app.use(everyauth.middleware(app));
  app.use(util.userMiddleware);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes.setRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
