/*
 * auth.js
 *   Auth functions
 */
var models = require('./models');
var User = models.User;

/*
 * Finds a user by Id,
 *   enables the use of req.user thanks to everyauth
 */
exports.findUserById = function (userId, callback) {
    User.findById(userId, function(err, user){
        callback(err, user);
    });
}

exports.fbLogin = function (session, accessToken, accessTokExtra, fbUserMetadata) {
	var promise = this.Promise();
    User.findOne({fbid : fbUserMetadata.id}, function (err, user) {
      if (!user) {
        user = new User({name : fbUserMetadata.name, fbid: fbUserMetadata.id});
        user.save();
      }
      promise.fulfill(user);
    });
    return promise;
}