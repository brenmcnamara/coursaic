/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

    Router = require('../router.js'),
    CAEvent = require('../Event.js').CAEvent,

    Action = require('../Action.js').Action,
    
    HomeLayout = require('./home.js'),
    CourseLayout = require('./course.js'),
    ExamLayout = require('./exam.js'),

    render = function(key, params) {
        unmountRoot();
        switch (key) {
            case 'home':
                React.render(React.createFactory(HomeLayout.Root)(params),
                             document.getElementsByTagName('body')[0]);
                break;
            case 'course':
                React.render(React.createFactory(CourseLayout.Root)(params),
                             document.getElementsByTagName('body')[0]);
                break;
            case 'exam':
                React.render(React.createFactory(ExamLayout.Root)(params),
                             document.getElementsByTagName('body')[0]);
                break;
            default:
                console.error("Unrecognized page key " + key);
                throw new Error("Trying to render page with unrecognized key " + key);
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
        switch (Stores.ConfigStore().pageKey()) {
        case 'course':
            render('course', { courseId: Stores.ConfigStore().courseId() });
            break;
        default:
            render(Stores.ConfigStore().pageKey());
        }
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





