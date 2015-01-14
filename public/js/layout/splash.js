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
                    <FeatureList />
                </div>
            );
        }
    }),


    SplashFiller = React.createClass({

        render: function () {
            return (
                <div className="splash__filler">
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
                </div>
            );
        }
    }),

    FeatureList = React.createClass({

        render: function () {
            return (
                <div>
                    <ul className="splash__feature-list">
                        <li>
                            <div className="splash__feature-list__item__image-wrapper">
                                <img src="/img/school.png"></img>
                            </div>
                            <div className="splash__feature-list__item__text-wrapper">
                                <p>Select your school and find your courses.</p>
                            </div>
                        </li>
                        <li>
                            <div className="splash__feature-list__item__image-wrapper">
                                <img src="/img/paper.png"></img>
                            </div>
                            <div className="splash__feature-list__item__text-wrapper">
                                <p>Take practice exams and get quick feedback.</p>
                            </div>
                        </li>
                        <li>
                            <div className="splash__feature-list__item__image-wrapper">
                                <img src="/img/group.png"></img>
                            </div>
                            <div className="splash__feature-list__item__text-wrapper">
                                <p>Collaborate with friends to create practice question and quiz each other.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }

    });


module.exports = {
    Root: Root
};