/** @jsx React.DOM */

/**
 * widgets.react.js
 *
 * All elements that are supported across
 * different web pages.
 */


var React = require('react'),

    /**
     * A divide element used to vertically
     * separate components.
     *
     * @module Layout
     * @submodule Widgets
     * @class Divide
     */
    Divide = React.createClass({
        
        render: function() {
            return (
                <div className="divide"></div>
            );
        }

    }),


    /**
     * A divide element used to vertically separate
     * components. This divide element spans across the
     * entire horizontal span of the parent element.
     *
     * @module Layout
     * @submodules Widgets
     * @class DivideFull
     */
    DivideFull = React.createClass({

        render: function() {
            return (
                <div className="divide--full"></div>
            );
        }


    }),


    /**
     * The dashboard element that shows up at the top
     * of each page.
     */
    Dashboard = React.createClass({

        render: function () {
            return (
                <div className="dashboard">
                    <div className="pure-g dashboard__content">
                        { this.props.children }
                    </div>
                </div>
            );
        }

    });


    /*
     * The main element of the dashboard page. This should
     * contain any important page information.
     */
    Dashboard.Summary = React.createClass({

        render: function () {
            return (
                <div className="pure-u-1 pure-u-md-2-5 pure-u-lg-1-3 dashboard__summary">
                    <div className="dashboard__summary__content">
                        { this.props.children }
                    </div>

                </div>
            );
        }
    });


    /**
     * The header element that goes into the dashboard.
     */
    Dashboard.Summary.Header = React.createClass({

        render: function () {
            return (
                <h2 className="dashboard__summary__content__header">{ this.props.children }</h2>
            );
        }

    });


    /**
     * The subheader element that goes into the dashboard.
     */
    Dashboard.Summary.Subheader = React.createClass({

        render: function () {
            return (
                <h5 className="dashboard__summary__content__subheader">{ this.props.children }</h5>
            );
        }

    });


    /**
     * Any additional details that show up in the
     * course summary.
     */
    Dashboard.Summary.Details = React.createClass({

        render: function () {
            return (
                <ul className="dashboard__summary__content__details">
                    { this.props.children.map(function (el) { return <li>{ el }</li> }) }
                </ul>
            );
        }

    });


module.exports = {

    Divide: Divide,
    DivideFull: DivideFull,

    Dashboard: Dashboard

};