/** @jsx React.DOM */

/**
 * header.react.js
 *
 * All react components related to
 * the header.
 */

var React = require('react'),
    
    Stores = require('../stores'),

    Router = require('../router.js'),
    Action = require('../Action.js').Action,
    CAEvent = require('../Event.js').CAEvent,

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
            var user = Stores.UserStore().current(),
                headerType = (this.props.isOpaque) ?
                             ("header") :
                             ("header--fill");
            if (!this.state.isEditing) {
                return (
                    <header className={ headerType }>
                        <img onClick={ this.onClickLogo } className="header__logo--clickable" src="/img/logo-dark.png" />
                        <h1 onClick={ this.onClickText } className="header__title--clickable">Coursaic</h1>
                        <nav className="main-nav">
                        <div className="main-nav__item--unclickable">
                            Welcome, {user.get('firstName')}
                        </div>
                        </nav>
                        <div className="profile-pic--circle header__profile-pic">
                            <img src= {user.get('photoUrl')} />
                        </div>
                    </header>
                );
            }
            else {
                return (
                    <header className={ headerType }>
                        <img className="header__logo--unclickable" src="/img/logo-dark.png" />
                        <h1  className="header__title--unclickable">Coursaic</h1>
                        <nav className="main-nav">
                        <div className="main-nav__item--unclickable">
                            Welcome, {user.get('firstName')}
                        </div>
                        </nav>
                        <div className="profile-pic--circle header__profile-pic">
                            <img src= {user.get('photoUrl')} />
                        </div>
                    </header>  
                );
            }
        },


        onClickLogo: function(event) {
            Router.path("/");
            /*
            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'home'});
*/
        },


        onClickText: function(event) {
            Router.path("/");
            /*
            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'home'});*/
        },


        didBeginEditing: function(event) {
            this.setState({isEditing: true});
        },


        didEndEditing: function(event) {
            this.setState({isEditing: false});
        },


        componentWillMount: function() {
            Stores.ExamStore().on(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().on(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
        }


    }),


    /**
     * The filler that helps move elements outside
     * of the header down so they are not hidden
     * by the header.
     *
     * @module Layout
     * @submodule Header
     * @class HeaderFill
     */
    HeaderFill = React.createClass({
        
        render: function() {
            var fillType = (this.props.isOpaque) ?
                           ("header-offset") :
                           ("header-offset--fill");
            return (
                <div className={ fillType }></div>
            );
        }

    });


module.exports = {
    Header: Header,
    HeaderFill: HeaderFill
};

