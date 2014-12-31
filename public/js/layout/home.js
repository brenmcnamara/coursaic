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

    Router = require('../router.js'),
    Action = require('../Action.js').Action,
    CAEvent = require('../Event.js').CAEvent,

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
            // TODO: How can I avoid writing
            // all the html twice?
            var school = Stores.UserStore().current().get('school');
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_COURSE) {
                return (
                    <div className="main">
                        <PopupsLayout.CreateCourse />
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.HeaderFill isOpaque={ true } />
                        <Home_Img />
                        <Content />
                    </div>
                );        
            }
            else {
                return (
                    <div className="main">
                        <HeaderLayout.Header isOpaque={ true } />
                        <HeaderLayout.HeaderFill isOpaque={ true } />
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
            Stores.PageStore().on(CAEvent.Name.CHANGED_MODE, this.changedMode);
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
                    <MainOptions />
                    <WidgetsLayout.Divide />
                    <MyCoursesList enrolled={enrolled} />
                </div>
            );
        },


        componentWillMount: function() {
            Stores.CourseStore().on(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
            Stores.CourseStore().on(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
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
                    <CourseGrid />
                </div>
            );
        }

        
    }),


    /**
     * Main Options for the user to take, such as
     * creating a class or creating an exam.
     *
     * @module Layout
     * @submodule Home
     * @class MainOption
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


    /**
     * The create course option inside the main options list.
     *
     * @module Layout
     * @submodule Home
     * @class MainOption_CreateCourse
     */
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


    /**
     * A list of all courses the user
     * is currently enrolled in. Serves
     * for quick, easy navigation to
     * these courses.
     *
     * @module Layout
     * @submodule Home
     * @class MyCoursesList
     * @private
     */
    MyCoursesList = React.createClass({
   
        render: function() {
            // TODO: Shouldn't be getting the enrolled courses
            // from the parent, should generate them from this element making
            // a query.
            var courses = this.props.enrolled.map(function(course) {
                return <MyCoursesList_Course key={ course.id } course={ course } />
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


    /**
     * A course inside the  the list of MyCourses.
     *
     * @module Layout
     * @submodule Home
     * @class MyCoursesList_Course
     * @private
     */
    MyCoursesList_Course = React.createClass({
        
        render: function() {
            var course = this.props.course;
            return (
                <li onClick={ this.handleClick }>{ course.get('code') }</li>
            );
        },


        handleClick: function(event) {
            Router.path("/course/<courseId>", { courseId: this.props.course.id });
//            Action.send(Action.Name.PERFORM_LOAD, {pageKey: 'course', course: this.props.course.id});
        }


    }),


    /**
     * A grid of CourseBox objects.
     *
     * @module Layout
     * @submodule Home
     * @class CourseGrid
     * @private
     */
    CourseGrid = React.createClass({

        render: function() {
            var courseList = Stores.CourseStore().map(function(course) {
                return <CourseBox key={ course.id } course={ course } />;
            });
            return (
                <div className="course-grid">
                    { courseList }
                </div>
            );
        },


        componentWillMount: function() {
            Stores.CourseStore().on(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
            Stores.CourseStore().on(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
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
                field = course.get('field'),
                courseHeaderStyle = {
                    background: field.get('color')
                },
                enrollMessage = course.enrollCount() + ' enrolled';
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
            Router.path("/course/<courseId>", { courseId: this.props.course.id });
/*            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'course', course: this.props.course.id})*/
        }


    });


module.exports = {
    Root: Root
};
