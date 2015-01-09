/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

    Matcher = require('shore').Matcher,
    Router = require('shore').Router,

    Constants = require('../constants.js'),
    
    homeLayout = require('./home.js'),
    courseLayout = require('./course.js'),
    examLayout = require('./exam.js'),
    errorPage = require('./404.js');

module.exports = {

    homeLayout: homeLayout,

    courseLayout: courseLayout,

    examLayout: examLayout,

    errorPage: errorPage

};





