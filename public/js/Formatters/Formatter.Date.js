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

    /**
     * Calculates the number of days between 2 Dates
     *
     * @method _tokenizeDateDiff
     *
     * @param date1 {Date} The start date
     *
     * @param date2 {Date} The end date
     *
     * @return An 4-tuple of numbers, representing
     * the number of days, hours, minutes, and seconds
     * that date2 is ahead of date1 
     *  
     */
    var _tokenizeDateDiff = function( date1, date2 ) {

      var one_day=1000*60*60*24,

      // Convert both dates to milliseconds
          date1_ms = date1.getTime(),
          date2_ms = date2.getTime(),

      // Calculate the difference in milliseconds
          difference_ms = date2_ms - date1_ms,

      //take out milliseconds
          difference_ms = difference_ms/1000,
          seconds = Math.floor(difference_ms % 60),
          difference_ms = difference_ms/60,
          minutes = Math.floor(difference_ms % 60),
          difference_ms = difference_ms/60,
          hours = Math.floor(difference_ms % 24), 
          days = Math.floor(difference_ms/24);
      
      return [days, hours, minutes, seconds];
    },


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
    format,

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

      options = (options || {});

      var month = ["Jan.","Feb.","March","April","May",
      "June","July","Aug.","Sept.","Oct.","Nov.","Dec."],

          dhms_difference = _tokenizeDateDiff(date,new Date()),
          diffDays = dhms_difference[0],
          diffHours = dhms_difference[1],
          diffMinutes = dhms_difference[2],
          diffSeconds = dhms_difference[3],
          returnScript = "";

      if (!options.preposition) {
          options.preposition = false;
      }
      
      if (diffDays >= 7) {
          if (options.preposition) {
              returnScript += "on ";
          }
          returnScript += month[date.getMonth()] + " " + date.getDate()
           + ", " + date.getFullYear().toString();
      } 
      else if (diffDays >= 1) {
          if (diffHours >= 12) {
            if (diffDays === 6) { 
              returnScript  += "1 week ago";
            } 
            else {
                returnScript += "" + (diffDays + 1).toString() + " days ago";
            }
          } 
          else if (diffDays === 1) {
              returnScript += "yesterday";
          }
          else {
              returnScript += "" + diffDays.toString() + " days ago";
          }
      }
      else if (diffDays === 0) {
          if (diffHours !== 23 && diffHours !== 0) {
              if (diffMinutes > 30) {
                  returnScript += "" + (diffHours + 1).toString() + " hours ago";
              } 
              else {
                  returnScript += "" + diffHours.toString() + " hours ago";
              }
          } 
          else if (diffHours === 23) {
              if (diffMinutes > 30) {
                  returnScript += "yesterday";
              } 
              else {
                  returnScript += "" + diffHours.toString() + " hours ago";
              }
          } 
          else if (diffMinutes !== 59 && diffMinutes !== 0) {
              if (diffSeconds > 30) {
                  returnScript += "" + (diffMinutes + 1).toString() + " minutes ago";
              } 
              else {
                  returnScript += "" + diffMinutes.toString() + " minutes ago";
              }
          } 
          else if (diffMinutes === 59) {
              if (diffSeconds > 30) {
                  returnScript += "" + "1 hour ago";
              }  
              else {
                  returnScript += "" + diffMinutes.toString() + " minutes ago";
              }
          } 
          else {
              if (diffSeconds > 30) {
                  returnScript += "" + "1 minute ago";
              } 
              else {
                  returnScript += "just now";
              }
          }  
      }
      return returnScript;
  };
  return { format: format };
}());

