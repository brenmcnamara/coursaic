/** @jsx React.DOM */


var React = require('react'),
    
    Stores = require('../stores'),

    HeaderLayout = require('./header.js'),
    WidgetsLayout = require('./widgets.js'),
    PopupsLayout = require('./popups.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),
    Router = require('shore').Router,

    Util = require('shore').Util,

    /*
     * The root element of the exam page.
     *
     * @module Layout
     * @submodule Exam
     * @class Root
     */
    Root = React.createClass({

        render: function() {
            /*
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.VIEW_EXAM_RESULTS) {
                return (
                    <div className="main">
                        <HeaderLayout.Header />
                        <BackButton />
                        <ExamResults />
                    </div>
                );
            }
            else {
                */
                return (
                    <div className="main">
                        <HeaderLayout.Header />
                        <Dashboard />
                        <ExamForm />
                    </div>
                );  
//            }
        },


        onChange: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
            Stores.ExamStore().on(Constants.Event.DID_GRADE_EXAM_RUN, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);        
            Stores.ExamStore().removeListener(Constants.Event.DID_GRADE_EXAM_RUN, this.onChange);
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
     * The back button that shows up on the exam page. Used to
     * navigate back to the course page.
     *
     * @module Layout
     * @submodule Exam
     * @class BackButton
     * @private
     */
    BackButton = React.createClass({

        render: function() {
            return (
                <button type="button"
                        className="exam-result-back pure-button blue-button">
                    Back to Course
                </button>
            );
        },


        onClick: function() {
            Router.path("/course/<courseId>/exam/<examId>",
                        {
                            courseId: Stores.CourseStore().current().id,
                            examId: Stores.ExamStore().current().id
                        });
        }


    }),


    /**
     * The results of taking an exam.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamResults
     * @private
     */
    ExamResults = React.createClass({

        render: function() {
            var exam = Stores.ExamStore().current();
            return (
                <div className="exam-run-results">
                    <h1 className="exam__title">Exam 1</h1>
                    <ExamScore />
                    <WidgetsLayout.DivideFull />
                    <ExamResults_SolutionList />
                </div>
            );
        }


    }),


    /**
     * The element showing the score the user got
     * on an exam.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamScore
     */
    ExamScore = React.createClass({

        render: function() {
            return (
                <div className="exam-run-results__score">
                    You scored <span className="exam-run-results__score__percent">87%</span>
                </div>
            );        
        }
       

    }),


    /**
     * The list of solution for the exam the user
     * has just taken.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamResults_SolutionList
     */
    ExamResults_SolutionList = React.createClass({

        render: function() {
            return (
                <ul className="exam-run-results__list">
                    <ExamResults_SolutionList_MultiChoice />
                </ul>
            );
        }


    }),


    /**
     * A single mutliple choice solution to the results
     * of an exam
     *
     * @module Layout
     * @submodule Exam
     * @class ExamResults_SolutionList_MultiChoice
     * @private
     */
    ExamResults_SolutionList_MultiChoice = React.createClass({

        render: function() {
            return (
                <li className="solution-item--multi-choice">
                    <div className="solution-item__question">What is 2 + 2?</div>
                    <ul className="solution-item--multi-choice__options">
                        <ExamResults_SolutionList_MultiChoice_Item />
                        <ExamResults_SolutionList_MultiChoice_Item />
                        <ExamResults_SolutionList_MultiChoice_Item />
                        <ExamResults_SolutionList_MultiChoice_Item />
                    </ul>
                    <div className="solution-item__explanation">
                        <span>Explanation:</span>
                        <span>Here is an explanation for why this solution is correct.</span>
                    </div>
                </li>
            );
        }


    }),


    /**
     * An single multiple choice item for a multiple choice
     * question in the results of taking an exam.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamResults_SolutionList_MultiChoice_Item
     * @private
     */
    ExamResults_SolutionList_MultiChoice_Item = React.createClass({

        render: function() {
            return (
                <li className="solution-item--multi-choice__options__item">37</li>
            );
        }


    });


    /**
     * The form of questions that the user
     * interacts with to take an exam.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm
     * @private
     */
    ExamForm = React.createClass({

        getInitialState: function() {
            return { guesses: {} };
        },


        render: function() {
            var exam = Stores.ExamStore().current();
            return (
                <div className="section exam">
                    <ExamForm_QuestionList onChange={ this.onChangeQuestion } />
                    <ExamForm_Buttons onSubmit={ this.onSubmit } />
                </div>
            );
        },


        onChangeQuestion: function(event, index) {
            var guesses = Util.copy(this.state.guesses);
            guesses[index] = event.target.value;
            this.setState({ guesses: guesses });
        },


        onSubmit: function(event) {
            // Action.send(Constants.Action.SUBMIT_EXAM_RUN, { guesses: this.state.guesses });
        }


    }),


    /**
     * The list of questions in the exam form.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm_Question_List
     * @private
     */
    ExamForm_QuestionList = React.createClass({

        render: function() {
            return (
                <ul className="exam__question-list">
                    <ExamForm_QuestionList_MultiChoice />
                    <ExamForm_QuestionList_MultiChoice />
                    <ExamForm_QuestionList_MultiChoice />
                    <ExamForm_QuestionList_MultiChoice />                                                                        
                </ul>
            );           
        },

      
        onChange: function(event) {
            this.forceUpdate();
        },


        onChangeQuestion: function(event, index) {
            this.props.onChange(event, index);
        },


        componentWillMount: function() {
            Stores.ExamStore().on(Constants.Event.DID_CREATE_EXAM_RUN, this.onChange);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_CREATE_EXAM_RUN, this.onChange);
        }


    }),


    /**
     * A multiple choice question in the exam form.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm_QuestionList_MultiChoice
     * @private
     */
    ExamForm_QuestionList_MultiChoice = React.createClass({

        render: function() {
            return (
                <li className="question-item--multi-choice">
                    <div className="question-item__question">What is 2 + 2?</div>
                    <ul className="question-item--multi-choice__options">
                        <ExamForm_Question_MultiChoice_Item />
                        <ExamForm_Question_MultiChoice_Item />
                        <ExamForm_Question_MultiChoice_Item />
                        <ExamForm_Question_MultiChoice_Item />
                    </ul>
                </li>
            );
        },


        onChangeItem: function(event) {
            this.props.onChange(event, this.props.index);
        }


    }),


    /**
     * A single option in a multiple choice question of an
     * exam that is in the the question list.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm_Question_MultiChoice_Item
     */
    ExamForm_Question_MultiChoice_Item = React.createClass({

        render: function() {
            var option = this.props.option,
                name = this.props.name;
            return (
                <li className="question-item--multi-choice__options__item">
                    <input type="radio" onChange={ this.onChange }
                                        name="question-here"
                                        value="37" />37
                </li>
            );
        },


        onChange: function(event) {
            this.props.onChangeItem(event);
        }


    }),


    /**
     * The set of buttons that the user can interact with at
     * the bottom of the exam form.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm_Buttons
     * @private
     */
    ExamForm_Buttons = React.createClass({

        render: function() {
            return (
                <div className="button-wrapper exam__button-wrapper">
                    <button type="button" className="pure-button blue-button">Submit</button>
                    <button onClick={ this.onClickCancel } type="button" className="pure-button">
                        Cancel
                    </button>
                </div>
            );
        },


        onClickCancel: function() {
           // Action.send(Constants.Action.TO_MODE_CANCEL_EXAM_RUN, { examId: Stores.ExamStore().current().id });
        }


    });


module.exports = {
    Root: Root
};
