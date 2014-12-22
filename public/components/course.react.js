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
 *  - Components in header.js
 *  - Components in widgets.js
 */


var React = require('react'),

    HeaderLayout = require('./header.react.js').HeaderLayout,
    PopupsLayout = require('./popups.react.js').PopupsLayout,

    Stores = require('../js/Stores'),

    Formatter = require('../js/Formatter.Text.js').Formatter,

    Action = require('../js/Action.js').Action,
    CAEvent = require('../js/Event.js').CAEvent,

    Util = require('../js/Util.js').Util,

    /**
     * Course_Root
     *
     * The root element on the Course
     * page.
     */
    Course_Root = React.createClass({
        
        render: function() {
            var isEnrolled = Stores.CourseStore().current().isEnrolled(Stores.UserStore().current()),
                enrollButton = (isEnrolled) ?
                               (<Course_Unenroll_Button />) :
                               (<Course_Enroll_Button />),
                deleteQuestionPopup = (Stores.PageStore().currentMode() === Stores.PageStore().Mode.DELETE_QUESTION) ?
                                      (<PopupsLayout.Popup_Delete_Question />) :
                                      (null)
                createExamPopup = (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_EXAM) ?
                                  (<PopupsLayout.Popup_Create_Exam />) :
                                  (null);

            return (
                <div className="main">
                    { createExamPopup }
                    { deleteQuestionPopup }
                    <HeaderLayout.Header isOpaque={ false } />
                    <HeaderLayout.Header_Fill isOpaque={ false } />
                    <Course_Dashboard />
                    <Course_Summary />
                    { enrollButton }
                    <Course_Content />
                </div>
            );
        },


        onChange: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.CourseStore().addListener(CAEvent.Name.DID_CHANGE_ENROLLMENT, this.onChange);
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.CourseStore().removeListener(CAEvent.Name.DID_CHANGE_ENROLLMENT, this.onChange);
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.onChange);
        }


    }),


    /**
     * Course_Dashboard
     *
     * The dashboard under the header element
     * containing any other aside information
     * for the course.
     */
    Course_Dashboard = React.createClass({
        
        render: function() {
            var course = Stores.CourseStore().current(),
                profileGridStyle = {
                    minWidth: "150px"
                };

            return (
                <div className="dashboard">
                    <p className="dashboard__course-description">
                        { Formatter.Text.truncate(course.get('description'), { maxlen: 200 }) }
                    </p>
                </div>);
        }


    });


    Course_Summary = React.createClass({

        render: function() {
            var course = Stores.CourseStore().current(),
                bannerStyle = {
                    background: course.get('field').get('color')
                },
                enrollText = (course.enrollCount() == 1) ? 
                             "1 person enrolled" :
                             course.enrollCount() + " people enrolled",
                examCount = Stores.ExamStore().examsForCourse(course).length,
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


        onChange: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().addListener(CAEvent.Name.DID_FETCH_EXAMS, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.onChange);
        }


    }),


    Course_Enroll_Button = React.createClass({

        render: function() {
            return (
                <button onClick={ this.onClick }
                        type="button" 
                        className="button large-button--positive course-page__enroll">
                    Enroll
                </button>
            );
        },


        onClick: function() {
            Action.send(Action.Name.ENROLL_CURRENT_USER, { courseId: Stores.CourseStore().current().id });
        }


    }),


    Course_Unenroll_Button = React.createClass({

        render: function() {
            return (
                <button onClick={ this.onClick }
                        type="button"
                        className="button large-button--negative course-page__enroll">
                    Unenroll
                </button>
            );
        },


        onClick: function() {
            Action.send(Action.Name.UNENROLL_CURRENT_USER, { courseId: Stores.CourseStore().current().id });
        }


    }),


    Course_Content = React.createClass({

        render: function() {
            return (
                <div className="content course-content">
                    <Course_Content_Nav />
                    <Course_Content_Body />
                </div>
            );
        }


    }),


    Course_Content_Nav = React.createClass({ 


        render: function() {
            var examIconStyle = {
                    height: "30px",
                    margin: "-15px 0px 0px 9px"
                };
            if (!Stores.PageStore().currentMode()) {
                return (
                    <div className="content__nav">
                        <ul className="main-options">
                            <li className="main-options__item">
                                <img src="/img/icons/exam.png"
                                     style={ examIconStyle }
                                     className="main-options__item__icon--clickable" />

                                <div onClick={ this.onClickCreateExam }
                                     className="main-options__item__text--clickable">Create Exam</div>
                            </li>
                        </ul>

                        <div className="divide"></div>

                        <Exam_List />

                    </div>
                );
            }
            else {
                return (
                    <div className="content__nav">
                        <ul className="main-options">
                            <li className="main-options__item">
                                <img src="/img/icons/exam.png"
                                     style={ examIconStyle }
                                     className="main-options__item__icon--unclickable" />

                                <div className="main-options__item__text--unclickable">Create Exam</div>
                            </li>
                        </ul>

                        <div className="divide"></div>

                        <Exam_List />

                    </div>
                );
            }  
        },

        
        onClickCreateExam: function(event) {
            Action.send(Action.Name.TO_MODE_CREATE_EXAM);
        },

        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }


    }),


    Exam_List = React.createClass({

        render: function() {
            // TODO: Add a "No Exams" list item if there are no exams.
            var PIXEL_SPACE_BETWEEN_EXAMS = 28,
                PIXEL_SPACE_TO_FIRST_EXAM = 27,
                course = Stores.CourseStore().current(),
                selectedExamIndex = -1,
                examList = Stores.ExamStore().examsForCourse(course).map(function(exam, index) {
                    if (Stores.ExamStore().current() && exam.id === Stores.ExamStore().current().id) {
                        selectedExamIndex = index;
                    }
                    return <Exam_List_Item key={ exam.id } exam={ exam } />
                }),
                displayStyle = (selectedExamIndex === -1) ? "none" : "initial",
                selectedExamBarPixelPosition = (selectedExamIndex * PIXEL_SPACE_BETWEEN_EXAMS) +
                                                                     PIXEL_SPACE_TO_FIRST_EXAM,
                selectionBarStyle = {
                    top: selectedExamBarPixelPosition.toString() +"px",
                    display: displayStyle,
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


        didLoadExam: function(event) {
            this.forceUpdate();
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        didCreateExam: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().addListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().addListener(CAEvent.Name.DID_CREATE_EXAM, this.didCreateExam);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_CREATE_EXAM, this.didCreateExam);
        }

    }),


    Exam_List_Item = React.createClass({

        render: function() {
            var exam = this.props.exam;

            if (Stores.PageStore().currentMode()) {
                return (
                    <li>{ exam.get('name') }</li>
                );
            }
            else {
                return (
                    <li onClick = { this.handleClick } >{ exam.get('name') }</li>
                );
            }
        },


        handleClick: function(event) {
            Action.send(Action.Name.DISPLAY_EXAM,
                        { examId: this.props.exam.id })
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }


    }),


    Course_Content_Body = React.createClass({

        render: function() {
            // If there is a current exam, present
            // the current exam, otherwise, present
            // the "No Exam" element.
            if (Stores.ExamStore().current()) {
                return (
                    <div className="content__body">
                        <Course_Exam />
                    </div>
                )}
            else {
                return (
                    <div className="content__body">
                        <Course_No_Exam />
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
            Stores.ExamStore().addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().addListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_LOAD_EXAM, this.didLoadExam);
        }


    }),


    Course_No_Exam = React.createClass({

        render: function() {
            var examCount = Stores.ExamStore().examsForCourse(Stores.CourseStore().current()).length,
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
            Stores.ExamStore().addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        },

        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
        }

    }),


    // TODO: Change this to Course_Exam_Info
    Course_Exam = React.createClass({
        
        render: function() {
            // Get the current exam.
            var exam = Stores.ExamStore().current(),
                questionCount = Stores.ExamStore().questionsForExam(exam).length,
                takeExamHTML,
                noExamStyle = {
                    color: "#e34d2f"
                };

                if (questionCount === 0) {
                    takeExamHTML = (
                            <p style={ noExamStyle }>
                                This exam has no questions. You must add questions before you
                                can take the exam.
                            </p>
                        );
                }
                else if (questionCount === 1) {
                    takeExamHTML = (
                                <p>
                                    This exam only has <strong>1
                                    </strong> question. <span onClick={ this.onClickTakeExam }
                                          className="inline-button">Take the exam.</span>
                                </p>

                            );
                }
                else {
                    takeExamHTML = (
                                <p>
                                    This exam has <strong>{ questionCount }
                                    </strong> questions created between all users. <span onClick={ this.onClickTakeExam }
                                          className="inline-button"> Take the exam.</span>
                                </p>

                            );
                }

            return (
                <div className="content__body__wrapper">
                    <span className="content__body__title">{ exam.get('name') }</span>
                    <div className="content__body__description">
                        <p>{ exam.get('description') }</p>
                        { takeExamHTML }
                    </div>

                    <div className="exam-info">
                        <Course_Exam_Questions />
                    </div>
                </div>
            );
        },


        onClickTakeExam: function(event) {
            Action.send(Action.Name.PERFORM_LOAD,
                        {
                            pageKey: 'exam',
                            examId: Stores.ExamStore().current().id,
                            course: Stores.CourseStore().current().id
                        });
        }


    }),


    Course_Exam_Questions = React.createClass({

        render: function() {
            // TODO: Consider breaking up DID_FETCH_EXAMS
            // into 2 events: DID_FETCH_EXAMS and DID_FETCH_QUESTIONS
            var questions = Stores.ExamStore().questionsForExam(Stores.ExamStore().current(),
                                                                Stores.UserStore().current()),
                listItems;

            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_QUESTION) {
                // In create question mode, set the first element
                // as a new question form..
                listItems = [(
                    <Course_Exam_Question_Item_Editing key="new" />
                )];
            }
            else {
                listItems = [];
            }

            questions.forEach(function(question) {
                // Check if we are editing this question.
                if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION &&
                    Stores.PageStore().currentPayload().questionId === question.id) {

                    listItems.push(<Course_Exam_Question_Item_Editing key="new"
                                                                      question={ question } />);
                }
                else {
                    listItems.push(<Course_Exam_Question_Item key={ question.id }
                                                              question={ question } />);
                }
            });

            return (
                <div className="exam-info__my-questions">
                    <span className="exam-info__my-questions__title">My Questions</span>
                    <Course_Exam_Questions_Add_Button />
                    <ul className="exam-info__my-questions__question-list question-list">
                         { listItems }
                    </ul>
                </div> 
            );
        },


        didFetchExams: function() {
            this.forceUpdate();
        },


        didCreateQuestion: function(event) {
            this.forceUpdate();
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().addListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().addListener(CAEvent.Name.DID_CREATE_QUESTION, this.didCreateQuestion);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_CREATE_QUESTION, this.didCreateQuestion);
        }


    }),


    Course_Exam_Questions_Add_Button = React.createClass({

        render: function() {

            if (Stores.PageStore().currentMode()) {
                return (
                    <button type="button"
                            className="button small-button--positive exam-info__my-questions__add-button">
                        New
                    </button>
                );
            }
            else {
                return (
                    <button onClick={ this.onClick }
                            type="button"
                            className="button small-button--positive exam-info__my-questions__add-button">
                        New
                    </button>
                );
            }
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        onClick: function() {
            Action.send(Action.Name.TO_MODE_CREATE_QUESTION, { examId: Stores.ExamStore().current().id });
        },


        componentWillMount: function() {
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }


    }),


    Course_Exam_Question_Item = React.createClass({

        render: function() {
            // NOTE: This is hard-coded for multiple-choice questions.
            // Change this if adding other types of questions.
            var question = this.props.question,
                explanationStyle= {
                    textDecoration: 'underline',
                    marginRight: '3px'
                };

            if (Stores.PageStore().currentMode()) {
                return (
                    <li className="question">
                        <img className="question__icon--edit" src="/img/icons/edit.png" />
                        <img className="question__icon--delete" src="/img/icons/delete.png" />
                        <div className="question__content">
                            <div className="question__ask">{ question.get('question') }</div>
                            <Course_Exam_Question_MultiChoice_Option question={ question } />
                        </div>
                        <div className="question__explain">
                            <span style= { explanationStyle }>Explanation:</span>
                            <span>{ question.get('explanation') }</span>
                        </div>
                    </li>
                );
            }
            else {
                return (
                    <li className="question">
                        <img onClick={ this.onEdit }
                             className="question__icon--edit"
                             src="/img/icons/edit.png" />
                        <img onClick={ this.onDelete }
                             className="question__icon--delete" src="/img/icons/delete.png" />
                        <div className="question__content">
                            <div className="question__ask">{ question.get('question') }</div>
                            <Course_Exam_Question_MultiChoice_Option question={ question } />
                        </div>
                        <div className="question__explain">
                            <span style= { explanationStyle }>Explanation:</span>
                            <span>{ question.get('explanation') }</span>
                        </div>
                    </li>
                );
            }
        },

        
        onEdit: function(event) {
            Action.send(Action.Name.TO_MODE_EDIT_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        },


        onDelete: function(event) {
            Action.send(Action.Name.TO_MODE_DELETE_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        },
        

        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }


    }),


    Course_Exam_Question_Item_Editing = React.createClass({

        getInitialState: function() {
            // Find the index of the solution.
            // If there is no question passed in, then this
            // form is for creating a new question.
            var question = this.props.question,
                isNewQuestion = !question,
                options = (!isNewQuestion) ? question.getOptions() : ["","","",""],
                solutionIndex = -1, i, n;

            // Find the index of the current solution.
            for (i = 0, n = options.length; (i < n && !isNewQuestion); ++i) {
                if (question.isCorrect(options[i])) {
                    solutionIndex = i;
                }
            }

            if (solutionIndex === -1 && !isNewQuestion) {
                throw new Error("Solution could not be found for the question.");
            }

            if (isNewQuestion) {
                return {
                        solutionIndex: 3,
                        questionMap: {
                                        options: ["","","",""],
                                        question: "",
                                        explanation: "",
                                        solution: "",
                                        type: 1 
                                    }
                        };
            }
            // Not a new question, so the initial state depends on the question's
            // current fields.
            return { solutionIndex: solutionIndex,
                     questionMap: { options: this.props.question.getOptions() } };
        }, 


        render: function() {
            // Rendering a new question form if there was no question
            // passed in to edit.
            var question = this.props.question,
                isNewQuestion = !question,
                questionId = (!isNewQuestion) ? question.id : null,
                // This contains any updates to the state
                // of the current question while the user is
                // changing it.
                updatedQuestionMap = this.state.questionMap,

                // If the updated question map contains a field any of
                // the properties of a question, that means it is in the
                // process of being edited. Otherwise, just get the
                // property from the question object itself.
                // Note that if the question object is not passed
                // in as a parameter, this will always get the field
                // from the updatedQuestionMap due to how the initial
                // state was set.
                questionText = (updatedQuestionMap.question || updatedQuestionMap.question === "") ?
                                 updatedQuestionMap.question: question.get('question'),

                solution = (updatedQuestionMap.solution || updatedQuestionMap.solution === "") ?
                                 updatedQuestionMap.solution: question.get('solution'),

                explanation = (updatedQuestionMap.explanation || updatedQuestionMap.explanation === "") ?
                                 updatedQuestionMap.explanation: question.get('explanation'),
                // The updated question map will always contain
                // the set of options available, so no
                // need for a conditional check.
                options = updatedQuestionMap.options,
                explanationStyle= {
                    textDecoration: 'underline',
                    marginRight: '3px'
                },
                saveView = (this.isQuestionValid()) ?
                           <img onClick = { this.onSave }
                                className="question__icon--save"
                                src="/img/icons/save.png" /> :
                            // TODO: Modify styling to fade out
                            // save button.
                            <img className="question__icon--save"
                                 src="/img/icons/save.png" />,

                cancelView = <img onClick={ this.onClickCancel }
                                    className="question__icon--cancel"
                                    src="/img/icons/cancel.png" />;
            return (
                <li className="question">
                    <div> { saveView } </div>
                    <div> { cancelView } </div>
                    <div className="question__content">
                        <input onChange={ this.onChangeQuestion }
                               type="text"
                               placeholder="Ask a question (i.e. Why is the sky blue?)."
                               defaultValue={ questionText }
                               className="question__ask" />
                        <Course_Exam_Question_MultiChoice_Option_Editing 
                                                        onChangeText={ this.onChangeTextForOption }
                                                        onChangeRadio={ this.onChangeRadioForOption }
                                                        questionId={ questionId }
                                                        solution={ solution }
                                                        explanation={ explanation }
                                                        question={ questionText }
                                                        options={ options } />
                    </div>
                    <div className="question__explain">
                        <span style={ explanationStyle }>Explanation:</span>
                        <textarea onChange={ this.onChangeExplanation }
                                  rows="4"
                                  cols="50" 
                                  placeholder="Give an explanation to your solution."
                                  defaultValue={ explanation }>
                        </textarea>
                    </div>
                </li>
            );
        },


        onSave: function(event) {
            var map;
            if (!this.isQuestionValid()) {
                throw new Error("Trying to save an invalid question.");
            }
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_QUESTION) {
                // Add the current exam to the question.
                map = Util.copy(this.state.questionMap);
                map.examId = Stores.ExamStore().current().id;
                Action.send(Action.Name.CREATE_QUESTION,
                        {
                            questionMap: map
                        });
            }
            // Assume the current mode is the QUESTION_EDIT
            // mode.
            else {
                // TODO: Modify so that examId is
                // inside the questionMap.
                Action.send(Action.Name.EDIT_QUESTION,
                        {
                            questionMap: this.state.questionMap
                        });
            }
            
        },


        onClickCancel: function() {
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION) {
                Action.send(Action.Name.FROM_MODE_EDIT_QUESTION);
            }
            else {
                Action.send(Action.Name.FROM_MODE_CREATE_QUESTION);
            }
        },


        /**
         * Make sure that the question is in the correct form
         * for saving. A question is valid if: (1) there are no
         * repeating option values (every option is unique),
         * (2) the question has a question text that is not
         * empty, (3) the question has an explanation that is
         * non-empty, and (4) the question has a solution that is
         * non-empty.
         *
         * @method validateQuesion
         *
         * @return {Boolean} True if the question is ready
         *  to be saved, false otherwise.
         */
        isQuestionValid: function() {
            var questionMap = this.state.questionMap,
                question = this.props.question,
                // Since empty strings are falsey values we 
                // need to explicitly check if questionMap
                // properties are empty strings before we
                // set them to their default values
                questionText = (questionMap.question || questionMap.question === "") ? 
                                questionMap.question: question.get('question'),

                solution = (questionMap.solution || questionMap.solution === "") ?
                                questionMap.solution: question.get('solution'),

                explanation = (questionMap.explanation || questionMap.explanation === "") ?
                                questionMap.explanation: question.get('explanation'),
                // The updated question map will always contain
                // the set of options available, so no
                // need for a conditional check.
                options = questionMap.options,
                // A map containing the options. This is in
                // map form to make validation easier.
                optionsMap = {},
                value,
                i, n;

            // Check if there are any repeating options.
            for(i = 0, n = options.length; i < n; ++i) {
                // Create a hash containing a
                // particular option and check if
                // that value appears anywhere
                // else in the options list.
                value = options[i];
                // Make sure the option value is
                // not an empty string.
                if (value === "") {
                    return false;
                }
                if (optionsMap[value]) {
                    // The option already exists in the
                    // map, so an option is repeated,
                    // which means there are multiple
                    // options with the value.
                    return false;
                }
                optionsMap[value] = true;
            }
            // Check that the question, explanation, and solution are non-empty
            return ((questionText !== "") &&
                   (explanation !== "") &&
                   (solution !== ""));
        },


        onChangeQuestion: function(event) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.question = event.target.value.trim();
            this.setState({ questionMap: questionMap });
        },


        onChangeTextForOption: function(event, questionIndex) {
            var questionMap = Util.copy(this.state.questionMap),
                value = event.target.value.trim();

            // If the questionIndex is the index of the current
            // solution, then update the solution to
            // reflect the change in the text.
            if (questionIndex === this.state.solutionIndex) {
                questionMap.solution = value;
            }

            questionMap.options[questionIndex] = value;
            this.setState({questionMap: questionMap});
        },


        onChangeRadioForOption: function(event, questionIndex) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.solution = event.target.value.trim();
            this.setState({ solutionIndex: questionIndex, questionMap: questionMap });
        },


        onChangeExplanation: function(event) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.explanation = event.target.value.trim();
            this.setState({ questionMap: questionMap });
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().addListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.CHANGED_MODE, this.changedMode);
        }

        
    }),


    // TODO: Fix naming of these React classes to make them
    // shorter and more clear.
    Course_Exam_Question_MultiChoice_Option = React.createClass({

        render: function() {
            var question = this.props.question,
                listItems = question.getOptions().map(function(option, index) {
                    var isCorrect = question.isCorrect(option);
                    return <Course_Exam_Question_MultiChoice_Option_Item key={ index }
                                                                         option={ option }
                                                                         isCorrect={ isCorrect } />;
                });

            return (
                <ul className="question__multi-choice multi-choice">
                    { listItems }
                </ul>
            );
        }

    }),


    Course_Exam_Question_MultiChoice_Option_Editing = React.createClass({

        render: function() {
            var self = this,
                name = 'multichoice-' + this.props.questionId,
                listItems = this.props.options.map(function(option, index) {
                    var isCorrect = self.isCorrect(option),
                        key = self.props.questionId + '-' + index.toString();
                    // TODO: Shorten this line.
                    return <Course_Exam_Question_MultiChoice_Option_Item_Editing 
                                                                onChangeText={ self.onChangeText }
                                                                onChangeRadio={ self.onChangeRadio}
                                                                name={ name }
                                                                key={ key }
                                                                option={ option }
                                                                index={ index }
                                                                isCorrect={ isCorrect } />;
                });

            return (
                <ul className="question__multi-choice multi-choice--editing">
                    { listItems }
                </ul>
            );
        },


        /**
         * Check if the submission is the correct solution to
         * the question.
         *
         * @method isCorrect
         *
         * @param submission {String} The submission to check
         *  against the solution.
         *
         * @return {Boolean} True if the submission is the
         *  correct answer to the question, false otherwise.
         */
        isCorrect: function(submission) {
            return this.props.solution === submission;
        },


        onChangeText: function(event, questionIndex) {
            this.props.onChangeText(event, questionIndex);
        },


        onChangeRadio: function(event, questionIndex) {
            this.props.onChangeRadio(event, questionIndex);
        }


    }),


    Course_Exam_Question_MultiChoice_Option_Item = React.createClass({

        render: function() {
            var questionClass = (this.props.isCorrect) ?
                                "multi-choice__item--correct" :
                                "multi-choice__item",
                option = this.props.option;

            return <li className={ questionClass }>{ option }</li>;
        }

    }),


    Course_Exam_Question_MultiChoice_Option_Item_Editing = React.createClass({

        getInitialState: function() {
            return {option: this.props.option, isCorrect: this.props.isCorrect};
        },


        render: function() {
            var questionClass = (this.props.isCorrect) ?
                                "multi-choice__item--correct" :
                                "multi-choice__item",
                option = this.props.option;
            if (this.props.isCorrect) {
                return (
                    <li className={ questionClass }>
                        <input onChange={ this.onChangeRadio }
                               type="radio"
                               name={ this.props.name }
                               value={ option }
                               defaultChecked />
                        <span>
                            <input onChange={ this.onChangeText }
                                   type="text"
                                   defaultValue={ option }
                                   placeholder="Give a multiple choice option." />
                        </span>
                    </li>
                );         
            }
            // Not the correct answer.
            return (
                <li className={ questionClass }>
                    <input onChange={ this.onChangeRadio }
                           type="radio"

                           name={ this.props.name }
                           value={ option } />
                    <span>
                        <input onChange={ this.onChangeText }
                               type="text"
                               placeholder="Give a multiple choice option."
                               defaultValue={ option } />
                    </span>
                </li>
            ); 

        },


        onChangeText: function(event) {
            this.props.onChangeText(event, this.props.index);
        },


        onChangeRadio: function(event) {
            this.props.onChangeRadio(event, this.props.index);
        }


    });


exports.CourseLayout = {
    Course_Root: Course_Root,
};

