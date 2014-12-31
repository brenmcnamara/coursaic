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
            console.error("Unrecognized path: " + Router.path());
            throw new Error("Trying to render unrecognized path: " + Router.path());
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
     *  Setup the routing for the application.
     *
     * @method routing
     * @private
     */
    routing = function () {
        Router.addRoute("/", Action.Name.LOAD_HOME);
        // TODO: Change course to courseId.
        Router.addRoute("/course/<course>", Action.Name.LOAD_COURSE);
        Router.addRoute("/course/<course>/exam/<_>", Action.Name.LOAD_COURSE);
        Router.addRoute("/course/<course>/exam/<examId>/take", Action.Name.LOAD_EXAM_RUN);
    };


module.exports = {

    register: function () {
        Router.config({ location: window.location });
        routing();
        Router.watch({ initialLoad: true });
        Stores.PageStore().on(CAEvent.Name.LOADED_PAGE, onLoad);

    }

};





