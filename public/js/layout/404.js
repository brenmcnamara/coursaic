/** @jsx React.DOM */

/**
 * 404.js
 *
 * Layout for the 404 page.
 */

var React = require('React'),
    Router = require('../router.js'),

    Root = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <div className="page-error">
                        <h1>404</h1>
                        <h3>Page not Found</h3>
                        <p>We could not find this page. <span className="inline-button" 
                                                              onClick={ this.onClickHome }>
                                                              Return home.</span>
                        </p>
                    </div>
                </div>    
            );
        },


        onClickHome: function () {
            Router.path("/");
        }


    });


module.exports = {
    Root: Root
};