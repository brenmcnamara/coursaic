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

    getInitialState: function() {
        return {isEditing: false};
    }, 


    render: function() {
        var exam = this.props.exam;

        if (this.state.isEditing) {
            return (
                <li>{ exam.get('name') }</li>
            );
        }
        else {
            return (
                <li onClick = {this.handleClick} >{ exam.get('name') }</li>
            );
        }
    },

    handleClick: function(event) {
        Action.send(Action.Name.DISPLAY_EXAM,
                    {examId: this.props.exam.id})
    },

    didBeginEditing: function(event) {
        this.setState({isEditing: true});
        this.forceUpdate();
    },

    didEndEditing: function() {
        this.setState({isEditing: false});
        this.forceUpdate();
    },

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
        ExamStore.addListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);

    },

    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
        ExamStore.removeListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
    }


});


View.Course_Content_Body = React.createClass({

    render: function() {
        // If there is a current exam, present
        // the current exam, otherwise, present
        // the "No Exam" element.
        if (ExamStore.current()) {
            return (
                <div className="content__body">
                    <View.Course_Exam />
                </div>
            )}
        else {
            return (
                <div className="content__body">
                    <View.Course_No_Exam />
                </div>
            )};      
    },

    didFetchExams: function() {
        this.forceUpdate();
    },

    didLoadExam: function() {
        this.forceUpdate();
    },

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        ExamStore.addListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
    },

    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        ExamStore.removeListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
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
        // Get the current exam.
        var exam = ExamStore.current();
        return (
            <div className="content__body__wrapper">
                <h1 className="content__body__title">{ exam.get('name') }</h1>
                <p className="content__body__description">{ exam.get('description') }</p>
                <div className="exam">
                    <View.Course_Exam_Questions />
                </div>
            </div>
        );
    }

});


View.Course_Exam_Questions = React.createClass({

    render: function() {
        // TODO (brendan): Consider breaking up DID_FETCH_EXAMS
        // into 2 events: DID_FETCH_EXAMS and DID_FETCH_QUESTIONS
        var questions = ExamStore.questionsForExam(ExamStore.current(),
                                                   UserStore.current()),
            listItems = questions.map(function(question) {
                if (question.isEditing()) {
                    return <View.Course_Exam_Question_Item_Editing question={ question } />;
                }
                else {
                    return <View.Course_Exam_Question_Item key={ question.id }
                                                           question={ question } />
                }

            });

        return (
            <div className="exam__my-questions">
                <div className="exam__my-questions__title">My Questions</div>
                <ul className="exam__my-questions__question-list question-list">
                     { listItems }
                </ul>
            </div> 
        );
    },


    didFetchExams: function() {
        this.forceUpdate();
    },


    didBeginEditing: function(event) {
        this.setState({isEditing: true});
    },


    didEndEditing: function(event) {
        this.setState({isEditing: false});
    },


    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        ExamStore.addListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
        ExamStore.addListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
    },


    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        ExamStore.removeListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
        ExamStore.removeListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
    }


});


View.Course_Exam_Question_Item = React.createClass({

    getInitialState: function() {
        return {isEditing: false};
    }, 

    render: function() {
        // NOTE (brendan): This is hard-coded for multiple-choice questions.
        // Change this if adding other types of questions.
        var question = this.props.question,
            explanationStyle= {
                textDecoration: 'underline',
                marginRight: '3px'
            };

        if (this.state.isEditing) {
            return (
                <li className="question">
                    <img className="question__icon--edit" src="/img/icons/edit.png" />
                    <img className="question__icon--delete" src="/img/icons/delete.png" />
                    <div className="question__content">
                        <div className="question__ask">{ question.get('question') }</div>
                        <View.Course_Exam_Question_MultiChoice_Option question={ question } />
                    </div>
                    <div className="question__explain">
                        <span style= { explanationStyle }>Explanation:</span>
                        <span>{ question.get('explanation') }</span>
                    </div>
                </li>
        )}
        else {
            return (
                <li className="question">
                    <img onClick={this.onEdit}
                         className="question__icon--edit"
                         src="/img/icons/edit.png" />
                    <img className="question__icon--delete" src="/img/icons/delete.png" />
                    <div className="question__content">
                        <div className="question__ask">{ question.get('question') }</div>
                        <View.Course_Exam_Question_MultiChoice_Option question={ question } />
                    </div>
                    <div className="question__explain">
                        <span style= { explanationStyle }>Explanation:</span>
                        <span>{ question.get('explanation') }</span>
                    </div>
                </li>
        )};
    },

    
    onEdit: function(event) {
        Action.send(Action.Name.PERFORM_QUESTION_EDIT,
                    {
                        examId: ExamStore.current().id,
                        questionId: this.props.question.id
                    });
    }


});


