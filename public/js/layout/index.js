/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

    Matcher = require('../flex-node').Matcher,
    Router = require('../router.js'),

    Constants = require('../constants.js'),
    
    HomeLayout = require('./home.js'),
    CourseLayout = require('./course.js'),
    ExamLayout = require('./exam.js'),
    ErrorPage = require('./404.js'),

    render = function() {
        var matcher = Matcher.createPatternMatcher(Router.path());

        matcher.config({ allowPartialMatch: false });

        matcher.forCase("/", function (argMap) {
            React.render(React.createFactory(HomeLayout.Root)(argMap),
                         document.getElementsByTagName('body')[0]);
            return true;
        });

        matcher.forCase("/course/<courseId>", function (argMap) {
            React.render(React.createFactory(CourseLayout.Root)(argMap),
                         document.getElementsByTagName('body')[0]);     
            return true;      
        });

        matcher.forCase("/course/<courseId>/exam/<examId>", function (argMap) {
            React.render(React.createFactory(CourseLayout.Root)(argMap),
                         document.getElementsByTagName('body')[0]);
            return true;
        });

        matcher.forCase("/course/<courseId>/exam/<examId>/take", function (argMap) {
            React.render(React.createFactory(ExamLayout.Root)(argMap),
                         document.getElementsByTagName('body')[0]);
            return true;
        });

        if (!matcher.resolve()) {
            React.render(React.createFactory(ErrorPage.Root)(),
                        document.getElementsByTagName('body')[0]);
        }

    },


    /**
     * Called when the page is first loaded.
     *
     * @static
     * @private
     * @method _onLoad
     */
    onLoad = function(event) {
        render();
    },

    onInvalidLoad = function (event) {
        React.render(React.createFactory(ErrorPage.Root)(),
                     document.getElementsByTagName('body')[0]);
    },

    /**
     * Setup the routing for the application.
     *
     * @method addRouting
     * @private
     */
    addRouting = function () {
        Router.registerRoute("/", Constants.Action.LOAD_HOME);
        Router.registerRoute("/course/<courseId>", Constants.Action.LOAD_COURSE);
        Router.registerRoute("/course/<courseId>/exam/<_>", Constants.Action.LOAD_COURSE);
        Router.registerRoute("/course/<courseId>/exam/<examId>/take", Constants.Action.LOAD_EXAM_RUN);

        Router.registerDefaultRoute(Constants.Action.LOAD_NOT_FOUND);

    },


    /**
     * Setup the error handling for any errors
     * that are propogated through the router.
     */
    addErrorHandling = function () {

        Router.registerError(Constants.ErrorType.NO_USER_CREDENTIALS, function () {
            console.log("No user credentials.");
        });

        Router.registerError(Constants.ErrorType.INVALID_EXAM_RUN, Router.ErrorOperation.pageNotFound);

        Router.registerDefaultError(function () {
            console.log("Default error.");
        });

    };


module.exports = {

    register: function () {
        Router.config({ location: window.location });
        Router.on(Constants.Event.LOADED_PAGE, onLoad);
        Router.on(Constants.Event.PAGE_NOT_FOUND, onInvalidLoad);

        addRouting();
        addErrorHandling();

        Router.watch({ initialLoad: true });
    }

};





