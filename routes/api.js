/*
 * API routes
 */
var db = require('../lib/db');

/*
 *  JSON for users feed
 *      Type : GET
 */
exports.feed = function(req, res){
  db.getFeed(req.user._id, function (err, posts) {
    res.json(posts);
  });
};

/*
 *  JSON for course feed
 *      Type : GET
 */
exports.courseFeed = function(req, res){
  db.getCourseFeed(req.params.id, function (err, posts) {
    res.json(posts);
  });
};