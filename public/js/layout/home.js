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

    Dashboard = WidgetsLayout.Dashboard,

    SectionSet = WidgetsLayout.SectionSet,

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
            var menu = [
                (<a href="#">Logout</a>)
            ];

            return (
                <div className="main">
                    <HeaderLayout.Header menu={ menu } />
                    <div className="content-wrapper">
                        <HomeDashboard />
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


    HomeDashboard = React.createClass({

        render: function () {
            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>Welcome, Brendan!</Dashboard.Summary.Header>
                    </Dashboard.Summary>
                </Dashboard>
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
                <SectionSet>
                    <SectionSet.Section>
                        <SectionSet.Section.Header>My Courses</SectionSet.Section.Header>
                        <div className="divide"></div>
                        
                        <div className="section__empty">
                            There are no courses here yet.
                        </div>
                    </SectionSet.Section>

                    <SectionSet.Section>
                        <SectionSet.Section.Header>Popular Courses</SectionSet.Section.Header>
                        <div className="divide"></div>
                        
                        <div className="pure-g section__course-grid">
                            
                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 101</header>
                                    <div className="course-box__content__body">
                                        <div>
                                            Learn the basics of programming and algorithm design.
                                            Understand the basics of the Java programming language
                                            to create simple software with simple applications.
                                        </div>
                                        <div className="tag-list">
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e93a0a", color: "white"} }>
                                                 Java
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#087a34", color: "white"} }>
                                                 Vanderbilt
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e25a58", color: "white"} }>
                                                 Computer Science
                                            </div>
                                        </div>
                                    </div>
                                    <footer className="course-box__content__footer">
                                        10 enrolled
                                    </footer>
                                </div>
                            </div>


                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 101</header>
                                    <div className="course-box__content__body">
                                        <div>
                                            Learn the basics of programming and algorithm design.
                                            Understand the basics of the Java programming language
                                            to create simple software with simple applications.
                                        </div>
                                        <div className="tag-list">
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e93a0a", color: "white"} }>
                                                 Java
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#087a34", color: "white"} }>
                                                 Vanderbilt
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e25a58", color: "white"} }>
                                                 Computer Science
                                            </div>
                                        </div>
                                    </div>
                                    <footer className="course-box__content__footer">
                                        10 enrolled
                                    </footer>
                                </div>
                            </div>
                            
                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 101</header>
                                    <div className="course-box__content__body">
                                        <div>
                                            Learn the basics of programming and algorithm design.
                                            Understand the basics of the Java programming language
                                            to create simple software with simple applications.
                                        </div>
                                        <div className="tag-list">
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e93a0a", color: "white"} }>
                                                 Java
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#087a34", color: "white"} }>
                                                 Vanderbilt
                                            </div>
                                            <div className="tag tag-list__item"
                                                 style={ { backgroundColor: "#e25a58", color: "white"} }>
                                                 Computer Science
                                            </div>
                                        </div>
                                    </div>
                                    <footer className="course-box__content__footer">
                                        10 enrolled
                                    </footer>
                                </div>
                            </div>
                            
                        </div>

                    </SectionSet.Section>
                </SectionSet>

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
