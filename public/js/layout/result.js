/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    ComponentsLayout = require('./components.js'),

    headerLayout = require('./header.js'),
    QuestionLayout = require('./questions.js'),

    Action = require('shore').Action,

    Stores = require('../stores'),
    CourseStore = Stores.CourseStore(),
    ExamRunStore = Stores.ExamRunStore(),
    PageStore = Stores.PageStore(),

    Dashboard = ComponentsLayout.Dashboard,

    SectionSet = ComponentsLayout.SectionSet,

    Formatter = require('../formatter.js'),

    Root = React.createClass({

        render: function () {
            var examRun = ExamRunStore.query().currentExamRun().getOne();

            return (
                <div className="main">
                    <headerLayout.Header />
                    <div className="content-wrapper">
                        <ResultDashboard examRun={ examRun } />
                        <SectionSet>
                            <Section_ExamResults examRun={ examRun } />
                        </SectionSet>
                    </div>
                </div>
            );
        }

    }),


    ResultDashboard = React.createClass({

        render: function () {
            var examRun = this.props.examRun,
                score = examRun.get('numCorrect') / examRun.get('numOfQuestions') * 100;

            return (
                <Dashboard>

                    <Dashboard.Summary>
                        <Dashboard.Summary.Header><ScoreMessage score={ score } /></Dashboard.Summary.Header>
                        <Dashboard.Summary.Subheader>
                            <Score score={ score } />
                        </Dashboard.Summary.Subheader>
                    </Dashboard.Summary>

                    <Dashboard.Buttons>
                        <BackToCourseButton />
                    </Dashboard.Buttons>

                </Dashboard>
            );
        }

    }),


    ScoreMessage = React.createClass({

        render: function () {
            var score = this.props.score;

            if (score >= 90) {
                return (
                    <span>Awesome job!</span>
                );
            }
            else if (score >= 75) {
                return (
                    <span>Pretty Good!</span>
                );
            }
            else {
                return (
                    <span>Keep Improving</span>
                );
            }

        }

    }),


    Score = React.createClass({

        render: function () {
            var score = this.props.score;
            if (score  >= 90) {
                return (
                    <span className="exam-score--great">
                        Overall Score: { Formatter.Number.format(score, { placesAfterDecimal: 1 })}%
                    </span>
                );
            }
            else if (score >= 75) {
                return (
                    <span className="exam-score--good">
                        Overall Score: { Formatter.Number.format(score, { placesAfterDecimal: 1 })}%
                    </span>
                );
            }
            else {
                return (
                    <span className="exam-score--bad">
                        Overall Score: { Formatter.Number.format(score, { placesAfterDecimal: 1 })}%
                    </span>
                );
            }

        }

    }),


    BackToCourseButton = React.createClass({

        render: function () {
            var course = CourseStore.query().courseWithId(PageStore.courseId()).getOne();

            return (
                <button className="pure-button blue-button large-button"
                        onClick={ this.onClickBack } >
                    Back to { course.get('alias') }
                </button>
            );
        },

        onClickBack: function (event) {
            var courseId = PageStore.courseId();
            Action().route("/course/<courseId>", { courseId: courseId }).send();
        },

    }),


    Section_ExamResults = React.createClass({

        render: function () {
            var examRun = this.props.examRun;

            return (
                <SectionSet.Section>
                    <QuestionLayout.ResultsQuestionList examRun={ examRun } />
                </SectionSet.Section>
            );
        }

    });


module.exports = {
    Root: Root
};
