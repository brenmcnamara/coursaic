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

    }),

    TagSet = React.createClass({

        render: function () {
            return (
                <div className="tag-list">
                    { this.props.children }
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
                <h4 className="dashboard__summary__content__subheader">{ this.props.children }</h4>
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
                    { children.map(function (el) { return el; }) }
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
                        children.map(function (btn, index) {
                            return (
                                <div key={ index.toString() } className="dashboard-buttons__item">{ btn }</div>
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
                <h2 className="section__header">
                    { this.props.children }
                </h2>
            );
        }

    });


    SectionSet.Section.Empty = React.createClass({

        render: function () {
            return (
                <div className="section__empty">
                    { this.props.children }
                </div>
            );
        }

    });


    SectionSet.Section.Subsection = React.createClass({

        render: function () {
            return (
                <div className="section__subsection">
                    { this.props.children }
                </div>
            );
        }

    });


    SectionSet.Section.Subsection.Header = React.createClass({

        render: function () {
            return (
                <h3 className="section__subsection__header">
                    { this.props.children }
                </h3>
            );
        }

    });


    TagSet.Tag = React.createClass({

        render: function () {
            var tag = this.props.tag;

            return (
                <div className="tag-list__item tag"
                     style={ { backgroundColor: tag.get('color'), color: "white" } }>

                    { tag.get('name') }

                </div>
            );
        }

    });

module.exports = {

    Divide: Divide,
    DivideFull: DivideFull,

    Dashboard: Dashboard,
    SectionSet: SectionSet,
    TagSet: TagSet

};