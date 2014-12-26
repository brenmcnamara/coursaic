/** @jsx React.DOM */

var React = require('react'),
    
    Stores = require('../stores'),

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
    };


module.exports = {

    loadOnEvent: function (event) {
        Stores.PageStore().on(event, onLoad);
    }
};





