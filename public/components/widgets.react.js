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

/**
 * MainOption
 *
 * Main Options for the user to take, such as
 * creating a class or creating an exam.
 */
View.MainOptions = React.createClass({
    render: function() {

        var createCourseStyle = {
                height: '30px',
                margin: '-15px 0 0 9px'
            },
            inviteFriendsStyle = {
                height: '28px',
                margin: '-14px 0 0 0'
            },
            changeSchoolStyle = {
                height: '28px',
                margin: '-14px 0 0 6px'
            };

        return (
            <ul className="main-options">
                <li className="main-options__item">
                    <img src="/img/icons/book.png"
                         style={createCourseStyle}
                         className="main-options__item__icon" />
                    <div className="main-options__item__text">Create Course</div>
                </li>

                <li className="main-options__item">
                    <img src="/img/icons/group.png"
                         style={inviteFriendsStyle}
                         className="main-options__item__icon" />

                    <div className="main-options__item__text">Invite Friends</div>
                </li>

                <li className="main-options__item">
                    <img src="/img/icons/building.png"
                         style={changeSchoolStyle} 
                         className="main-options__item__icon" />
                    <div className="main-options__item__text">Change School</div>
                </li>
            </ul>
        );
    }
});


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
        return (
            <section className="category my-courses">
                <div className="category__title">My Courses</div>
                <ul className="category__list">
                    <li>CS 101</li>
                    <li>CS 201</li>
                    <li>MATH 247</li>
                    <li>ENGL 210A</li>
                </ul>
            </section>
        );
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


/**
 * CourseGrid
 *
 * A grid of courses.
 */
View.CourseGrid = React.createClass({
    render: function() {
        return (
            <div className="course-grid">
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
                <View.CourseInfo />
            </div>
        );
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

        var courseHeaderStyle = {
            background: '#417505'
        };
        // TODO: Separate out tags that are specific
        // to a page (i.e. home-content__course__grid__course).
        return (
            <div className="home-content__courses__grid__course course-info">
                <header className="course-info__header" style={courseHeaderStyle}>CS 101</header>
                <div className="course-info__body">
                    <div className="course-info__body__text">Introduction to Computer Science</div>
                </div>
                <footer className="course-info__footer">12 enrolled</footer>
            </div>
        );
    }
});

