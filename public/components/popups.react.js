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

        return {
                courseMap: { fieldId: fields[0].id }
                };
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
                        <input onChange={ this.onChangeName }
                               type="text"
                               placeholder="Name (i.e. Introduction to Computer Science)" />
                    </div>
                    <div className="create-course__code">
                        <input onChange={ this.onChangeCode }
                               type="text"
                               placeholder="Code (i.e. CS 101)" />
                    </div>
                    <div className="create-course__description">
                        <textarea onChange= {this.onChangeDescription }
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
        // TODO (brendan): Should have a minimum number
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