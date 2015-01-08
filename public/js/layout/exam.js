/** @jsx React.DOM */


var React = require('react'),
    
    Stores = require('../stores'),

    HeaderLayout = require('./header.js'),
    WidgetsLayout = require('./widgets.js'),
    PopupsLayout = require('./popups.js'),

    Action = require('../flex-node').Action,
    Constants = require('../constants.js'),
    Router = require('../flex-node').Router,

    Util = require('../flex-node').Util,

    /*
     * The root element of the exam page.
     *
     * @module Layout
     * @submodule Exam
     * @class Root
     */
    Root = React.createClass({

        render: function() {
            var cancelExamPopup;
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.VIEW_EXAM_RESULTS) {
                return (
                    <div className="main">
                        <HeaderLayout.Header isOpaque={ false } />
                        <HeaderLayout.HeaderFill isOpaque={ false } />
                        <BackButton />
                        <ExamResults />
                    </div>
                );
            }
            else {
                cancelExamPopup = (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CANCEL_EXAM_RUN) ?
                                  (<PopupsLayout.CancelExamRun />) :
                                  (null);
                return (
                    <div className="main">
                        { cancelExamPopup }
                        <HeaderLayout.Header isOpaque={ false } />
                        <HeaderLayout.HeaderFill isOpaque={ false } />
                        <ExamForm />
                    </div>
                );  
            }
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
                <button onClick={ this.onClick }
                        type="button"
                        className="exam-result-back button">
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
                    <h1 className="exam__title">{ exam.get('name') }</h1>
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
            var examRun = Stores.ExamStore().currentExamRun(),
                // TODO: Add some formatter for this.
                percentage = Math.floor(examRun.grade() * 100);

            return (
                <div className="exam-run-results__score">
                    You scored <span className="exam-run-results__score__percent">{ percentage }%</span>
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
            var examRun = Stores.ExamStore().currentExamRun(),
                solutions = examRun.questions().map(function(question, index) {
                    var guess = examRun.guessAtIndex(index),
                        key = question.id + "-" + index.toString();
                    return <ExamResults_SolutionList_MultiChoice   question={ question }
                                                                   guess={ guess }
                                                                   key={ key } />;
                });

            return (
                <ul className="exam-run-results__list">{ solutions }</ul>
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
            var self = this,
                question = this.props.question,
                options = question.getOptions().map(function(option, index) {
                    var key = question.id + "-option-" + index.toString();
                    if (question.isCorrect(option)) {
                        return <ExamResults_SolutionList_MultiChoice_Item key={ key }
                                                                          option={ option }
                                                                          isCorrect={ true } />;
                    }
                    else if (option === self.props.guess) {
                        return <ExamResults_SolutionList_MultiChoice_Item  key={ key }
                                                                           isIncorrect={ true }
                                                                           option={ option } />; 
                    }
                    else {
                        return <ExamResults_SolutionList_MultiChoice_Item  key={ key }
                                                                           option={ option } />
                    }
                });
            return (
                <li className="solution-item--multi-choice">
                    <div className="solution-item__question">{ question.get('question') }</div>
                    <ul className="solution-item--multi-choice__options">
                        { options }
                    </ul>
                    <div className="solution-item__explanation">
                        <span>Explanation:</span>
                        <span> { question.get('explanation') }</span>
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
            var itemType;
            if (this.props.isIncorrect) {
                itemType = "solution-item--multi-choice__options__item--incorrect";
            }
            else if (this.props.isCorrect) {

                itemType = "solution-item--multi-choice__options__item--correct";
            }
            else {
                itemType = "solution-item--multi-choice__options__item";
            }
            return (
                <li className={ itemType }>{ this.props.option }</li>
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
                <div className="exam">
                    <h1 className="exam__title">{ exam.get('name') }</h1>
                    <WidgetsLayout.DivideFull />
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
            Action.send(Constants.Action.SUBMIT_EXAM_RUN, { guesses: this.state.guesses });
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
            var self = this,
                examRun = Stores.ExamStore().currentExamRun(),
                questionList;

            if (examRun) {
                questionList = examRun.questions().map(function(question, index) {
                        var key = "ExamQuestion-" + question.id;
                        return <ExamForm_QuestionList_MultiChoice
                                                onChange={ self.onChangeQuestion }
                                                index={ index }
                                                question={ question }
                                                key={ key } />
                    });
                return (
                    <ul className="exam__question-list">
                        { questionList }
                    </ul>
                );           
            }
            return null;
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
            var self = this,
                question = this.props.question,
                options = question.getOptions(),
                optionList = options.map(function(option, index) {
                    var key = question.id + "-option-" + index.toString(),
                        name = question.id;
                    return <ExamForm_Question_MultiChoice_Item onChangeItem={ self.onChangeItem }
                                                               option={ option }
                                                               key={ key }
                                                               name={ name } />;
                });

            return (
                <li className="question-item--multi-choice">
                    <div className="question-item__question">{ question.get('question') }</div>
                    <ul className="question-item--multi-choice__options">
                        { optionList }
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
                                        name={ name }
                                        value={ option } />{ option }
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
                    <button onClick={ this.props.onSubmit }
                            type="button" className="button">Submit</button>
                    <button onClick={ this.onClickCancel } type="button" className="button">
                        Cancel
                    </button>
                </div>
            );
        },


        onClickCancel: function() {
            Action.send(Constants.Action.TO_MODE_CANCEL_EXAM_RUN, { examId: Stores.ExamStore().current().id });
        }


    });


module.exports = {
    Root: Root
};
