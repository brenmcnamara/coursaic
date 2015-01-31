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


    SectionSet = React.createClass({

        render: function () {
            return (
                <div className="section-wrapper">
                    { this.props.children }
                </div>
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
            var children = (Array.isArray(this.props.children)) ?
                           this.props.children :
                           [ this.props.children ];

            return (
                <ul className="dashboard__summary__content__details">
                    { children.map(function (el) { return <li>{ el }</li> }) }
                </ul>
            );
        }

    });


    /**
     * A tag to add buttons to the dashboard.
     */
    Dashboard.Buttons = React.createClass({

        render: function () {
            var children = (Array.isArray(this.props.children)) ?
                           this.props.children :
                           [ this.props.children ];
            return (
                <div className="pure-u-1 pure-u-md-3-5 pure-u-lg-2-3 dashboard-buttons">

                    { 
                        children.map(function (btn) {
                            return (
                                <div className="dashboard-buttons__item">{ btn }</div>
                            );
                        }) 
                    }

                </div>
            );
        }

    });


    SectionSet.Section = React.createClass({

        render: function () {
            return (
                <section className="section">
                    { this.props.children }
                </section>
            );
        }

    });


    SectionSet.Section.Header = React.createClass({

        render: function () {
            return (
                <div className="section__header">
                    { this.props.children }
                </div>
            );
        }

    });

module.exports = {

    Divide: Divide,
    DivideFull: DivideFull,

    Dashboard: Dashboard,
    SectionSet: SectionSet

};