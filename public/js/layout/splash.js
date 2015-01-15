/** @jsx React.DOM */

/**
 * splash.js
 *
 * The layout for the splash page.
 */

var React = require('react'),

    headerLayout = require('./header.js'),

    /**
     * The root of the react component.
     */
    Root = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <headerLayout.Header isOpaque={ true } />
                    <headerLayout.HeaderFill isOpaque={ true } />
                    <SplashFiller />
                </div>
            );
        }
    }),


    SplashFiller = React.createClass({

        render: function () {
            return (
                <div className="splash__filler__content">
                    <p className="splash__filler__catch-phrase">A new way to study!</p>
                    <div className="splash__filler__button-wrapper">
                        <button className="button large-button--transparant">
                            Login
                        </button>
                    </div>
                    <div className="splash__filler__button-wrapper">
                        <button className="button large-button--transparant">
                            Sign Up
                        </button>
                    </div>
                </div>
            );
        }
    });


module.exports = {
    Root: Root
};