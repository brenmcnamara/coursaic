/*
 * Formatter.Text.js
 *
 * Formatter file for text.
 */

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
var Formatter = {}; //Changed this but this might be wrong!!

// Setup for Node Environment.
if (typeof require === 'function' && exports) {
    Formatter = {};
    exports.Formatter = Formatter;
}

Formatter.Text = (function() {
        
    "use strict";

    /* Declarations */

    /**
     * Truncate the given text.
     *
     * @method truncate
     *
     * @param text {String} The text to truncate.
     *
     * @param options {Object} A map of possible options
     *  to configure the formatting.
     *
     * @return The new text after truncating. The truncated
     *  text will include ellipsis at the point of
     *  truncation. In addition, any whitespace before and
     *  after the text will be trimmed even if no truncation
     *  takes place.
     */
    var truncate,

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

    truncate = function(text, options) {
        //Changed "date" paramater to "text" -- doesn't that make more sense
        options = (options || {});
        text = text.trim();
        //Assumptions of how to handle no options.maxlen property
        options.maxlen = (options.maxlen || text.length);

        //Checks to see if we need to modify the text
        if (options.maxlen < text.length) {
            //removes any excess periods from the text         
            while (text.charAt(text.length-1) === ".") {
                text = text.substring(0,text.length-1);
            }
            text = text.substring(0,options.maxlen) + "...";   
        }
        return text;
    };


    return { truncate: truncate };

}());