var express = require('express');
var router = express.Router();
var configObj;
var config = function (inputMap) {
  configObj = inputMap;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', configObj);
});

module.exports = {config, router};
