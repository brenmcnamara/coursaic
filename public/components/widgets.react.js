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

// TODO: Move this to the home page react components.
// Rename this to make it look like it is home-page specific.
/**
 * MainOption
 *
 * Main Options for the user to take, such as
 * creating a class or creating an exam.
 */
View.MainOptions = React.createClass({
    
    render: function() {
        return (
            <ul className="main-options">
                <View.MainOption_CreateCourse />
            </ul>
        );
    }

});


View.MainOption_CreateCourse = React.createClass({
    
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

});

// TODO: Move this to home.react.js
/**
 * MyCourses
 *
 * A list of all courses the user
 * is currently enrolled in. Serves
 * for quick, easy navigation to
 * these courses.
 */
View.MyCourses = React.createClass({
   
    render: function() {
        // TODO: Shouldn't be getting the enrolled courses
        // from the parent, should generate them from this element making
        // a query.
        var courses = this.props.enrolled.map(function(course) {
            return <View.MyCourses_Course key={ course.id } course={ course } />
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

});


View.MyCourses_Course = React.createClass({
    
    render: function() {
        var course = this.props.course;
        return (
            <li onClick={ this.handleClick }>{ course.get('code') }</li>
        );
    },


    handleClick: function(event) {
        Action.send(Action.Name.PERFORM_LOAD, {pageKey: 'course', course: this.props.course.id});
    }


});


/**
 * Divide
 *
 * A divide element used to separate
 * components.
 */
View.Divide = React.createClass({
    
    render: function() {
        return (
            <div className="divide"></div>
        );
    }

});

View.Divide_Full = React.createClass({

    render: function() {
        return (
            <div className="divide--full"></div>
        );
    }


});

// TODO: Move this to home page.
/**
 * CourseGrid
 *
 * A grid of courses.
 */
View.CourseGrid = React.createClass({

    render: function() {
        var courseList = CourseStore.map(function(course) {
            return <View.CourseInfo key={ course.id } course={ course } />;
        });
        return (
            <div className="course-grid">
                {courseList}
            </div>
        );
    },

    componentWillMount: function() {
        CourseStore.addListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
        CourseStore.addListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
    },

    componentWillUnmount: function() {
        CourseStore.removeListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
        CourseStore.removeListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
    },

    onChange: function() {
        this.forceUpdate();
    }


});


/**
 * CourseInfo
 *
 * The information for a course displayed
 * after a search.
 */
View.CourseInfo = React.createClass({
    
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

