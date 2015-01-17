/** @jsx React.DOM */

/**
 * splash.js
 *
 * The layout for the splash page.
 */

var router = require('shore').Router,
    action = require('shore').Action
    constants = require('../constants.js'),
    React = require('react'),

    headerLayout = require('./header.js'),

    Splash = React.createClass({

        render: function () {
            return (
                <div className="splash-filler-container">
                    <div className="splash-filler">
                        <h1 className="splash-filler__head">Coursaic</h1>
                        <p className="splash-filler__subhead">A New Way to Study</p>
                    </div>
                </div>
            );
        }
    }),


    Signup = React.createClass({

        render: function () {
            return (
                <div className="l-box-lrg pure-u-1 pure-u-md-1-2">
                    <h3 className="splash__form-name">Sign Up</h3>
                    <form className="pure-form pure-form-stacked sign-up-form">
                        <fieldset>
                            <label htmlFor="name">First Name</label>
                            <input type="text" placeholder="Your Name" />
                            
                            <label htmlFor="name">Last Name</label>
                            <input type="text" placeholder="Your Name" /> 
                                

                            <label htmlFor="email">Your Email</label>
                            <input type="email" placeholder="Your Email" />

                            <label htmlFor="password">Your Password</label>
                            <input type="password" placeholder="Your Password" />

                            <button className="pure-button blue-button">
                                Sign Up
                            </button>

                        </fieldset>
                    </form>
                </div>
            );
        }


    }),


    Login = React.createClass({

        getInitialState: function () {
            return { email: "", password: "" };
        },


        isValid: function () {
            var isEmailRegExp = /^[^\/\@]+@[^\.\/\@]+\.[^\.\/\@]+$/i;

            return isEmailRegExp.test(this.state.email) && this.state.password.length > 0;

        },

        render: function () {
            var loginButton;

            if (this.isValid()) {
                loginButton = (
                    <button onClick={ this.onLogin } className="pure-button blue-button">
                        Login
                    </button>
                );
            }
            else {
                loginButton = (
                    <button onClick={ this.onLogin } className="pure-button-disabled blue-button">
                        Login
                    </button>
                );
            }

            return (
                <div className="l-box-lrg pure-u-1 pure-u-md-1-2">
                    <h3 className="splash__form-name">Login</h3>
                    <div className="pure-form pure-form-stacked sign-up-form">
                        <fieldset>
                            <label htmlFor="email">Your Email</label>
                            <input onChange={ this.onEmailChange }
                                   type="email"
                                   placeholder="Your Email" />

                            <label htmlFor="password">Your Password</label>
                            <input onChange={ this.onPasswordChange }
                                   type="password"
                                   placeholder="Your Password" />

                            { loginButton }
                        </fieldset>
                    </div>
                </div>
            );
        },

        onEmailChange: function (event) {
            this.setState({ email: event.target.value });
        },

        onPasswordChange: function (event) {
            this.setState({ password: event.target.value });
        },

        onLogin: function () {
            if (this.isValid()) {
                router.setPathWithPayload("/home", {
                    username: this.state.email,
                    password: this.state.password
                });
            }
        }

    }),


    UserForms = React.createClass({

        render: function () {
            return (
                <section>
                    <div className="pure-g">
                        <Login />
                        <Signup />
                    </div>
                </section>
            );
        }

    }),


    FeatureList = React.createClass({
        render: function () {
            return (
                <section>
                    <div className="pure-g">
                        <div className="l-box pure-u-1 pure-u-lg-1-3">
                                <h3 className="content-subhead">
                                    <i className="fa fa-university"></i>
                                    Find classes you are taking
                                </h3>
                                <p>
                                    Find classes from your university that you are taking. Enroll and have access to content submitted by your classmates.
                                </p>
                        </div>

                        <div className="l-box pure-u-1 pure-u-lg-1-3">

                            <h3 className="content-subhead">
                                <i className="fa fa-file-text"></i>
                                Quiz Yourself
                            </h3>
                            <p>
                                Help create practice exams and quiz yourself with questions that your friends submit.
                            </p>
                        </div>
                        
                        <div className="l-box pure-u-1 pure-u-lg-1-3">
                            <h3 className="content-subhead">
                                <i className="fa fa-mobile"></i>
                                Study on the Go
                            </h3>
                            <p>
                                Have easy access to practice exams on your mobile devices, letting you study from anywhere.
                            </p>
                        </div>
                        
                    </div>
                </section>
            );
        }

    }),


    Content = React.createClass({
 
        render: function () {
            return (
                <div className="content-wrapper">
                    <FeatureList />
                    <UserForms />
                </div>
            );

        }

    }),


    Root = React.createClass({

        render: function () {
            return (
                <div className="main splash">
                    <headerLayout.Header />
                    <Splash />
                    <Content />
                </div>
            );
        }
    });


module.exports = {
    Root: Root
};
