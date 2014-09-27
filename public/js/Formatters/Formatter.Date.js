/*jshint asi: false, bitwise: false, boss: false, curly: true, debug: false, eqeqeq: true,
  eqnull: false, evil: false, forin: false, immed: true, laxbreak: true, maxlen: 100, 
  newcap: true, noarg: true, noempty: false, node: true, nonew: false, nomen: false, onevar: true,
  passfail: false, plusplus: false, regexp: false, undef: true, sub: true, strict: true,
  white: false, browser: true, devel: true */

/*global */

// Conditional setting in case
// the environment is a Node environment.
// If this is running in the browser, Formatter
// should already exist.
var Formatter;

// Setup for Node Environment.
if (typeof require === 'function' && exports) {
    Formatter = {};
    exports.Formatter = Formatter;
}

Formatter.Date = (function() {

    "use strict";

    /* Declarations */

    /**
     * Formats the presentation of a date.
     *
     * @method format
     *
     * @param date {Date} The date object to format.
     *
     * @param options {Object} A map of possible options
     *  to configure the formatting.
     *
     * @return The string representation of the
     *  date object.
     */
    var format,

    /* State */

    /**
     * Contains all the state for this formatter.
     *
     * @property stateMap
     * @type Object
     *
     */
        stateMap = {};

    /* Implementations */

    format = function(date, options) {
        // TODO: Implement me!
    };

    return { format: format };

}());

