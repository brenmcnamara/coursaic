/** @jsx React.DOM */

/**
 * widgets.react.js
 *
 * All elements that are supported across
 * different web pages.
 */

/*
 * Dependencies:
 *  - React
 *  - View namespace
 */

var React = require('react'),

    Stores = require('../js/Stores'),

    Action = require('../js/Action.js').Action,
    CAEvent = require('../js/Event.js').CAEvent,

    Formatter = require('../js/formatter.js'),

    /**
     * MainOption
     *
     * Main Options for the user to take, such as
     * creating a class or creating an exam.
     */
    MainOptions = React.createClass({
        
        render: function() {
            return (
                <ul className="main-options">
                    <MainOption_CreateCourse />
                </ul>
            );
        }


    }),


    MainOption_CreateCourse = React.createClass({
        
        render: function() {
            var createCourseStyle = {
                height: '30px',
                margin: '-15px 0 0 9px'
            };

            return (
                <li onClick={ this.didClick } className="main-options__item">

                    <img src="/img/icons/book.png"
                         style={ createCourseStyle }
                         className="main-options__item__icon--clickable" />
                    <div className="main-options__item__text--clickable">Create Course</div>
                </li>
            );
        },


        didClick: function(event) {
            Action.send(Action.Name.TO_MODE_CREATE_COURSE);
        }


    }),


    // TODO: Move this to home.react.js
    /**
     * MyCourses
     *
     * A list of all courses the user
     * is currently enrolled in. Serves
     * for quick, easy navigation to
     * these courses.
     */
    MyCourses = React.createClass({
   
        render: function() {
            // TODO: Shouldn't be getting the enrolled courses
            // from the parent, should generate them from this element making
            // a query.
            var courses = this.props.enrolled.map(function(course) {
                return <MyCourses_Course key={ course.id } course={ course } />
            });

            return (
                <section className="category my-courses">
                    <div className="category__title">My Courses</div>
                    <ul className="category__list">
                        { courses }
                    </ul>
                </section>
            );
        }

    }),


    MyCourses_Course = React.createClass({
        
        render: function() {
            var course = this.props.course;
            return (
                <li onClick={ this.handleClick }>{ course.get('code') }</li>
            );
        },


        handleClick: function(event) {
            Action.send(Action.Name.PERFORM_LOAD, {pageKey: 'course', course: this.props.course.id});
        }


    }),


    /**
     * Divide
     *
     * A divide element used to separate
     * components.
     */
    Divide = React.createClass({
        
        render: function() {
            return (
                <div className="divide"></div>
            );
        }

    }),


    Divide_Full = React.createClass({

        render: function() {
            return (
                <div className="divide--full"></div>
            );
        }


    }),


    // TODO: Move this to home page.
    /**
     * CourseGrid
     *
     * A grid of courses.
     */
    CourseGrid = React.createClass({

        render: function() {
            var courseList = Stores.CourseStore().map(function(course) {
                return <CourseInfo key={ course.id } course={ course } />;
            });
            return (
                <div className="course-grid">
                    {courseList}
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
     * CourseInfo
     *
     * The information for a course displayed
     * after a search.
     */
    CourseInfo = React.createClass({
        
        render: function() {
            var course = this.props.course,
                field = course.get('field'),
                courseHeaderStyle = {
                    background: field.get('color')
                },
                enrollMessage = course.enrollCount() + ' enrolled';
            // TODO: Separate out tags that are specific
            // to a page (i.e. home-content__course__grid__course).
            return (
                <div onClick= { this.handleClick }
                     className="home-content__courses__grid__course course-info">

                    <header className="course-info__header" style={ courseHeaderStyle }>
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
            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'course', course: this.props.course.id})
        }


    });


exports.WidgetsLayout = {

    MainOptions: MainOptions,
    MyCourses: MyCourses,
    CourseGrid: CourseGrid,
    Divide: Divide,
    Divide_Full: Divide_Full

};