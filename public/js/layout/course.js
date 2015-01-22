/** @jsx React.DOM */

/**
 * course.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

var React = require('react'),

    HeaderLayout = require('./header.js'),
    PopupsLayout = require('./popups.js'),

    Stores = require('../stores'),

    Formatter = require('../formatter.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),
    Router = require('shore').Router,

    Util = require('shore').Util,

    /**
     * The root element on the Course
     * page.
     * 
     * @module Layout
     * @submodule Course
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
                        <Dashboard />
                    </div>
                    
                </div>
            );
        },


        onChange: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.CourseStore().on(Constants.Event.DID_CHANGE_ENROLLMENT, this.onChange);
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.CourseStore().removeListener(Constants.Event.DID_CHANGE_ENROLLMENT, this.onChange);
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);
        }


    }),


    /**
     * The dashboard under the header element
     * containing any other aside information
     * for the course.
     *
     * @module Layout
     * @submodule Course
     * @class Dashboard
     */
    Dashboard = React.createClass({
        
        render: function() {
            return (
                <div className="dashboard">
                    <div className="dashboard__content">
                        <div className="pure-g course-dashboard">
                            <div className="pure-u-1 pure-u-md-2-5 pure-u-lg-1-3 course-dashboard__summary">
                                <div className="course-dashboard__summary__content">
                                    <div className="course-dashboard__summary__content__banner" />
                                </div>
                            </div>
                            <div className="pure-u-1 pure-u-md-3-5 pure-u-lg-2-3 course-dashboard__options pure-g">

                            </div>
                        </div>
                    </div>
                </div>
            );
        }


    }),


    /**
     * A box containing basic information
     * of the course.
     *
     * @module Layout
     * @submodule Course
     * @class Summary
     */
    Summary = React.createClass({

        render: function() {

            return (
                <div className="course-summary">
                    <div className="course-summary__banner"></div>
                    <h1 className="course-summary__code">CS 101</h1>
                    <p className="course-summary__name">Introduction to Computer Science</p>
                    <div className="divide"></div>
                    <ul className="course-summary__stats">
                        <li className="course-summary__stats__item">12 enrolled</li>
                    </ul>
                </div>
            );
        },


        onChange: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().on(Constants.Event.DID_FETCH_EXAMS, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_FETCH_EXAMS, this.onChange);
        }


    }),


    /**
     * The enroll button allowing a user to enroll in a
     * course.
     *
     * @module Layout
     * @submodule Course
     * @class EnrollButton
     */
    EnrollButton = React.createClass({

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
            Action.send(Constants.Action.ENROLL_CURRENT_USER, { courseId: Stores.CourseStore().current().id });
        }


    }),


    /**
     * The unenroll button allowing a user to unenroll
     * from a course.
     *
     * @module Layout
     * @submodule Course
     * @class UnenrollButton
     */
    UnenrollButton = React.createClass({

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
            Action.send(Constants.Action.UNENROLL_CURRENT_USER, { courseId: Stores.CourseStore().current().id });
        }


    }),


    /**
     * The main content for the course page.
     *
     * @module Layout
     * @submodule Course
     * @class Content
     */
    Content = React.createClass({

        render: function() {
            return (
                <div className="content course-content">
                </div>
            );
        }


    }),


    /**
     * The element containing the main content for the course
     * page.
     *
     * @module Layout
     * @submodule Course
     * @class Body
     */
    Body = React.createClass({

        render: function() {
            // If there is a current exam, present
            // the current exam, otherwise, present
            // the "No Exam" element.
            if (Stores.ExamStore().current()) {
                return (
                    <div className="content__body">
                        <Body_Exam />
                    </div>
                )}
            else {
                return (
                    <div className="content__body">
                        <Body_Default />
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
            Stores.ExamStore().on(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.PageStore().on(Constants.Event.DID_LOAD_EXAM, this.didLoadExam);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.PageStore().removeListener(Constants.Event.DID_LOAD_EXAM, this.didLoadExam);
        }


    }),


    /**
     * The default content that is shown by the body element.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Default
     */
    Body_Default = React.createClass({

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
        }

    }),


    /**
     * The exam content that is shown inside the body element
     * of the course page.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam
     */
    Body_Exam = React.createClass({
        
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
                        <Body_Exam_QuestionList />
                    </div>
                </div>
            );
        },


        onClickTakeExam: function(event) {
            Router.path("/course/<courseId>/exam/<examId>/take",
                        { examId: Stores.ExamStore().current().id,
                          courseId: Stores.CourseStore().current().id });
        }


    }),


    /**
     * The list of questions that the user created, displayed inside
     * the Body_Exam element.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList
     */
    Body_Exam_QuestionList = React.createClass({

        render: function() {
            var questions = Stores.ExamStore().questionsForExam(Stores.ExamStore().current(),
                                                                Stores.UserStore().current()),
                listItems;

            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_QUESTION) {
                // In create question mode, set the first element
                // as a new question form..
                listItems = [<Body_Exam_QuestionList_MultiChoiceEditing key="new" />];
            }
            else {
                listItems = [];
            }

            questions.forEach(function(question) {
                // Check if we are editing this question.
                if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION &&
                    Stores.PageStore().currentPayload().questionId === question.id) {

                    listItems.push(<Body_Exam_QuestionList_MultiChoiceEditing
                                                                key="new"
                                                                question={ question } />);
                }
                else {
                    listItems.push(<Body_Exam_QuestionList_MultiChoice
                                                                key={ question.id }
                                                                question={ question } />);
                }
            });

            return (
                <div className="exam-info__my-questions">
                    <span className="exam-info__my-questions__title">My Questions</span>
                    <Body_Exam_QuestionList_AddButton />
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
            Stores.ExamStore().on(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().on(Constants.Event.DID_CREATE_QUESTION, this.didCreateQuestion);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().removeListener(Constants.Event.DID_CREATE_QUESTION, this.didCreateQuestion);
        }


    }),


    /**
     * The add button in the question list, allowing users to create
     * new questions.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_AddButton
     */
    Body_Exam_QuestionList_AddButton = React.createClass({

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
            Action.send(Constants.Action.TO_MODE_CREATE_QUESTION, { examId: Stores.ExamStore().current().id });
        },


        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
        }


    }),


    /**
     * A list item in the question list of an exam. This represents
     * a question that is a multiple choice question.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice.
     * @private
     */
    Body_Exam_QuestionList_MultiChoice = React.createClass({

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
                            <Body_Exam_QuestionList_MultiChoice_Option question={ question } />
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
                            <Body_Exam_QuestionList_MultiChoice_Option question={ question } />
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
            Action.send(Constants.Action.TO_MODE_EDIT_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        },


        onDelete: function(event) {
            Action.send(Constants.Action.TO_MODE_DELETE_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        }


    }),


    /**
     * A multiple choice item in an exam's question list. This is for
     * multiple choice questions that are being edited.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing = React.createClass({

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
                        <Body_Exam_QuestionList_MultiChoiceEditing_Option
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
                Action.send(Constants.Action.CREATE_QUESTION,
                        {
                            questionMap: map
                        });
            }
            // Assume the current mode is the QUESTION_EDIT
            // mode.
            else {
                // TODO: Modify so that examId is
                // inside the questionMap.
                Action.send(Constants.Action.EDIT_QUESTION,
                        {
                            questionMap: this.state.questionMap
                        });
            }
            
        },


        onClickCancel: function() {
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION) {
                Action.send(Constants.Action.FROM_MODE_EDIT_QUESTION);
            }
            else {
                Action.send(Constants.Action.FROM_MODE_CREATE_QUESTION);
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
        }

        
    }),


    /**
     * A multiple choice option for a question in an exam.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice_Option
     * @private
     */
    Body_Exam_QuestionList_MultiChoice_Option = React.createClass({

        render: function() {
            var question = this.props.question,
                listItems = question.getOptions().map(function(option, index) {
                    var isCorrect = question.isCorrect(option);
                    return <Body_Exam_QuestionList_MultiChoice_Option_Item
                                                        key={ index }
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


    /**
     * A multiple choice item in the list of questions that a
     * user has created. This element will allow the user to
     * edit the multiple choice option.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing_Option
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing_Option = React.createClass({

        render: function() {
            var self = this,
                name = 'multichoice-' + this.props.questionId,
                listItems = this.props.options.map(function(option, index) {
                    var isCorrect = self.isCorrect(option),
                        key = self.props.questionId + '-' + index.toString();
                    // TODO: Shorten this line.
                    return <Body_Exam_QuestionList_MultiChoiceEditing_Option_Item
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


    /**
     *  A single multiple choice option for a question.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice_Option_Item
     * @private
     */
    Body_Exam_QuestionList_MultiChoice_Option_Item = React.createClass({

        render: function() {
            var questionClass = (this.props.isCorrect) ?
                                "multi-choice__item--correct" :
                                "multi-choice__item",
                option = this.props.option;

            return <li className={ questionClass }>{ option }</li>;
        }

    }),


    /**
     *  A single multiple choice option for a question. This sets the
     *  mutliple choice option so that it can be edited.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing_Option_Item
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing_Option_Item = React.createClass({

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


module.exports = {
    Root: Root
};

