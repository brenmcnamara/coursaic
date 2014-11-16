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


/**
 * Course_Dashboard
 *
 * The dashboard under the header element
 * containing any other aside information
 * for the course.
 */
View.Course_Dashboard = React.createClass({
    render: function() {
        var course = CourseStore.current(),
            profileGridStyle = {
                minWidth: "150px"
            };

        return (
            <div className="dashboard">
                <p className="dashboard__course-description">
                    { course.get('description') }
                </p>
            </div>
        );
    }
});

View.Course_Summary = React.createClass({

    render: function() {
        var course = CourseStore.current(),
            bannerStyle = {
                background: course.get('field').get('color')
            },
            enrollText = (course.get('enrollCount') == 1) ? 
                         "1 person enrolled" :
                         course.get('enrollCount') + " people enrolled",
            examCount = ExamStore.examsForCourse(course).length,
            examText;

        if (examCount === 0) {
            examText = "No Exams";
        }
        else if (examCount === 1) {
            examText = "1 Exam";
        }
        else {
            examText = examCount + " Exams";
        }

        return (
            <div className="course-summary">
                <div className="course-summary__banner" style={ bannerStyle }></div>
                <h1 className="course-summary__code">{ course.get('code') }</h1>
                <p className="course-summary__name">{ course.get('name') }</p>
                <p className="course-summary__field">
                    <span className="course-summary__field__key">Field: </span>
                    <span className="course-summary__field__value">{ course.get('field').get('name') }</span>
                </p>
                <div className="divide"></div>
                <ul className="course-summary__stats">
                    <li className="course-summary__stats__item">{ enrollText }</li>
                    <li className="course-summary__stats__item">{ examText }</li>
                </ul>
            </div>
        );
    },

    didFetchExams: function() {
        this.forceUpdate();
    },

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
    },

    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
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

                <View.Exam_List />

            </div>
        );
    }

});


View.Exam_List = React.createClass({

    render: function() {
        // TODO (brendan): Add a "No Exams" list item if there are no exams.
        var course = CourseStore.current(),
            examList = ExamStore.examsForCourse(course).map(function(exam) {
                return <View.Exam_List_Item key={ exam.id } exam={ exam } />
            }),
            selectionBarStyle = {
                top: "27px",
                background: course.get('field').get('color')
            },
            selectionBar = (examList.length) ?
                           (<div className="exam-list__selection-bar"
                                 style={ selectionBarStyle }></div>) :
                           null;

        return (
            <div className="category exam-list">
                { selectionBar }
                <div className="category__title">Exams</div>
                <ul className="category__list">
                    { examList }
                </ul>
            </div>
        );
    },

    // Event handler for when exams are fetched.
    didFetchExams: function(event) {
        this.forceUpdate();
    },

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
    },

    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
    }

});


View.Exam_List_Item = React.createClass({

    render: function() {
        var exam = this.props.exam;

        return (
            <li>{ exam.get('name') }</li>
        );
    }

});


View.Course_Content_Body = React.createClass({

    render: function() {
        return (
            <div className="content__body">
                <View.Course_No_Exam />
            </div>
        );
            
    }
});


View.Course_No_Exam = React.createClass({

    render: function() {
        var examCount = ExamStore.examsForCourse(CourseStore.current()).length,
            title = (examCount) ? "Select Exam" : "Create Exam",
            description = (examCount) ? "Select an exam to the left." :
                                        "This course has no exams. Create an exam to the left.";

        return (
            <div className="content__body__wrapper">
                <h1 className="content__body__title">{ title }</h1>
                <p className="content__body__description">{ description }</p>
            </div>
        );
    },

    didFetchExams: function() {
        this.forceUpdate();
    },

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
    },

    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
    }

});


View.Course_Exam = React.createClass({
    
    render: function() {
        return (
            <div className="content__body__wrapper">
                <h1 className="content__body__title">Exam 1</h1>
                <p className="content__body__description">Here is a description of the exam</p>
                <div className="exam">
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
        );
    }


});