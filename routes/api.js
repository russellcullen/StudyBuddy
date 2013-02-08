/*
 * API routes
 */
var db = require('../lib/db');

/*
 *  JSON for users feed
 *      Type : GET
 */
exports.feed = function(req, res, next){
  db.getFeed(req.user._id, function (err, posts) {
    if (err) return next(err);
    res.json(posts);
  });
};

/*
 *  JSON for course feed
 *      Type : GET
 */
exports.courseFeed = function(req, res, next){
  db.getCourseFeed(req.params.id, function (err, posts) {
    if (err) return next(err);
    res.json(posts);
  });
};