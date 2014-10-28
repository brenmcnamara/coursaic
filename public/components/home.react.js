/** @jsx React.DOM */

/**
 * home.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

/*
 * Dependencies:
 *  - Parse
 *  - React
 *  - View namespace
 *  - Components in header.js
 *  - Components in widgets.js
 */

/**
 * Root_Home
 *
 * The root element for the home page. All other
 * elements on the home page will exist inside
 * this element.
 */
View.Home_Root = React.createClass({

    render: function() {
        var school = ConfigStore.school();

        return (
            <div className="main">
                <View.Header />
                <View.Header_Fill />
                <View.Home_Img />
                <View.Search alias={school.get('alias')} />
                <View.Home_Content />
            </div>
        );
    }

});


/**
 * Home_Img
 *
 * The decorative image on the home
 * page.
 */
View.Home_Img = React.createClass({
    render: function() {
        return (
            <div className="home-image"></div>
        );
    }
});


/**
 * Search
 *
 * The search bar for looking up courses.
 */
View.Search = React.createClass({
    render: function() {
        var searchText = "Search for " + this.props.alias + " classes...";
        return (
            <div className="home-search">
                <div className="search">
                    <input type="text"
                           placeholder={searchText}
                           className="search__input" />

                    <img className="search__submit" src="/img/icons/search.png" />
                </div>
            </div>
        );
    }
});


/**
 * Home_Content
 *
 * All the major content on the
 * home page, including side navigation
 * and courses to lookup.
 */
View.Home_Content = React.createClass({
    render: function() {
        return (
            <div className="home-content content">
                <View.Home_SideNav />
                <View.Home_Body />
            </div>
        );
    }
});


/**
 * Home_SideNav
 *
 * The Side Navigation on the home
 * page.
 */
View.Home_SideNav = React.createClass({
    render: function() {
        var enrolled = ConfigStore.user().get('enrolled');

        return (
            <div className="content__nav">
                <View.MainOptions />
                <View.Divide />
                <View.MyCourses enrolled={enrolled} />
            </div>
        );
    }
});

/**
 * Home_Body
 *
 * The central markup inside the content
 * tag, displayed on the home page.
 */
View.Home_Body = React.createClass({
    render: function() {
        return (
            <div className="home-content__courses">
                <View.CourseGrid />
            </div>
        );
    }
});

