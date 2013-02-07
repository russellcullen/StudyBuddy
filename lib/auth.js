/*
 * auth.js
 *   Auth functions
 */
var everyauth = require('everyauth');
var gravatar = require('gravatar');
var models = require('./models');
var User = models.User;

/*
 * Middleware for pages that require login
 */
exports.requireLogin  = function(req, res, next) {
  if (req.loggedIn) {
    return next();
  }
  req.flash('error', 'You Must Be Logged In To Do This!');
  if(req.url.indexOf("api") < 0) {
    req.session.redirectTo = req.url;
  }
  res.redirect(everyauth.facebook.entryPath());
}

/*
 * Finds a user by Id,
 *   enables the use of req.user thanks to everyauth
 */
exports.findUserById = function (userId, callback) {
  User.findById(userId, callback);
}

/*
 * Performs facebook login. Find or create user
 */
exports.fbLogin = function (session, accessToken, accessTokExtra, fbUserMetadata) {
  var promise = this.Promise();
  User.findOne({fbid : fbUserMetadata.id}, function (err, user) {
    if (!user) {
      user = new User({
        name: fbUserMetadata.name,
        fbid: fbUserMetadata.id,
        email: fbUserMetadata.email,
        gravatar: gravatar.url(fbUserMetadata.email, {d : 'mm'})
      });
      user.save();
    }
    promise.fulfill(user);
  });
  return promise;
}