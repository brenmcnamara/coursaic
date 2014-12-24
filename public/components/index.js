/** @jsx React.DOM */

var React = require('react'),
    
    PageStore = require('../js/Stores/PageStore.js'),
    ConfigStore = require('../js/Stores/ConfigStore'),

    HomeLayout = require('./home.react.js').HomeLayout,
    CourseLayout = require('./course.react.js').CourseLayout,
    ExamLayout = require('./exam.react.js').ExamLayout,

    render = function(key, params) {
        unmountRoot();
        switch (key) {
            case 'home':
                React.render(React.createFactory(HomeLayout.Home_Root)(params),
                             document.getElementsByTagName('body')[0]);
                break;
            case 'course':
                React.render(React.createFactory(CourseLayout.Course_Root)(params),
                             document.getElementsByTagName('body')[0]);
                break;
            case 'exam':
                React.render(React.createFactory(ExamLayout.Exam_Root)(params),
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
        switch (ConfigStore.pageKey()) {
        case 'course':
            render('course', { courseId: ConfigStore.courseId() });
            break;
        default:
            render(ConfigStore.pageKey());
        }
    };


module.exports = {

    loadOnEvent: function (event) {
        PageStore.addListener(event, onLoad);
    }
};





