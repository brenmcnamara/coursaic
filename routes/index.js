
/*
 * GET home page.
 */

exports.root = function(req, res) {
    res.redirect('/home');
};


exports.index = function(req, res) {
  res.render('index');
};


exports.course = function(req, res) {
    res.render('course');
};