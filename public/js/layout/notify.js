/** @jsx React.DOM */

/**
 * 404.js
 *
 * Layout for the 404 page.
 */

var React = require('react'),
    Action = require('shore').Action,
    Constants = require('../constants.js'),

    /**
     * Notifies that an email was sent for resetting
     * the user's password.
     */
    ResetPasswordEmail = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <div className="notify">
                        <i className="fa fa-send notify-icon"></i>
                        <h3 className="notify__head">Email has been sent.</h3>
                        <p className="notify__subhead">
                            An email has been sent to you for resetting your
                            password.  <span className="inline-button"
                                             onClick={ this.onClickHome } >Return home</span> to try logging in.
                        </p>
                    </div>
                </div>
            );
        },

        onClickHome: function () {
            Action().route("/").send();
        }

    }),


    /**
     * Gives the user an option to reset the password.
     */
    ResetPassword = React.createClass({

        getInitialState: function () {
            return { email: "" };
        },


        isValid: function () {
            var isEmailRegExp = /^[^\/\@]+@[^\.\/\@]+\.[^\.\/\@]+$/i;
            return isEmailRegExp.test(this.state.email);
        },


        render: function () {
            var sendEmailButton;
            if (this.isValid()) {
                sendEmailButton = (
                    <button type="button"
                            onClick={ this.onSendEmailClicked }
                            className="pure-button blue-button">
                        Send Email
                    </button>
                );
            }
            else {
                sendEmailButton = (
                    <button type="button"
                            className="pure-button-disabled blue-button">
                        Send Email
                    </button>
                );          
            }

            return (
                <div className="main">
                    <div className="notify">
                        <i className="fa fa-frown-o notify-icon"></i>
                        <h3 className="notify__head">Well, that Sucks</h3>
                        <p className="notify__subhead">
                            Give us your email address and we can help you reset the password.
                        </p>
                        <form className="pure-form pure-form-stacked notify__form">
                            <fieldset>
                                <label htmlFor="email">Your Email</label>
                                <input onChange={ this.onChangeEmail }
                                       type="email"
                                       placeholder="Your email" />

                                { sendEmailButton }
                            </fieldset>
                        </form>
                    </div>
                </div>
            );
        },


        onChangeEmail: function (event) {
            this.setState({ email: event.target.value });
        },


        onSendEmailClicked: function () {
            if (this.isValid()) {
                Action(Constants.Action.RESET_PASSWORD, { email: this.state.email })
                    .route("/resetpasswordemail")
                    .send();
            }
        }


    }),


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
            Action().route("/").send();
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
            Action().route("/").send();
        }

    });


module.exports = {
    PageNotFound: PageNotFound,
    SignUpComplete: SignUpComplete,
    ResetPassword: ResetPassword,
    ResetPasswordEmail: ResetPasswordEmail
};