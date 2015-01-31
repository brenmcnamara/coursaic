/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    widgetsLayout = require('./widgets.js'),
    headerLayout = require('./header.js'),

    Dashboard = widgetsLayout.Dashboard,

    Root = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <headerLayout.Header />
                    <div className="content-wrapper">
                        <ResultDashboard />
                        <Section_ExamResults />
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
                        <Dashboard.Summary.Header>Results</Dashboard.Summary.Header>
                    </Dashboard.Summary>
                </Dashboard>
            );
        }

    }),


    Section_ExamResults = React.createClass({

        render: function () {
            return (
                <section className="section">
                    <ExamScore />
                    <widgetsLayout.DivideFull />
                    <ExamResults />
                </section>
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
    ExamResults = React.createClass({

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
                    <div className="question-info">
                        <div className="question-info__ask">What is 2 + 2?</div>
                        <ul className="multi-choice-info__options-list--lettered">
                            <ExamResults_SolutionList_MultiChoice_Item />
                            <ExamResults_SolutionList_MultiChoice_Item />
                            <ExamResults_SolutionList_MultiChoice_Item />
                            <ExamResults_SolutionList_MultiChoice_Item />
                        </ul>
                        <div className="question-info__explanation">
                            Just because!!
                        </div>
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
                <li className="multi-choice-info__options-list__item">37</li>
            );
        }

    });;


module.exports = {
    Root: Root
};
