/** @jsx React.DOM */

/**
 * 404.js
 *
 * Layout for the 404 page.
 */

var React = require('React'),
    Router = require('shore').Router,

    /**
     * Alert the user that they just successfully
     * signed up for coursaic and need to verify their
     * email address.
     */
    SignUpComplete = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <div className="notify">
                        <i className="fa fa-smile-o notify-icon"></i>
                        <h3 className="notify__head">Thanks for Signing Up</h3>
                        <p className="notify__subhead">
                            Congratulations! You have signed up for Coursaic! You will receive
                            an email shortly. Please confirm your email address and return back to
                            the <span className="inline-button" onClick={ this.onClickSplash }>main page</span> to
                            login.</p>
                    </div>
                </div>
            );
        },

        onClickSplash: function () {
            console.log("Clicking");
            Router.path("/");
        }

    }),


    /**
     * Alert the user that they have navigated
     * to a page that could not be found.
     */
    PageNotFound = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <div className="notify">
                        <i className="fa fa-wrench notify-icon"></i>
                        <h3 className="notify__head">Page not Found</h3>
                        <p className="notify__subhead">
                            We could not find this page. <span className="inline-button" 
                                                              onClick={ this.onClickHome }>
                                                              Return home.</span>
                        </p>
                    </div>
                </div>    
            );
        },


        onClickHome: function () {
            Router.path("/");
        }

    });


module.exports = {
    PageNotFound: PageNotFound,
    SignUpComplete: SignUpComplete
};