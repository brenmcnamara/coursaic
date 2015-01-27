/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    widgetsLayout = require('./widgets.js'),
    headerLayout = require('./header.js'),


    Root = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <headerLayout.Header />
                    <div className="content-wrapper">
                        <Dashboard />
                        <BackButton />
                        <ExamResults />
                    </div>
                    
                </div>
            );
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
            return (
                <div className="exam-run-results">
                    <h1 className="exam__title">Exam 1</h1>
                    <ExamScore />
                    <widgetsLayout.DivideFull />
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

    });;


module.exports = {
    Root: Root
};