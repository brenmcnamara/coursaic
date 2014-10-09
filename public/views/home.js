/** @jsx React.DOM */

/**
 * home.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

/*
 * Dependencies:
 *  - React
 *  - View namespace
 *  - Components in header.js
 */

/**
 * Root_Home
 *
 * The root element for the home page. All other
 * elements on the home page will exist inside
 * this element.
 */
View.Root_Home = React.createClass({
    render: function() {
        return (
            <div className="main">
                <View.Header />
                <View.Header_Fill />
            </div>
        );
    }
});