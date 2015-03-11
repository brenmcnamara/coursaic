/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    ComponentsLayout = require('./components.js'),
    headerLayout = require('./header.js'),

    Stores = require('../stores'),
    ExamRunStore = Stores.ExamRunStore(),

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
                score = examRun.get('numCorrect') / examRun.get('numOfQuestions');

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
            var score = this.props.score * 100;
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
            return (
                <button className="pure-button blue-button large-button">
                    Back to CS 101
                </button>
            );
        }

    }),


    Section_ExamResults = React.createClass({

        render: function () {
            return (
                <SectionSet.Section>
                    <ul className="question-info-list">
                        <QuestionItem_Incorrect />
                        <QuestionItem_Incorrect />
                        <QuestionItem_Correct />
                        <QuestionItem_Incorrect />
                        <QuestionItem_Correct />
                        <QuestionItem_Correct />
                    </ul>
                </SectionSet.Section>
            );
        }

    }),


    /**
     * A single mutliple choice solution to the results
     * of an exam
     */
    QuestionItem_Correct = React.createClass({

        render: function() {
            return (
                <li>
                    <div className="question-item">
                        <div className="question-item__icon-set--1">
                            <div className="question-item__icon-set__item--good">
                                <i className="fa fa-check" />
                            </div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo />
                        </div>
                    </div>
                </li>
            );
        }

    }),

    
    QuestionItem_Incorrect = React.createClass({

        render: function () {
            return (
                <li>
                    <div className="question-item">
                        <div className="question-item__icon-set--1">
                            <div className="question-item__icon-set__item--bad">
                                <i className="fa fa-times" />
                            </div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo />
                        </div>
                    </div>
                </li>
            );
        }

    }),


    QuestionInfo = React.createClass({

        render: function () {
            return (
                <div className="question-info">
                    <div className="question-info__ask">What is 2 + 2?</div>
                    <ul className="multi-choice-info__options-list--lettered">
                        <MultiChoiceItem_OptionItem>22</MultiChoiceItem_OptionItem>
                        <MultiChoiceItem_OptionItem>25</MultiChoiceItem_OptionItem>
                        <MultiChoiceItem_OptionItem_Correct>4</MultiChoiceItem_OptionItem_Correct>
                        <MultiChoiceItem_OptionItem_Incorrect>12</MultiChoiceItem_OptionItem_Incorrect>                                                                                    
                    </ul>
                    <div className="question-info__explanation">
                        Just because!!
                    </div>
                </div>
            );
        }

    }),


    /**
     * A single multiple choice item for a multiple choice
     * question in the results of taking an exam.
     */
    MultiChoiceItem_OptionItem = React.createClass({

        render: function() {
            return (
                <li className="multi-choice-info__options-list__item">{ this.props.children }</li>
            );
        }

    }),

    /**
     * A single multiple choice option that is styled to be correct.
     */
    MultiChoiceItem_OptionItem_Correct = React.createClass({

        render: function () {
            return (
                <li className="multi-choice-info__options-list__item--correct">{ this.props.children }</li>
            );
        }

    }),


    /**
     * A single multiple choice option that is styled to be incorrect.
     */
    MultiChoiceItem_OptionItem_Incorrect = React.createClass({

        render: function () {
            return (
                <li className="multi-choice-info__options-list__item--incorrect">{ this.props.children }</li>
            );
        }

    });


module.exports = {
    Root: Root
};
