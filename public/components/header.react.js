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

/**
 * Header
 *
 * The header for any page.
 */
View.Header = React.createClass({
    
    render: function() {
        var user = UserStore.current(),
            headerType;

        switch (ConfigStore.pageKey()) {
        case 'course':
            headerType = "header--fill";
            break;
        default:
            headerType = "header";
        }
        return (
            <header className={ headerType }>
                <img className="header__logo" src="/img/logo-dark.png" />
                <h1 className="header__title">Coursaic</h1>
                <nav className="main-nav">
                    <div className="main-nav__item--clickable">
                        Logout
                    <div className="main-nav__break"></div>
                </div>

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
});


/**
 * Header_Fill
 *
 * The filler that helps move elements outside
 * of the header down so they are not hidden
 * by the header.
 */
View.Header_Fill = React.createClass({
    
    render: function() {
        var fillType;
        switch (ConfigStore.pageKey()) {
        case 'course':
            fillType = "header-offset--fill";
            break;
        default:
            fillType = "header-offset";
        }
        return (
            <div className={ fillType }></div>
        );
    }
});

