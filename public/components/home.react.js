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
     * Root_Home
     *
     * The root element for the home page. All other
     * elements on the home page will exist inside
     * this element.
     */
    Home_Root = React.createClass({

        render: function() {
            console.log("Rendering home root");
            // TODO: How can I avoid writing
            // all the html twice?
            var school = Stores.UserStore().current().get('school');
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_COURSE) {
                console.log("Case 1");
                return (
                    <div className="main">
                        <PopupsLayout.Popup_Create_Course />
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.Header_Fill isOpaque={ true } />
                        <Home_Img />
                        <Home_Content />
                    </div>
                );        
            }
            else {
                console.log("Case 2");
                return (
                    <div className="main">
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.Header_Fill isOpaque={ true } />
                        <Home_Img />
                        <Home_Content />
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
     * Home_Img
     *
     * The decorative image on the home
     * page.
     */
    Home_Img = React.createClass({
        
        render: function() {
            return (
                <div className="home-image"></div>
            );
        }


    }),


    /**
     * Search
     *
     * The search bar for looking up courses.
     */
    Search = React.createClass({
        
        render: function() {
            var searchText = "Search for " + this.props.alias + " classes...";
            return (
                <div className="home-search">
                    <div className="search">
                        <input type="text"
                               placeholder={searchText}
                               className="search__input" />

                        <img className="search__submit" src="/img/icons/search.png" />
                    </div>
                </div>
            );
        }


    }),


    /**
     * Home_Content
     *
     * All the major content on the
     * home page, including side navigation
     * and courses to lookup.
     */
    Home_Content = React.createClass({

        render: function() {
            return (
                <div className="home-content content">
                    <Home_SideNav />
                    <Home_Body />
                </div>
            );
        }


    }),


    /**
     * Home_SideNav
     *
     * The Side Navigation on the home
     * page.
     */
    Home_SideNav = React.createClass({

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
     * Home_Body
     *
     * The central markup inside the content
     * tag, displayed on the home page.
     */
    Home_Body = React.createClass({

        render: function() {
            return (
                <div className="home-content__courses">
                    <WidgetsLayout.CourseGrid />
                </div>
            );
        }

        
    });


exports.HomeLayout = {
    Home_Root: Home_Root
};
