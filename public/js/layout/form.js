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
                        <input type="radio"
                               value={ this.props.value }
                               name={ this.props.name }
                               onChange={ this.props.onChange }
                               defaultChecked />
                        { this.props.children }
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <input type="radio"
                               value={ this.props.value }
                               name={ this.props.name }
                               onChange={ this.props.onChange } />
                        { this.props.children }
                    </div>
                );
            }
        }

    }),

    TextInput = React.createClass({

        getInitialState: function () {
            return { value: this.props.value };
        },

        render: function () {
            var style = { border: 'solid 1px #CCC' };
            if (this.props.isValid && !this.props.isValid(this.state.value)) {
                style = { outlineColor: "#EC0000", border: 'solid red 1px' };
            }

            return (
                <input className="form-text-input"
                       style={ style }
                       placeholder={ this.props.placeholder }
                       defaultValue={ this.props.value }
                       onChange={ this.onChange } />
            );
        },

        onChange: function (event) {
            this.setState({ value: event.target.value });
            this.props.onChange(event);
        }

    }),

    TextAreaInput = React.createClass({

        getInitialState: function () {
            return { value: this.props.value };
        },

        render: function () {
            var style = { borderColor: 'solid #CCC 1px' };
            if (this.props.isValid && !this.props.isValid(this.state.value)) {
                style = { outlineColor: '#EC0000', border: "solid #EC0000 1px" };
            }

            return (
                <textarea className="form-textarea-input"
                          style={ style }
                          placeholder={ this.props.placeholder }
                          defaultValue={ this.props.value }
                          onChange={ this.onChange } />

            );
        },

        onChange: function (event) {
            this.setState({ value: event.target.value });
            this.props.onChange(event);
        }

    }),

    Select = React.createClass({

        render: function () {
            var selectedIndex = this.props.options.reduce(function (selected, option, index) {
                if (this.props.value === selected) {
                    return index;
                }
                return selected;
            }.bind(this), 0);

            return (
                <select className="form-select" onChange={ this.props.onChange } defaultValue={ this.props.value } >
                    {
                        this.props.options.map(function (optionItem, index) {
                            if (optionItem === this.props.value) {
                                return <option key={ index.toString() }>{ optionItem }</option>;
                            }
                            return <option key={ index.toString() }>{ optionItem }</option>;
                        }.bind(this))
                    }
                </select>
            );
        }

    }),

    Checkbox = React.createClass({

        render: function () {
            // TODO: Why do I need pure-u-1 to fix the styling. How can I do this without
            // adding that?
            var renderCheckbox = (this.props.checked) ?
                (<input type="checkbox" onChange={ this.props.onChange } name={ this.props.name } value={ this.props.value } defaultChecked />) :
                (<input type="checkbox" onChange={ this.props.onChange } name={ this.props.name } value={ this.props.value } />);

            return (
                <label htmlFor="cb" className="pure-u-1 pure-checkbox">
                    { renderCheckbox }
                    <div>{ this.props.children }</div>
                </label>
            );
        }

    });


module.exports = {

    RadioOption: RadioOption,
    TextInput: TextInput,
    TextAreaInput: TextAreaInput,
    Select: Select,
    Checkbox: Checkbox

};