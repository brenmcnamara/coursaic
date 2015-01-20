/** @jsx React.DOM */

/**
 * home.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

var React = require('react'),
    
    WidgetsLayout = require('./widgets.js'),
    PopupsLayout = require('./popups.js'),
    HeaderLayout = require('./header.js'),

    Stores = require('../stores'),

    Router = require('shore').Router,
    Action = require('shore').Action,
    Constants = require('../constants.js'),

    Formatter = require('../formatter.js'),

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
            return (
                <div className="main">
                    <HeaderLayout.Header />
                    <div className="content-wrapper">
                        <Dashboard />
                        <Content />
                    </div>

                </div>
            );
        },


        changedMode: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
        }


    }),


    Dashboard = React.createClass({

        render: function () {
            return (
                <div className="dashboard"></div>
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
                <div className="pure-g course-section-wrapper">
                    <div className="pure-u-1 course-section">
                        <h2 className="course-section__header">My Courses</h2>
                        <div className="divide"></div>
                        <div className="pure-g course-section__grid"></div>
                    </div>

                    <div className="pure-u-1 course-section">
                        <h2 className="course-section__header">Popular Courses</h2>
                        <div className="divide"></div>
                        <div className="course-section__empty">
                            There are no courses here yet.
                        </div>
                    </div>
                </div>
            );
        }


    }),




    /**
     * A box containing basic information of a course.
     * The box is clickable, transition to a page with all
     * data relevant to the course.
     *
     * @module Layout
     * @submodule Home
     * @class CourseBox
     * @private
     */
    CourseBox = React.createClass({
        
        render: function() {
            var course = this.props.course,
                enrollMessage = course.enrollCount() + ' enrolled';
            return (
                <div onClick= { this.handleClick }
                     className="home-content__courses__grid__course course-info">

                    <header className="course-info__header">
                        { course.get('code') }
                    </header>
                    <div className="course-info__body">
                        <div className="course-info__body__text">
                            { Formatter.Text.truncate(course.get('description'), { maxlen: 75 }) }
                        </div>
                    </div>
                    <footer className="course-info__footer">{ enrollMessage }</footer>
                </div>
            );
        },


        handleClick: function(event) {
            Router.path("/course/<courseId>", { courseId: this.props.course.id });
        }


    });


module.exports = {
    Root: Root
};
