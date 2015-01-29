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


    });


module.exports = {

    Divide: Divide,
    DivideFull: DivideFull

};