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
                        { this.props.children }
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <input type="radio" value={ this.props.value } name={ this.props.name } />
                        { this.props.children }
                    </div>
                );
            }
        }

    }),

    TextInput = React.createClass({

        render: function () {
            return (
                <input className="form-text-input" placeholder={ this.props.placeholder }
                                                   value={ this.props.children } />
            );
        }

    }),

    TextAreaInput = React.createClass({

        render: function () {
            return (
                <textarea className="form-textarea-input"
                          placeholder={ this.props.placeholder } >
                    { this.props.children }
                </textarea>
            );
        }

    }),

    Select = React.createClass({

        render: function () {
            return (
                <select className="form-select">
                    { this.props.options.map(function (optionItem, index) {
                        return <option key={ index.toString() }>{ optionItem }</option>
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