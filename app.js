
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , auth = require('./lib/auth')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth');


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/studybuddy');


everyauth.everymodule.findUserById(auth.findUserById)

everyauth.facebook
  .appId("121513184688795")
  .appSecret("3ddb937b0b0bd28c7900a17b66930819")
  .popup(true)
  .findOrCreateUser(auth.fbLogin)
  .redirectPath('/login');

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
  app.use(everyauth.middleware(app));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
