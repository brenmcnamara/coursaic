/** @jsx React.DOM */

/**
 * popups.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

View.Popup_Create_Course = React.createClass({

    getInitialState: function() {
        var fields = FieldStore.fields();
        return { courseMap: { fieldId: fields[0].id } };
    },


    render: function() {
        var fields = FieldStore.fields(),
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
        var courseMap = View.Util.copy(this.state.courseMap);
        courseMap.name = event.target.value.trim();
        this.setState({ courseMap: courseMap });
    },


    onChangeCode: function(event) {
        var courseMap = View.Util.copy(this.state.courseMap);
        courseMap.code = event.target.value.trim();
        this.setState({ courseMap: courseMap });
    },


    onChangeDescription: function(event) {
        var courseMap = View.Util.copy(this.state.courseMap);
        courseMap.description = event.target.value.trim();
        this.setState({ courseMap: courseMap });
    },


    onChangeField: function(event) {
        var courseMap = View.Util.copy(this.state.courseMap);
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
        Action.send(Action.Name.CREATE_COURSE, this.state.courseMap);
    },


    onClickCancel: function() {
        Action.send(Action.Name.CANCEL_CREATE_COURSE);
    },


    onClickBackground: function() {
        Action.send(Action.Name.CANCEL_CREATE_COURSE);
    }


});


View.Popup_Create_Exam = React.createClass({

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
        var examMap = View.Util.copy(this.state.examMap);
        examMap.name = event.target.value;
        this.setState({ examMap: examMap });
    },


    onChangeDescription: function(event) {
        var examMap = View.Util.copy(this.state.examMap);
        examMap.description = event.target.value;
        this.setState({ examMap: examMap });
    },


    onClickCreate: function(event) {
        if (!this.isValid()) {
            throw new Error("Trying to create an exam when creation is not valid.");
        }
        var map = View.Util.copy(this.state.examMap);
        map.courseId = CourseStore.current().id;
        Action.send(Action.Name.CREATE_EXAM, { examMap: map });
    },


    onClickCancel: function(event) {
        Action.send(Action.Name.CANCEL_CREATE_EXAM);
    }


});


View.Popup_Delete_Question = React.createClass({

    render: function() {
        return <View.Popup_Confirm header="Deleting Question"
                                   message="Are you sure you would like to delete this question?"
                                   onYes={ this.onYes }
                                   onNo={ this.onNo } />
    },


    onYes: function(event) {
        Action.send(Action.Name.DELETE_QUESTION);
    },


    onNo: function(event) {
        Action.send(Action.Name.FROM_MODE_DELETE_QUESTION);
    }


});


View.Popup_Cancel_Exam_Run = React.createClass({

    render: function() {
        return <View.Popup_Confirm header="Cancel Your Exam"
                                   message="Are you sure you would like to cancel taking this exam?"
                                   onYes={ this.onYes }
                                   onNo={ this.onNo } />
    },


    onYes: function(event) {
        Action.send(Action.Name.CANCEL_EXAM_RUN);
    },


    onNo: function(event) {
        Action.send(Action.Name.EXIT_CANCEL_EXAM_RUN_MODE);
    }


});


View.Popup_Confirm = React.createClass({

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

