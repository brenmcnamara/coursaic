/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

    Path = require('../path.js'),
    Router = require('../router.js'),
    CAEvent = require('../Event.js').CAEvent,

    Action = require('../Action.js').Action,
    
    HomeLayout = require('./home.js'),
    CourseLayout = require('./course.js'),
    ExamLayout = require('./exam.js'),
    ErrorPage = require('./404.js'),

    render = function() {
        var matcher = Path.createPatternMatcher(Router.path());

        unmountRoot();

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
     * Unmount the root element
     *
     * @method _unmountRoot
     * @private
     *
     * @return {Boolean} true if an element was
     * unmounted, false otherwise.
     */
    unmountRoot = function() {
        var result;
        try {
            result = React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
        return result;
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

    /**
     * Setup the routing for the application.
     *
     * @method addRouting
     * @private
     */
    addRouting = function () {
        Router.addRoute("/", Action.Name.LOAD_HOME);
        // TODO: Change course to courseId.
        Router.addRoute("/course/<courseId>", Action.Name.LOAD_COURSE);
        Router.addRoute("/course/<courseId>/exam/<_>", Action.Name.LOAD_COURSE);
        Router.addRoute("/course/<courseId>/exam/<examId>/take", Action.Name.LOAD_EXAM_RUN);

        Router.addDefaultRoute(Action.Name.LOAD_NOT_FOUND);

    };


module.exports = {

    register: function () {
        Router.config({ location: window.location });
        Router.on(CAEvent.Name.LOADED_PAGE, onLoad);
        Router.on(CAEvent.Name.PAGE_NOT_FOUND, onLoad);

        addRouting();
        Router.watch({ initialLoad: true });
    }

};





