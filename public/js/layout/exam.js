/** @jsx React.DOM */


var React = require('react'),
    
    Stores = require('../stores'),

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
            return (
                <div className="main">
                    <HeaderLayout.Header />
                    <Timer time={ Formatter.Time.format(this.state.timeInSeconds) } />
                    <div className="content-wrapper">
                        <ExamDashboard />
                        <Section_ExamForm />
                    </div>
                </div>
            );
        },

        onChange: function(event) {
            this.forceUpdate();
        },

        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
        },

        componentDidMount: function () {
            // Create the timer.
            var self = this,

            timerId = setInterval(function () {
                self.setState({ timeInSeconds: self.state.timeInSeconds + 1 });
            }, 1000);

            this.setState({ timerId: timerId });
        },

        componentWillUnmount: function() {
            clearInterval(this.state.timerId);
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);        
        }

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
            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>Practice Exam</Dashboard.Summary.Header>
                        <Dashboard.Summary.Subheader>
                            25 questions and 4 topics.
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
            return (
                <SectionSet>
                    <SectionSet.Section>
                        <div className="exam">
                            <ExamForm_QuestionList onChange={ this.onChangeQuestion } />
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
            return (
                <ul className="question-info-list">
                    <ExamForm_QuestionList_MultiChoice index={ 1 } />
                    <li><ComponentsLayout.Divide /></li>
                    <ExamForm_QuestionList_MultiChoice index={ 2 } />
                    <li><ComponentsLayout.Divide /></li>
                    <ExamForm_QuestionList_MultiChoice index={ 3 } />
                    <li><ComponentsLayout.Divide /></li>
                    <ExamForm_QuestionList_MultiChoice index={ 4 } />
                    <li><ComponentsLayout.Divide /></li>
                </ul>
            );
        },

        onChange: function(event) {
            this.forceUpdate();
        },

        onChangeQuestion: function(event, index) {
            this.props.onChange(event, index);
        },

    }),


    /**
     * A multiple choice question for an exam.
     */
    ExamForm_QuestionList_MultiChoice = React.createClass({

        getInitialState: function () {
            return { showFlagOptions: false };
        },

        render: function() {
            var flagOptionsClass = 
                ((this.state.showFlagOptions) ? "popover question-flag__options-list":
                                                "popover--hide question-flag__options-list");

            return (
                <li className="pure-g">
                    <div className="question-info pure-u-1 pure-u-md-1-2">
                        <div className="question-info__ask">
                            <span>{ this.props.index }.</span> What is 2 + 2?
                        </div>
                        <ul className="multi-choice-info__options-list">
                            <ExamForm_Question_MultiChoice_Item />
                            <ExamForm_Question_MultiChoice_Item />
                            <ExamForm_Question_MultiChoice_Item />
                            <ExamForm_Question_MultiChoice_Item /> 
                        </ul>
                    </div>
                    <div className="question-flag pure-u-1 pure-u-md-1-2">
                        <div className="popover-wrapper question-flag__button"
                             onClick={ this.onClickFlagButton } >

                            <div className="popover-target question-flag__button">
                                <i className="fa fa-flag"></i>Flag this question.
                            </div>
                            <ul className={ flagOptionsClass } >
                                <li>Not relevant to the material</li>
                                <li>Does not make sense</li>
                                <li>Similar to another question I have seen</li>
                            </ul>
                        </div>
                            
                        <ul className="question-flag__action-list">
                            <li className="inline-button">Swap this question for another question.</li>
                            <li className="inline-button">Remove this question.</li>
                        </ul>
                    </div>
                </li>
            );
        },

        onClickFlagButton: function (event) {
            // Toggle the show flag options element.
            this.setState({ showFlagOptions: !this.state.showFlagOptions });
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
                <li className="multi-choice-info__options-list__item">
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
