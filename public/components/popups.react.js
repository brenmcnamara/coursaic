/** @jsx React.DOM */

/**
 * popups.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

View.Popup_Create_Course = React.createClass({

    render: function() {
        var submitButton = (this.isValid()) ?
                           (<button type="button" className="button popup-window__button">
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
                    <div className="create-course__field">
                        <span>Field:</span>
                        <select onChange={ this.onChangeField }
                                className="create-course__field" defaultValue="Temp 1">
                            <option value="c01">Temp 1</option>
                            <option value="c02">Temp 2</option>
                            <option value="c03">Temp 3</option>
                        </select>
                    </div>
                    <div className="create-course__button-wrapper">
                        { submitButton }
                        <button type="button" className="button popup-window__button">
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
        var name, code;
        if (this.state) {
            name = this.state.name || null;
            code = this.state.code || null;
            if (!name || !code) {
                return false;
            }
        }
        else {
            return false;
        }
        return name.trim().length > 0 &&
               code.trim().length > 0;
    },


    onChangeName: function(event) {
        this.setState({ name: event.target.value });
    },


    onChangeCode: function(event) {
        this.setState({ code: event.target.value });
    },


    onChangeField: function(event) {
        this.setState({ fieldId: event.target.value })
    },


    onClickBackground: function() {
        // TODO (brendan): Implement this!
    }


});