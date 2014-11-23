/** @jsx React.DOM */

/**
 * popups.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

View.Popup_Create_Course = React.createClass({

    render: function() {
        return (
            <div className="popup">
                <div className="popup__background"></div>
                <div className="popup-window--medium create-course">
                    <div className="popup-window__header">
                        Create Your Course
                    </div>
                    <div className="create-course__name">
                        <input type="text"
                               placeholder="Name (i.e. Introduction to Computer Science)" />
                    </div>
                    <div className="create-course__code">
                        <input type="text"
                               placeholder="Code (i.e. CS 101)" />
                    </div>
                    <div className="create-course__field">
                        <span>Field:</span>
                        <select className="create-course__field" defaultValue="Temp 1">
                            <option defaultValue="Temp 1">Temp 1</option>
                            <option defaultValue="Temp 2">Temp 2</option>
                            <option defaultValue="Temp 3">Temp 3</option>
                        </select>
                    </div>
                    <div className="create-course__button-wrapper">
                        <button type="button" className="button popup-window__button">
                            Create
                        </button>
                        <button type="button" className="button popup-window__button">
                            Cancel
                        </button>
                    </div>
                    
                </div>
            </div>
        );
    }


});