/*
 * util.js
 *   Util functions
 */

/* 
 * Middleware to get the req.flash() functionality int express 3.x
 */ 
exports.flashMiddleware = function(req, res, next) {
  res.locals.messages = req.flash('info');
  res.locals.errors = req.flash('error');
  return next();
}

/* 
 * Middleware for misc things.
 */ 
exports.userMiddleware = function(req, res, next) {
    res.locals.user = req.user;
    return next();
}

