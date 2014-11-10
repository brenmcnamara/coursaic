/** @jsx React.DOM */

/**
 * course.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

/*
 * Dependencies:
 *  - React
 *  - View namespace
 *  - Components in header.js
 *  - Components in widgets.js
 */


/**
 * Course_Root
 *
 * The root element on the Course
 * page.
 */
View.Course_Root = React.createClass({
    render: function() {
        return (
            <div className="main">
                <View.Header />
                <View.Header_Fill />
                <View.Course_Dashboard />
                <View.Course_Summary />
                <View.Course_Content />
            </div>
        );
    }
});


View.Course_Dashboard = React.createClass({
    render: function() {
        var profileGridStyle = {
            minWidth: "150px"
        };

        return (
            <div className="dashboard">
                <ul className="dashboard__course-logistics">
                    <li className="dashboard__course-logistics__item">2 exams</li>
                    <li className="dashboard__course-logistics__item">12 people enrolled</li>
                </ul>

                <ul className="dashboard__profile-grid profile-grid" style={ profileGridStyle }>
                    <li className="profile-grid__row__item profile-pic--square">
                        <img src="/img/temp/bunny-profile.png" />
                    </li>
                    <li className="profile-grid__row__item profile-pic--square">
                        <img src="/img/temp/frat-profile.png" />
                    </li>
                    <li className="profile-grid__row__item profile-pic--square">
                        <img src="/img/temp/dog-profile.png" />
                    </li>
                    <li className="profile-grid__row__item profile-pic--square">
                        <img src="/img/temp/monkey-profile.png" />
                    </li>
                    <li className="profile-grid__row__item profile-pic--square">
                        <img src="/img/temp/tiger-profile.png" />
                    </li>
                    <li className="profile-grid__row__item member-count--square">+7</li>
                </ul>
            </div>
        );
    }
});

View.Course_Summary = React.createClass({

    render: function() {
        var bannerStyle = {
            background: "rgb(208, 2, 27)"
        };

        return (
            <div className="course-summary">
                <div className="course-summary__banner" style={ bannerStyle }></div>
                <h1 className="course-summary__code">CS 101</h1>
                <p className="course-summary__name">Introduction to Computer Science</p>
                <p className="course-summary__field">
                    <span className="course-summary__field__key">Field: </span>
                    <span className="course-summary__field__value">Computer Science</span>
                </p>

                <div className="profile-pic--circle--bordered course-summary__creator-profile">
                    <img src="/img/temp/monkey-profile.png" />
                </div>
                <div className="course-summary__creator-info">Course created by
                    <span className="user-name"> Monkey Joe</span> on Sept. 20, 2013.
                </div>
            </div>
        );
    }


});


View.Course_Content = React.createClass({

    render: function() {
        return (
            <div className="content course-content">
                <View.Course_Content_Nav />
                <View.Course_Content_Body />
            </div>
        );
    }
});


View.Course_Content_Nav = React.createClass({

    render: function() {
        var examIconStyle = {
                height: "30px",
                margin: "-15px 0px 0px 9px"
            },
            selectionBarStyle = {
                top: "27px",
                background: "rgb(208, 2, 27)"
            };
        return (
            <div className="content__nav">
                <ul className="main-options">
                    <li className="main-options__item">
                        <img src="/img/icons/exam.png"
                             style={ examIconStyle }
                             className="main-options__item__icon" />

                        <div className="main-options__item__text">Create Exam</div>
                    </li>
                </ul>

                <div className="divide"></div>

                <div className="category exam-list">
                    <div className="category__title">Exams</div>
                    <div className="exam-list__selection-bar"
                         style={ selectionBarStyle }></div>

                    <ul className="category__list">
                        <li>Exam 1</li>
                        <li>Exam 2</li>
                    </ul>
                </div>
            </div>
        );
    }

});


View.Course_Content_Body = React.createClass({

    render: function() {
        return (
            <div className="content__body">
                <div className="content__body__wrapper">
                    <h1 className="content__body__title">Exam 1</h1>
                    <div className="exam">
                        <div className="exam__creator-info">
                            <div className="exam__creator-info__pic">
                                <div className="profile-pic--circle--bordered">
                                    <img src="/img/temp/frat-profile.png" />
                                </div>
                            </div>
                            
                            <span className="exam__creator-info__text">
                                Exam created by <span className="user-name">Frat Star</span> on Sept. 22, 2013.
                            </span>
                        </div>
                        <div className="exam__my-questions">
                            <div className="exam__my-questions__title">My Questions</div>
                            <ul className="exam__my-questions__question-list question-list">
                                <li className="question">
                                    <img className="question__icon--edit" src="/img/icons/edit.png" />
                                    <img className="question__icon--delete" src="/img/icons/delete.png" />
                                    <div className="question__content">
                                        <div className="question__ask">What is the capital of California?</div>
                                        <ul className="question__multi-choice multi-choice">
                                            <li className="multi-choice__item">Canada. This is a really long question and there is a lot of text here. I am going to keep on typing.</li>
                                            <li className="multi-choice__item">Hawaii</li>
                                            <li className="multi-choice__item--correct">Sacramento</li>
                                            <li className="multi-choice__item">Boise</li>
                                        </ul>
                                    </div>
                                    <div className="question__explain">
                                        Explanation: California is the captial of Sacramento.
                                    </div>

                                </li>
                                 <li className="question">
                                    <img className="question__icon--edit" src="/img/icons/edit.png" />
                                    <img className="question__icon--delete" src="/img/icons/delete.png" />
                                    <div className="question__content">
                                        <div className="question__ask">
                                            A farmer has 3 apples. He gives 2 to his buddy and buys 6 more at the store.  How many apples does the farmer have now?
                                        </div>

                                        <ul className="question__multi-choice multi-choice">
                                            <li className="multi-choice__item">4</li>
                                            <li className="multi-choice__item">9</li>
                                            <li className="multi-choice__item--correct">7</li>
                                            <li className="multi-choice__item">1</li>
                                        </ul>
                                    </div>

                                    <div className="question__explain">
                                        Explanation: 3 - 2 + 6 = 7.
                                    </div>
                                </li>
                            </ul>
                        </div> 
                    </div>
                </div>
            </div>
        );
            
    }
});