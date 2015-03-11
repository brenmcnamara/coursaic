/**
 * result.js
 *
 * Layout for the results page.
 */

var
    React = require('react'),
    ComponentsLayout = require('./components.js'),
    headerLayout = require('./header.js'),

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
                    <ul className="question-info-list">
                        {
                            examRun.getQuestions().map(function (question, index) {
                                var guess = examRun.getGuesses()[index];
                                if (question.isCorrect(guess)) {
                                    return (
                                        <QuestionItem_Correct key={ "question-" + index }
                                                              question={ question } />
                                    );
                                }
                                // Not a correct guess.
                                return (
                                    <QuestionItem_Incorrect key={ "question-" + index }
                                                            question={ question }
                                                            guess={ guess } />
                                );
                            })
                        }
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
            var question = this.props.question;

            return (
                <li>
                    <div className="question-item">
                        <div className="question-item__icon-set--1">
                            <div className="question-item__icon-set__item--good">
                                <i className="fa fa-check" />
                            </div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo question={ question } />
                        </div>
                    </div>
                </li>
            );
        }

    }),

    
    QuestionItem_Incorrect = React.createClass({

        render: function () {
            var question = this.props.question,
                guess = this.props.guess;

            return (
                <li>
                    <div className="question-item">
                        <div className="question-item__icon-set--1">
                            <div className="question-item__icon-set__item--bad">
                                <i className="fa fa-times" />
                            </div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo question={ question } guess={ guess } />
                        </div>
                    </div>
                </li>
            );
        }

    }),


    QuestionInfo = React.createClass({

        render: function () {
            var question = this.props.question,
                // Note that 'guess' may not be defined.
                guess = this.props.guess;

            return (
                <div className="question-info">
                    <div className="question-info__ask">{ question.get('ask') }</div>
                    <ul className="multi-choice-info__options-list--lettered">
                        {
                            question.getOptions().map(function (option) {
                                if (question.isCorrect(option)) {
                                    return (
                                        <MultiChoiceItem_OptionItem_Correct>
                                            { option }
                                        </MultiChoiceItem_OptionItem_Correct>
                                    );
                                }
                                else if (option === guess) {
                                    return (
                                        <MultiChoiceItem_OptionItem_Incorrect>
                                            { option }
                                        </MultiChoiceItem_OptionItem_Incorrect>
                                    );
                                }
                                else {
                                    return (
                                        <MultiChoiceItem_OptionItem>
                                            { option }
                                        </MultiChoiceItem_OptionItem>
                                    );
                                }
                                return (
                                    <MultiChoiceItem_OptionItem>{ option }</MultiChoiceItem_OptionItem>
                                );
                            })
                        }                                                                                  
                    </ul>
                    <div className="question-info__explanation">
                        { question.get('explanation') }
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
