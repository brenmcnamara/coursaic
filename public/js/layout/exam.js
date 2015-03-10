/** @jsx React.DOM */


var React = require('react'),
    
    Stores = require('../stores'),
    ExamRunStore = Stores.ExamRunStore(),
    FlagStore = Stores.FlagStore(),
    UserStore = Stores.UserStore(),

    HeaderLayout = require('./header.js'),
    ComponentsLayout = require('./components.js'),
    PopupsLayout = require('./popups.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),
    Router = require('shore').Router,

    Formatter = require('../formatter.js'),

    Util = require('shore').Util,

    Dashboard = ComponentsLayout.Dashboard,

    SectionSet = ComponentsLayout.SectionSet,

    /*
     * The root element of the exam page.
     *
     * @module Layout
     * @submodule Exam
     * @class Root
     */
    Root = React.createClass({

        getInitialState: function () {
            return { timeInSeconds: 0 };
        },

        render: function() {
            var examRun = ExamRunStore.query().currentExamRun().getOne();

            return (
                <div className="main">
                    <HeaderLayout.Header />
                    <Timer time={ Formatter.Time.format(this.state.timeInSeconds) } />
                    <div className="content-wrapper">
                        <ExamDashboard examRun={ examRun } />
                        <Section_ExamForm examRun={ examRun } />
                    </div>
                </div>
            );
        },

        componentWillMount: function() {
            // Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
        },

        componentDidMount: function () {
            // Create the timer.
            var self = this,

            timerId = setInterval(function () {
                self.setState({ timeInSeconds: self.state.timeInSeconds + 1 });
            }, 1000);

            ExamRunStore.on(Constants.Event.UPDATED_EXAM_RUN,
                            this.onUpdatedExamRun);

            this.setState({ timerId: timerId });
        },

        componentWillUnmount: function() {
            clearInterval(this.state.timerId);
            ExamRunStore.removeListener(Constants.Event.UPDATED_EXAM_RUN,
                                        this.onUpdatedExamRun);
            // Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);        
        },

        onChange: function(event) {
            this.forceUpdate();
        },

        onUpdatedExamRun: function () {
            this.forceUpdate();
        },

    }),


    Timer = React.createClass({

        getInitialState: function () {
            return { show: true };
        },

        render: function () {
            var timerClass = (this.state.show) ? "timer" : "timer--hide"
            return (
                <div className={ timerClass }>
                    <div className="timer__button"
                         onClick={ this.onClickTimerButton } >
                        <i className="fa fa-expand"></i>
                    </div>
                    <div className="timer__time"
                         onClick={ this.onClickTimerText } >
                        { this.props.time }
                    </div>
                </div>
            );
        },

        onClickTimerButton: function () {
            this.setState({ show: true});
        },

        onClickTimerText: function () {
            this.setState({ show: false });
        }
    
    }),


    ExamDashboard = React.createClass({

        render: function () {
            var examRun = this.props.examRun;

            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>Practice Exam</Dashboard.Summary.Header>
                        <Dashboard.Summary.Subheader>
                            { examRun.getQuestions().length } questions
                        </Dashboard.Summary.Subheader>
                    </Dashboard.Summary>
                </Dashboard>
            );
        }

    }),


    /**
     * The form of questions that the user
     * interacts with to take an exam.
     *
     * @module Layout
     * @submodule Exam
     * @class ExamForm
     * @private
     */
    Section_ExamForm = React.createClass({

        getInitialState: function() {
            return { guesses: {} };
        },

        render: function() {
            var examRun = this.props.examRun;
            return (
                <SectionSet>
                    <SectionSet.Section>
                        <div className="exam">
                            <ExamForm_QuestionList examRun={ examRun } onChange={ this.onChangeQuestion } />
                            <ExamForm_Buttons onSubmit={ this.onSubmit } />
                        </div>
                    </SectionSet.Section>
                </SectionSet>
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
            var examRun = this.props.examRun;

            return (
                <ul className="question-info-list">
                    { examRun.getQuestions().reduce(function (list, question, index) {
                        return list.concat([
                            <ExamForm_QuestionList_MultiChoice key={"question-" + index }
                                                               question={ question }
                                                               index={ index }
                                                               onChangeItem={ this.onChangeItem } />,
                            <li key={ "divide-" + index }><ComponentsLayout.Divide /></li>
                        ]);
                    }.bind(this), []) }
                </ul>
            );
        },

        onChange: function (event) {
            this.forceUpdate();
        },

        onChangeQuestion: function (event, index) {
            this.props.onChange(event, index);
        },

        onChangeItem: function (event, index) {
            // TODO: IMPLEMENT ME!
            console.log("Item at index: " + index + " was changed!");
        },


    }),


    /**
     * A multiple choice question for an exam.
     */
    ExamForm_QuestionList_MultiChoice = React.createClass({

        render: function() {
            var
                question = this.props.question,
                user = UserStore.query().currentUser().getOne(),
                // This will be null if the user has
                // not flagged this question.
                userFlag = FlagStore.query().flagsForQuestion(question).flagsForUser(user).getOne(),

                renderFlagElement = (userFlag) ?
                    (<ExamForm_QuestionList_MultiChoice_AlreadyFlagged />) :
                    (<ExamForm_QuestionList_MultiChoice_FlagOptions onFlag={ this.onFlag }
                                                                    question={ question } />),

                renderFlagActionList;

            if (userFlag && ExamRunStore.hasBackupQuestions()) {
                // Backup questions available.
                renderFlagActionList = (
                    <ul className="question-flag__action-list">
                        <li className="inline-button"
                            onClick={ this.onClickSwapQuestion } >Swap this question for another question.</li>
                        <li className="inline-button"
                            onClick={ this.onClickRemoveQuestion } >Remove this question.</li>
                    </ul>
                );
            } 
            else if (userFlag) {
                // No backup questions available.
                renderFlagActionList = (
                    <ul className="question-flag__action-list">
                        <li className="inline-button"
                            onClick={ this.onClickRemoveQuestion } >Remove this question.</li>
                    </ul>
                );
            }
            else {
                renderFlagActionList = null;
            }

            return (
                <li className="pure-g">
                    <div className="question-info pure-u-1 pure-u-md-1-2">
                        <div className="question-info__ask">
                            <span>{ this.props.index + 1 }.</span> { question.get('ask') }
                        </div>
                        <ul className="multi-choice-info__options-list">
                            { question.getOptions().map(function (option, index) {
                                return (
                                    <ExamForm_Question_MultiChoice_Item key={ question.id + "-option-" + index }
                                                                        question={ question }
                                                                        option={ option }
                                                                        onChangeItem={ this.onChangeItem } />
                                );
                              }.bind(this))
                            }
                        </ul>

                    </div>
                    
                    <div className="question-flag pure-u-1 pure-u-md-1-2">
                        { renderFlagElement }
                        { renderFlagActionList }
                    </div>

                </li>
            );
        },

        componentDidMount: function () {
            FlagStore.on(Constants.Event.FLAGGED_QUESTION, this.onFlaggedQuestion);
        },

        componentWillUnmount: function () {
            FlagStore.removeListener(Constants.Event.FLAGGED_QUESTION, this.onFlaggedQuestion);
        },

        onChangeItem: function (event) {
            this.props.onChangeItem(event, this.props.index);
        },

        onClickRemoveQuestion: function (event) {
            Action(Constants.Action.REMOVE_EXAM_RUN_QUESTION, {
                questionIndex: this.props.index
            }).send();
        },

        onClickSwapQuestion: function (event) {
            Action(Constants.Action.SWAP_EXAM_RUN_QUESTION, {
                questionIndex: this.props.index
            }).send();
        },

        // TODO: Swap order of parameters!
        onFlag: function (flagType, event) {
            Action(Constants.Action.FLAG_QUESTION,
                   {
                        questionId: this.props.question.id,
                        flagType: flagType
                    }).send();
        },

        onFlaggedQuestion: function (event) {
            this.forceUpdate();
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
                questionId = this.props.question.id;

            return (
                <li className="multi-choice-info__options-list__item">
                    <input type="radio" onChange={ this.onChange }
                                        name={ questionId }
                                        value={ option } />{ option }
                </li>
            );
        },

        onChange: function(event) {
            this.props.onChangeItem(event);
        }

    }),


    /**
     * An element informing the user that a question is already flagged.
     */
    ExamForm_QuestionList_MultiChoice_AlreadyFlagged = React.createClass({

        render: function () {
            return (
                <div>
                    <div className="question-flag__button--disabled">
                        <i className="fa fa-flag-o"></i>You have flagged this question
                    </div>
                </div>
            );
        }

    }),


    /**
     * An element to flag a particular question.
     */
    ExamForm_QuestionList_MultiChoice_FlagOptions = React.createClass({

        getInitialState: function () {
            return { showFlagOptions: false };
        },

        render: function () {
            var flagOptionsClass = 
                ((this.state.showFlagOptions) ? "popover question-flag__options-list":
                                                "popover--hide question-flag__options-list");

            return (
                <div className="popover-wrapper"
                     onClick={ this.onClickFlagButton } >

                    <div className="popover-target question-flag__button">
                        <i className="fa fa-flag"></i>Flag this question.
                    </div>
                    <ul className={ flagOptionsClass } >
                        <li onClick={ this.onFlagQuestion(Constants.FlagType.NOT_RELEVANT) }>
                            Not relevant to the material
                        </li>
                        <li onClick={ this.onFlagQuestion(Constants.FlagType.NONSENSE) }>
                            Does not make sense
                        </li>
                        <li onClick={ this.onFlagQuestion(Constants.FlagType.REPEATED_QUESTION) }>
                            Similar to another question I have seen
                        </li>
                        <li onClick={ this.onFlagQuestion(Constants.FlagType.OUTDATED) }>
                            The question is outdated.
                        </li>
                    </ul>
                </div>
            );

        },

        onClickFlagButton: function (event) {
            // Toggle the show flag options element.
            this.setState({ showFlagOptions: !this.state.showFlagOptions });
        },

        onFlagQuestion: function (flagType) {
            // Curried function.
            return function (event) {
                this.props.onFlag(flagType, event);
            }.bind(this);
        },

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
                <div className="pure-g">
                    <div className="exam-button-wrapper pure-u-1 pure-u-md-1-2">
                        <button type="button" className="pure-button blue-button">Submit</button>
                    </div>

                    <div className="exam-button-wrapper pure-u-1 pure-u-md-1-2">
                        <button onClick={ this.onClickCancel }
                                type="button" className="pure-button">
                            Cancel
                        </button>
                    </div>

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
