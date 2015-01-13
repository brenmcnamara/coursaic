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
                    <headerLayout.Header />
                    <headerLayout.HeaderFill />
                </div>
            );
        }
    });

module.exports = {
    Root: Root
};