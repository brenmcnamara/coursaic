/** @jsx React.DOM */

/**
 * popups.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */
    
var React = require('react'),
    Stores = require('../stores'),
    Router = require('shore').Router,
    Util = require('shore').Util,
    Constants = require('../constants.js')
    Action = require('shore').Action,

    /**
     * A popup form for creating a course.
     *
     * @module Layout
     * @submodule Popup
     * @class CreateCourse
     */
    CreateCourse = React.createClass({

        getInitialState: function() {
            var fields = Stores.FieldStore().fields();
            return { courseMap: { fieldId: fields[0].id } };
        },


        render: function() {
            var fields = Stores.FieldStore().fields(),
                fieldOptions = fields.map(function(field) {
                    return <option value={ field.id }>{ field.get('name') }</option>;
                });
                submitButton = (this.isValid()) ?
                               (<button onClick={ this.onClickCreate } 
                                        type="button" className="button popup-window__button">
                                        Create
                                    </button>) :
                               (<button type="button" className="button--disabled popup-window__button">
                                        Create
                                    </button>);

            return (
                <div className="popup">
                    <div onClick={ this.onClickBackground } className="popup__background"></div>
                    <div className="popup-window--medium create-course">
                        <div className="popup-window__header">
                            Create Your Course
                        </div>
                        <div className="create-course__name">
                            <input className="text-input"
                                   onChange={ this.onChangeName }
                                   type="text"
                                   placeholder="Name (i.e. Introduction to Computer Science)" />
                        </div>
                        <div className="create-course__code">
                            <input className="text-input"
                                   onChange={ this.onChangeCode }
                                   type="text"
                                   placeholder="Code (i.e. CS 101)" />
                        </div>
                        <div className="create-course__description">
                            <textarea className="text-input"
                                      onChange= {this.onChangeDescription }
                                      placeholder="Description for the course.">
                            </textarea>
                        </div>
                        <div className="create-course__field">
                            <span>Field:</span>
                            <select onChange={ this.onChangeField }
                                    className="create-course__field" defaultValue={ fields[0].id }>
                                { fieldOptions }
                            </select>
                        </div>
                        <div className="create-course__button-wrapper">
                            { submitButton }
                            <button onClick={ this.onClickCancel }
                                    type="button"
                                    className="button popup-window__button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            );
        },


        /**
         * Check if the create-course form is valid for
         * submitting a new course.
         *
         * @method isValid
         *
         * @return {Boolean} True if the form is valid, false
         *  otherwise.
         */
        isValid: function() {
            // Can assume that there is a field selected.
            // Check that there is a valid name and course code.
            // TODO: Should have a minimum number
            // of characters before a course is a valid course
            // both for the name and the code.
            var name, code, description;
            if (this.state) {
                name = this.state.courseMap.name || null;
                code = this.state.courseMap.code || null;
                description = this.state.courseMap.description || null;
                if (!(name && code && description)) {
                    return false;
                }
            }
            else {
                return false;
            }
            return name.length > 0 &&
                   code.length > 0 &&
                   description.length > 0;
        },


        onChangeName: function(event) {
            var courseMap = Util.copy(this.state.courseMap);
            courseMap.name = event.target.value.trim();
            this.setState({ courseMap: courseMap });
        },


        onChangeCode: function(event) {
            var courseMap = Util.copy(this.state.courseMap);
            courseMap.code = event.target.value.trim();
            this.setState({ courseMap: courseMap });
        },


        onChangeDescription: function(event) {
            var courseMap = Util.copy(this.state.courseMap);
            courseMap.description = event.target.value.trim();
            this.setState({ courseMap: courseMap });
        },


        onChangeField: function(event) {
            var courseMap = Util.copy(this.state.courseMap);
            courseMap.fieldId = event.target.value.trim();
            this.setState({ courseMap: courseMap });
        },


        onClickCreate: function() {
            if (!this.isValid()) {
                throw new Error("Cannot create a course when form is not valid.");
            }
            // State is the payload.
            // Copy the course map from the state and add the
            // current user's school.
            Action(Constants.Action.CREATE_COURSE, this.state.courseMap).send();
        },


        onClickCancel: function() {
            Action(Constants.Action.FROM_MODE_CREATE_COURSE).send();
        },


        onClickBackground: function() {
            Action(Constants.Action.FROM_MODE_CREATE_COURSE).send();
        }


    }),


    /**
     * A popup form for creating an exam.
     *
     * @module Layout
     * @submodule Popup
     * @class CreateExam
     */
    CreateExam = React.createClass({

        getInitialState: function() {
            return { examMap: {} };
        },


        render: function() {
            var createButton = (this.isValid()) ?
                (
                    <button onClick={ this.onClickCreate }
                            type="button"
                            className="button popup-window__button">
                        Create
                    </button>
                ) :
                (
                    <button type="button"
                            className="button--disabled popup-window__button">
                        Create
                    </button>
                );
            return (
                <div className="popup">
                    <div className="popup__background" onClick={ this.onClickCancel }></div>
                    <div className="popup-window--medium create-exam">
                        <div className="popup-window__header">Create Exam</div>
                        <div className="create-exam__name">
                            <input onChange={ this.onChangeName }
                                   type="text"
                                   className="text-input"
                                   placeholder="Name of the Exam (i.e. Exam 1)" />
                        </div>
                        <div className="create-exam__description">
                            <textarea onChange={ this.onChangeDescription }
                                      type="text"
                                      className="text-input"
                                      placeholder="Add a description of what material this exam should cover.">
                            </textarea>
                        </div>

                        <div className="button-wrapper create-exam__button-wrapper">
                            { createButton }
                            <button onClick={ this.onClickCancel }
                                    type="button"
                                    className="button popup-window__button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            );        
        },


        /**
         * Check if the form for creating an exam is valid.
         *
         * @method isValid
         *
         * @return {Boolean} True if all the data needed
         *  to specify an Exam is provided, false otherwise.
         *  This includes a name and a description of the exam.
         */
        isValid: function() {
            var examMap;
            if (!this.state) {
                return false;
            }
            examMap = this.state.examMap;
            return examMap.name && examMap.description;
        },


        onChangeName: function(event) {
            var examMap = Util.copy(this.state.examMap);
            examMap.name = event.target.value;
            this.setState({ examMap: examMap });
        },


        onChangeDescription: function(event) {
            var examMap = Util.copy(this.state.examMap);
            examMap.description = event.target.value;
            this.setState({ examMap: examMap });
        },


        onClickCreate: function(event) {
            if (!this.isValid()) {
                throw new Error("Trying to create an exam when creation is not valid.");
            }
            var map = Util.copy(this.state.examMap);
            map.courseId = Stores.CourseStore().current().id;
            Action(Constants.Action.CREATE_EXAM, { examMap: map }).send();
        },


        onClickCancel: function(event) {
            Action(Constants.Action.FROM_MODE_CREATE_EXAM).send();
        }


    }),


    /**
     * A popup inquiring if the user is sure
     * he/she wants to delete a particular question.
     *
     * @module Layout
     * @submodule Popup
     * @class DeleteQuestion
     */
    DeleteQuestion = React.createClass({

        render: function() {
            return <Confirm header="Deleting Question"
                            message="Are you sure you would like to delete this question?"
                            onYes={ this.onYes }
                            onNo={ this.onNo } />
        },


        onYes: function(event) {
            Action(Constants.Action.DELETE_QUESTION).send();
        },


        onNo: function(event) {
            Action(Constants.Action.FROM_MODE_DELETE_QUESTION).send();
        }


    }),


    /**
     * A popup inquiring if the user is sure he/she
     * wants to cancel the current exam run.
     *
     * @module Layout
     * @submodule Popup
     * @class CancelExamRun
     */
    CancelExamRun = React.createClass({

        render: function() {
            return <Confirm header="Cancel Your Exam"
                            message="Are you sure you would like to cancel taking this exam?"
                            onYes={ this.onYes }
                            onNo={ this.onNo } />
        },


        onYes: function(event) {
            Router.path("/course/<courseId>/exam/<examId>",
                        {
                            courseId: Stores.CourseStore().current().id,
                            examId: Stores.ExamStore().current().id
                        });
        },


        onNo: function(event) {
            Action(Constants.Action.FROM_MODE_CANCEL_EXAM_RUN).send();
        }


    }),


    /**
     * A popup confirmation menu that provides
     * a message with a yes/no inquery for the user.
     *
     * @module Layout
     * @submodule Popup
     * @class Confirm
     */
    Confirm = React.createClass({

        render: function() {
            return (
                <div className="popup">
                    <div className="popup__background"></div>
                    <div className="popup-window--small confirm-popup">
                        <div className="popup-window__header">{ this.props.header }</div>
                        <div className="confirm-popup__message">{ this.props.message }</div>
                        <div className="confirm-popup__button-wrapper">
                            <button onClick={ this.onClickYes }
                                    type="button"
                                    className="button">Yes</button>

                            <button onClick={ this.onClickNo }
                                    type="button"
                                    className="button">No</button>
                        </div>
                    </div>
                </div>
            );
        },


        onClickYes: function(event) {
            this.props.onYes(event);
        },


        onClickNo: function(event) {
            this.props.onNo(event);
        }


    });


module.exports = {
    DeleteQuestion: DeleteQuestion,
    CreateExam: CreateExam,
    CreateCourse: CreateCourse,
    CancelExamRun: CancelExamRun,
};
