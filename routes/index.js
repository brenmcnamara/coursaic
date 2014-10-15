
/*
 * GET home page.
 */

exports.root = function(req, res) {
    res.redirect('/home/default');
};


exports.index = function(req, res) {
    console.log(JSON.stringify(req.params));
    res.render('index');
};


exports.course = function(req, res) {
    res.render('course');
};