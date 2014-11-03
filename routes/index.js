
/*
 * GET home page.
 */

exports.index = function(req, res) {
    console.log(JSON.stringify(req.params));
    res.render('index');
};


exports.course = function(req, res) {
    res.render('course');
};