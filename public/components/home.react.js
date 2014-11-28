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
        // TODO (brendan): How can I avoid writing
        // all the html twice?
        var school = UserStore.current().get('school');
        if (CourseStore.isCreateCourseMode()) {
            return (
                <div className="main">
                    <View.Popup_Create_Course />
                    <View.Header isOpaque={ true } />
                    <View.Header_Fill isOpaque={ true } />
                    <View.Home_Img />
                    <View.Search alias={school.get('alias')} />
                    <View.Home_Content />
                </div>
            );        
        }
        else {
            return (
                <div className="main">
                    <View.Header isOpaque={ true } />
                    <View.Header_Fill isOpaque={ true } />
                    <View.Home_Img />
                    <View.Search alias={school.get('alias')} />
                    <View.Home_Content />
                </div>
            );
        }
    },


    didBeginEditing: function() {
        this.setState({ isEditing: true });
    },


    didEndEditing: function() {
        this.setState({ isEditing: false });
    },


    componentWillMount: function() {
        CourseStore.addListener(CAEvent.Name.DID_BEGIN_EDITING,
                                this.didBeginEditing);
        CourseStore.addListener(CAEvent.Name.DID_END_EDITING,
                                this.didEndEditing)
    },


    componentWillUnmount: function() {
        CourseStore.removeListener(CAEvent.Name.DID_BEGIN_EDITING,
                                   this.didBeginEditing);
        CourseStore.removeListener(CAEvent.Name.DID_END_EDITING,
                                   this.didEndEditing);
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
        var enrolled = CourseStore.coursesForUser(UserStore.current()) || [];
        return (
            <div className="content__nav">
                <View.MainOptions />
                <View.Divide />
                <View.MyCourses enrolled={enrolled} />
            </div>
        );
    },

    componentWillMount: function() {
        CourseStore.addListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
        CourseStore.addListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
    },

    componentWillUnmount: function() {
        CourseStore.removeListener(CAEvent.Name.DID_FETCH_COURSES, this.onChange);
        CourseStore.removeListener(CAEvent.Name.DID_CREATE_COURSE, this.onChange);
    },

    onChange: function() {
        this.forceUpdate();
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

