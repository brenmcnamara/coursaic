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

                    <section className="pure-u-1 course-section">
                        <h2 className="course-section__header">My Courses</h2>
                        <div className="divide"></div>
                        
                        <div className="course-section__empty">
                            There are no courses here yet.
                        </div>
                    </section>

                    <section className="pure-u-1 course-section">
                        <h2 className="course-section__header">Popular Courses</h2>
                        <div className="divide"></div>
                        
                        <div className="pure-g course-section__grid">
                            
                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 101</header>
                                    <div className="course-box__content__body">
                                        Learn the basics of programming and algorithm design.
                                        Understand the basics of the Java programming language
                                        to create simple software with simple applications.
                                    </div>
                                    <footer className="course-box__content__tags">
                                        <ul>
                                            <li style={ { backgroundColor: "#e93a0a", color: "white"} } >
                                                Java
                                            </li>
                                            <li style={ { backgroundColor: "#087a34", color: "white"} } >
                                                Vanderbilt
                                            </li>
                                            <li style={ { backgroundColor: "#e25a58", color: "white"} } >
                                                Computer Science
                                            </li>
                                        </ul>
                                    </footer>
                                </div>
                            </div>

                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 101</header>
                                    <div className="course-box__content__body">
                                        Here is the description for the course.
                                    </div>
                                    <footer className="course-box__content__tags">
                                        <ul>
                                            <li style={ { backgroundColor: "#087a34", color: "white"} } >
                                                Vanderbilt
                                            </li>
                                        </ul>
                                    </footer>
                                </div>
                            </div>

                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">CS 201</header>
                                    <div className="course-box__content__body">
                                        An introduction to abstract data structures and their
                                        importance as a foundation to modern software
                                        development. Create different data structures in C++.
                                    </div>
                                    <footer className="course-box__content__tags">
                                        <ul>
                                            <li style={ { backgroundColor: "#2878b2", color: "white"} } >
                                                C++
                                            </li>
                                            <li style={ { backgroundColor: "#087a34", color: "white"} } >
                                                Vanderbilt
                                            </li>
                                            <li style={ { backgroundColor: "#e25a58", color: "white"} } >
                                                Computer Science
                                            </li>
                                        </ul>
                                    </footer>
                                </div>
                            </div>

                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">MATH 246</header>
                                    <div className="course-box__content__body">
                                        Here is the description for the course.
                                    </div>
                                    <footer className="course-box__content__tags">
                                        <ul>
                                            <li style={ { backgroundColor: "#087a34", color: "white"} } >
                                                Vanderbilt
                                            </li>
                                            <li style={ { backgroundColor: "#e25a58", color: "white"} } >
                                                Computer Science
                                            </li>
                                        </ul>
                                    </footer>
                                </div>
                            </div>

                            <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box">
                                <div className="course-box__content">
                                    <header className="course-box__content__header">BSCI 110A</header>
                                    <div className="course-box__content__body">
                                        Here is the description for the course.
                                    </div>
                                    <footer className="course-box__content__tags">
                                        <ul>
                                            <li style={ { backgroundColor: "#e25a58", color: "white"} } >
                                                Computer Science
                                            </li>
                                        </ul>
                                    </footer>
                                </div>
                            </div>
                            
                        </div>

                    </section>
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
