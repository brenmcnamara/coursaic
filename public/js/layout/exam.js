/** @jsx React.DOM */


var React = require('react'),
    
    Stores = require('../stores'),
    ExamRunStore = Stores.ExamRunStore(),
    PageStore = Stores.PageStore(),

    ComponentsLayout = require('./components.js'),
    HeaderLayout = require('./header.js'),
    PopupsLayout = require('./popups.js'),
    QuestionLayout = require('./questions.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),

    Request = require('../request'),

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
            var examRun = ExamRunStore.query().currentExamRun().getOne(),
                numOfQuestions = examRun.getQuestions().length;

            return { 
                timeInSeconds: 0,
                examRunSubmission: Request.CreateExamSubmission({ numOfQuestions: numOfQuestions })
            };
        },

        render: function() {
            var examRun = ExamRunStore.query().currentExamRun().getOne();

            return (
                <div className="main">
                    <HeaderLayout.Header />
                    <Timer time={ Formatter.Time.format(this.state.timeInSeconds) } />
                    <div className="content-wrapper">
                        <ExamDashboard examRun={ examRun } />
                        <Section_ExamForm examRun={ examRun }
                                          examRunSubmission={ this.state.examRunSubmission }
                                          onSubmit={ this.onSubmit } />
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

        onSubmit: function (event) {
            this.state.examRunSubmission.setTime(this.state.timeInSeconds);
            Action(Constants.Action.LOAD_RESULTS, { examRunSubmission: this.state.examRunSubmission })
                .route("/course/<courseId>/exam/results", { courseId: PageStore.courseId() })
                .send();
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
        },
    
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
                            <QuestionLayout.ExamQuestionList examRun={ examRun } onChange={ this.onChangeQuestion }
                                                             examRunSubmission={ this.props.examRunSubmission } />
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
            this.props.onSubmit(event);
            // Action.send(Constants.Action.SUBMIT_EXAM_RUN, { guesses: this.state.guesses });
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
                        <button onClick={ this.props.onSubmit }
                                type="button" className="pure-button blue-button">
                            Submit
                        </button>
                    </div>

                    <div className="exam-button-wrapper pure-u-1 pure-u-md-1-2">
                        <button onClick={ this.props.onCancel }
                                type="button" className="pure-button">
                            Cancel
                        </button>
                    </div>

                </div>
            );
        }

    });


module.exports = {
    Root: Root
};
