/** @jsx React.DOM */

/**
 * header.js
 *
 * All react components related to
 * the header.
 */

/*
 * Dependencies:
 *  - react js
 *  - View namespace
 */

View.Header = React.createClass({
    render: function() {
        return (
            <header className="header">
                <img className="header__logo" src="./img/logo-dark.png" />
                <h1 className="header__title">Coursaic</h1>
                <nav className="main-nav">
                    <div className="main-nav__item--clickable">
                        Logout
                    <div className="main-nav__break"></div>
                </div>

                <div className="main-nav__item--unclickable">
                    Welcome, Brendan
                </div>
                </nav>
                <div className="profile-pic--circle header__profile-pic">
                    <img src="./img/profilePic.png" />
                </div>
            </header>
        );
    }
});