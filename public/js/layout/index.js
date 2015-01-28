/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

    Matcher = require('shore').Matcher,
    Router = require('shore').Router,

    Constants = require('../constants.js'),
    
    splashLayout = require('./splash.js'),
    homeLayout = require('./home.js'),
    courseLayout = require('./course.js'),
    examLayout = require('./exam.js'),
    notifyLayout = require('./notify.js'),
    resultLayout = require('./result.js');

module.exports = {

    splashLayout: splashLayout,

    homeLayout: homeLayout,

    courseLayout: courseLayout,

    examLayout: examLayout,

    notifyLayout: notifyLayout,

    resultLayout: resultLayout

};





