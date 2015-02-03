/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    ComponentsLayout = require('./components.js'),
    headerLayout = require('./header.js'),

    Dashboard = ComponentsLayout.Dashboard,

    SectionSet = ComponentsLayout.SectionSet,

    Root = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <headerLayout.Header />
                    <div className="content-wrapper">
                        <ResultDashboard />
                        <SectionSet>
                            <Section_ExamResults />
                        </SectionSet>
                    </div>
                </div>
            );
        }

    }),


    ResultDashboard = React.createClass({

        render: function () {

            return (
                <Dashboard>

                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>Wow, You Suck!</Dashboard.Summary.Header>
                        <Dashboard.Summary.Subheader>
                            <span className="exam-score--bad">Overall Score: 43%</span>
                        </Dashboard.Summary.Subheader>
                    </Dashboard.Summary>

                    <Dashboard.Buttons>
                        <BackToCourseButton />
                    </Dashboard.Buttons>

                </Dashboard>
            );
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
                            <div className="question-item__icon-set__item--safe">
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
                            <div className="question-item__icon-set__item--danger">
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
