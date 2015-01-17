/** @jsx React.DOM */

/**
 * 404.js
 *
 * Layout for the 404 page.
 */

var React = require('React'),
    Router = require('shore').Router,

    PageNotFound = React.createClass({

        render: function () {
            return (
                <div className="main">
                    <div className="notify">
                        <i className="fa fa-wrench notify-icon"></i>
                        <h3 className="notify__head">Page not Found</h3>
                        <p className="notify__subhead">
                            We could not find this page. <span className="inline-button" 
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
    PageNotFound: PageNotFound
};