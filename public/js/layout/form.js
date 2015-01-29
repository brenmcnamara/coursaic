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


    RadioOptionWithTextInput = React.createClass({

        render: function () {
            if (this.props.checked) {
                return (
                    <div>
                        <input type="radio" value={ this.props.value } name={ this.props.name } checked />
                        <TextInput placeholder={ this.props.placeholder } value={ this.props.value } />
                    </div>
                );                
            }
            else {
                return (
                    <div>
                        <input type="radio"
                               value={ this.props.value }
                               name={ this.props.name } checked />
                        <TextInput placeholder={ this.props.placeholder }
                                   value={ this.props.presentationValue } />
                    </div>
                ); 
            }
        }

    });


module.exports = {

    RadioOption: RadioOption,
    TextInput: TextInput

};