View.Course_Exam_Question_Item_Editing = React.createClass({

    getInitialState: function() {

        return {questionMap: {options: this.props.question.getOptions()}};
    }, 


    render: function() {
        var question = this.props.question,
            explanationStyle= {
                textDecoration: 'underline',
                marginRight: '3px'
            };
        return (
            <li className="question">
                <img onClick = { this.onSave } className="question__icon--save" src="/img/icons/save.png" />
                <div className="question__content">
                    <input onChange={ this.onChangeQuestion }
                           type="text"
                           defaultValue={ question.get('question') }
                           className="question__ask" />
                    <View.Course_Exam_Question_MultiChoice_Option_Editing onChange={ this.onChangeOptions }
                                                                          question={ question } />
                </div>
                <div className="question__explain">
                    <span style={ explanationStyle }>Explanation:</span>
                    <textarea onChange={ this.onChangeExplanation }
                              rows="4"
                              cols="50" 
                              defaultValue={ question.get('explanation') }>
                    </textarea>
                </div>
            </li>
        );
    },


    onSave: function(event) {
        Action.send(Action.Name.SAVE_QUESTION_EDIT,
                    {examId: ExamStore.current().id,
                        questionId: this.props.question.id,
                        questionMap: this.state.questionMap });
    },


    onChangeQuestion: function(event) {
        this.state.questionMap.question = event.target.value;
    },


    onChangeOptions: function(event, qindex) {
        if(event.target.type === "radio"){
            this.state.questionMap.solution = event.target.value;
        }
        else if(event.target.type === "text") {
            this.state.questionMap.options[qindex] = event.target.value;
            console.log(this.state.questionMap.options);
        }

    },


    onChangeExplanation: function(event) {
        this.state.questionMap.explanation = event.target.value;
    }


});


// TODO (brendan): Fix naming of these React classes to make them
// shorter and more clear.
View.Course_Exam_Question_MultiChoice_Option = React.createClass({

    render: function() {
        var question = this.props.question,
            listItems = question.getOptions().map(function(option, index) {
                var isCorrect = question.isCorrect(option);
                return <View.Course_Exam_Question_MultiChoice_Option_Item key={ index }
                                                                          option={ option }
                                                                          isCorrect={ isCorrect } />;
            });

        return (
            <ul className="question__multi-choice multi-choice">
                { listItems }
            </ul>
        );
    }

});


View.Course_Exam_Question_MultiChoice_Option_Editing = React.createClass({

    render: function() {
        var self = this,
            question = this.props.question,
            name = 'multichoice-' + question.id,
            listItems = question.getOptions().map(function(option, index) {
                var isCorrect = question.isCorrect(option),
                    key = question.id + '-' + index.toString();
                // TODO (brendan): Shorten this line.
                return <View.Course_Exam_Question_MultiChoice_Option_Item_Editing onChange={self.onChangeOptions}
                                                                                  qindex = { index } //does this do anything
                                                                                  name={ name }
                                                                                  key={ key }
                                                                                  option={ option }
                                                                                  isCorrect={ isCorrect } />;
            });

        return (
            <ul className="question__multi-choice multi-choice--editing">
                { listItems }
            </ul>
        );
    },


    onChangeOptions: function(event, qindex) {
        this.props.onChange(event, qindex);
    },


});


View.Course_Exam_Question_MultiChoice_Option_Item = React.createClass({

    render: function() {
        var questionClass = (this.props.isCorrect) ?
                            "multi-choice__item--correct" :
                            "multi-choice__item",
            option = this.props.option;

        return <li className={ questionClass }>{ option }</li>;
    }

});


View.Course_Exam_Question_MultiChoice_Option_Item_Editing = React.createClass({

    render: function() {
        var questionClass = (this.props.isCorrect) ?
                            "multi-choice__item--correct" :
                            "multi-choice__item",
            option = this.props.option,
            qindex  = this.props.qindex;

        if (this.props.isCorrect) {
            return (
                <li className={ questionClass }>
                    <input onChange={ this.onChangeOptions }
                           type="radio"
                           name={ this.props.name }
                           defaultValue={ option }
                           defaultChecked />
                    <span><input onChange={ this.onChangeOptions } type="text" defaultValue={ option } /></span>
                </li>
            );         
        }
        // Not the correct answer.
        return (
            <li className={ questionClass }>
                <input onChange={ this.onChangeOptions }
                       type="radio"
                       name={ this.props.name }
                       defaultValue={ option } />
                <span><input onChange={ this.onChangeOptions } type="text" defaultValue={ option } /></span>
            </li>
        ); 

    },


    onChangeOptions: function(event) {
        this.props.onChange(event, this.props.qindex);
    },


});



