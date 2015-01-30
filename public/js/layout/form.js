/**
 * form.js
 */

var 
    
    React = require('react'),

    RadioOption = React.createClass({

        render: function () {
            if (this.props.checked) {
                return (
                    <div>
                        <input type="radio" value={ this.props.value } name={ this.props.name } checked />
                        { this.props.presentationValue }
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <input type="radio" value={ this.props.value } name={ this.props.name } />
                        { this.props.presentationValue }
                    </div>
                );
            }
        }

    }),

    TextInput = React.createClass({

        render: function () {
            return (
                <input className="form-text-input" placeholder={ this.props.placeholder }
                                                   value={ this.props.value } />
            );
        }

    }),

    TextAreaInput = React.createClass({

        render: function () {
            return (
                <textarea className="form-textarea-input"
                          placeholder={ this.props.placeholder } >
                    { this.props.value }
                </textarea>
            );
        }

    }),

    Select = React.createClass({

        render: function () {
            return (
                <select className="form-select">
                    { this.props.options.map(function (optionItem) {
                        return <option>{ optionItem }</option>
                    }) }
                </select>
            );
        }

    });


module.exports = {

    RadioOption: RadioOption,
    TextInput: TextInput,
    TextAreaInput: TextAreaInput,
    Select: Select

};