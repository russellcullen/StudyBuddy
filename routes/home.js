/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Study Buddy'});
};

exports.login = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.home = function(req, res){
  res.render('home', { title: 'Home'});
};