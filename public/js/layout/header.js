/** @jsx React.DOM */

/**
 * header.react.js
 *
 * All react components related to
 * the header.
 */

var React = require('react'),
    
    Stores = require('../stores'),

    Router = require('shore').Router,
    Action = require('shore').Action,
    Constants = require('../constants.js'),

    /**
     * The header element that shows at the top
     * of every page.
     *
     * @module Layout
     * @submodule Header
     * @class Header
     */
    Header = React.createClass({

        getInitialState: function() {
            return {isEditing: false};
        }, 

        
        render: function() {
                // Modify the menu items and add them into the header.
                var menu;

            if (this.props.menu) {
                menu = this.props.menu.map(function (item, index) {
                    return <HeaderItem key={ index.toString() }>{ item }</HeaderItem>;
                });
            }
            else {
                menu = null;
            }

            // TODO: Handle editing mode!
            return (
                <div className="home-menu pure-menu pure-menu-open pure-menu-horizontal pure-menu-fixed">
                    <a className="pure-menu-heading" href="">
                        <img className="header__logo" src="/img/logo-white-border.png" />
                        <span className="header__title">Coursaic</span>
                    </a>

                    <ul>
                        { menu }
                    </ul>
                </div>
            );
        },


        onClickLogo: function(event) {
            Router.path("/");
        },


        onClickText: function(event) {
            Router.path("/");
        },


        didBeginEditing: function(event) {
            this.setState({isEditing: true});
        },


        didEndEditing: function(event) {
            this.setState({isEditing: false});
        },


        componentWillMount: function() {
            Stores.ExamStore().on(Constants.Event.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().on(Constants.Event.DID_END_EDITING, this.didEndEditing);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().removeListener(Constants.Event.DID_END_EDITING, this.didEndEditing);
        }


    }),

    HeaderItem = React.createClass({

        render: function () {
            return (<li>{ this.props.children } </li>);
        }

    });


module.exports = {
    Header: Header
};

