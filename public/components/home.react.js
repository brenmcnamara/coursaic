/** @jsx React.DOM */

/**
 * home.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

var React = require('react'),
    
    WidgetsLayout = require('./widgets.react.js').WidgetsLayout,
    PopupsLayout = require('./popups.react.js').PopupsLayout,
    HeaderLayout = require('./header.react.js').HeaderLayout,

    Stores = require('../js/Stores'),

    Action = require('../js/Action.js').Action,
    CAEvent = require('../js/Event.js').CAEvent,

    /**
     * The root element for the home page. All other
     * elements on the home page will exist inside
     * this element.
     *
     * @module Layout
     * @submodule Home
     * @class Root
     */
    Root = React.createClass({

        render: function() {
            // TODO: How can I avoid writing
            // all the html twice?
            var school = Stores.UserStore().current().get('school');
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_COURSE) {
                return (
                    <div className="main">
                        <PopupsLayout.Popup_Create_Course />
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.Header_Fill isOpaque={ true } />
                        <Home_Img />
                        <Content />
                    </div>
                );        
            }
            else {
                return (
                    <div className="main">
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.Header_Fill isOpaque={ true } />
                        <Home_Img />
                        <Content />
                    </div>
                );
            }
        },


        changedMode: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }


    }),


    /**
     * The decorative image on the home
     * page.
     *
     * @module Layout
     * @submodule Home
     * @class Home_Img
     */
    Home_Img = React.createClass({
        
        render: function() {
            return (
                <div className="home-image"></div>
            );
        }


    }),


    /**
     * All the major content on the
     * home page, including side navigation
     * and courses to lookup.
     *
     * @module Layout
     * @submodule Home
     * @class Content
     */
    Content = React.createClass({

        render: function() {
            return (
                <div className="home-content content">
                    <Navigation />
                    <Body />
                </div>
            );
        }


    }),


    /**
     * The navigation element on the home page.
     *
     * @module Layout
     * @submodule Home
     * @class Navigation
     * @private
     */
    Navigation = React.createClass({

        render: function() {
            var enrolled = Stores.CourseStore().coursesForUser(Stores.UserStore().current()) || [];
            return (
                <div className="content__nav">
                    <WidgetsLayout.MainOptions />
                    <WidgetsLayout.Divide />
                    <WidgetsLayout.MyCourses enrolled={enrolled} />
                </div>
            );
        },


        componentWillMount: function() {
            Stores.CourseStore().addListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
            Stores.CourseStore().addListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.CourseStore().removeListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
            Stores.CourseStore().removeListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
        },


        onChange: function() {
            this.forceUpdate();
        }

    }),


    /**
     * The central markup inside the content
     * tag, displayed on the home page.
     *
     * @module Layout
     * @submodule Home
     * @class Body
     * @private
     */
    Body = React.createClass({

        render: function() {
            return (
                <div className="home-content__courses">
                    <WidgetsLayout.CourseGrid />
                </div>
            );
        }

        
    });


module.exports = {
    Root: Root
};
