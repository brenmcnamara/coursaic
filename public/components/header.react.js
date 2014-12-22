/** @jsx React.DOM */

/**
 * header.react.js
 *
 * All react components related to
 * the header.
 */

/*
 * Dependencies:
 *  - react js
 *  - View namespace
 */

var React = require('react'),
    
    Stores = require('../js/Stores'),

    Action = require('../js/Action.js').Action,
    CAEvent = require('../js/Event.js').CAEvent,

    /**
     * Header
     *
     * The header for any page.
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
            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'home'})
        },


        onClickText: function(event) {
            Action.send(Action.Name.PERFORM_LOAD,
                        {pageKey: 'home'})
        },


        didBeginEditing: function(event) {
            this.setState({isEditing: true});
        },


        didEndEditing: function(event) {
            this.setState({isEditing: false});
        },


        componentWillMount: function() {
            Stores.ExamStore().addListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().addListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(CAEvent.Name.DID_BEGIN_EDITING, this.didBeginEditing);
            Stores.ExamStore().removeListener(CAEvent.Name.DID_END_EDITING, this.didEndEditing);
        }


    }),


    /**
     * Header_Fill
     *
     * The filler that helps move elements outside
     * of the header down so they are not hidden
     * by the header.
     */
    Header_Fill = React.createClass({
        
        render: function() {
            var fillType = (this.props.isOpaque) ?
                           ("header-offset") :
                           ("header-offset--fill");
            return (
                <div className={ fillType }></div>
            );
        }

    });


exports.HeaderLayout = {
    Header: Header,
    Header_Fill: Header_Fill
};

