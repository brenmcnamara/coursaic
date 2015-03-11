/**
 * formatter.js
 *
 * File containing formatter.
 */

var 

    tokenizeDateDiff = function (date1, date2) {
        var one_day = 1000 * 60 * 60 * 24,

            // Convert both dates to milliseconds
            date1_ms = date1.getTime(),
            date2_ms = date2.getTime(),

            // Calculate the difference in milliseconds
            difference_ms = date2_ms - date1_ms,
            seconds = 0,
            minutes = 0,
            hours = 0,
            days = 0;

            //take out milliseconds
            difference_ms = difference_ms/1000;
            seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms/60;
            minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms/60;
            hours = Math.floor(difference_ms % 24); 
            days = Math.floor(difference_ms/24);
          
        return [days, hours, minutes, seconds];
    },

    Formatter = {

        Time: {

            /**
             * Takes the time in secons and returns a string representing that
             * time.
             */
            format: function (time, options) {
                var minutes = Math.floor(time / 60),
                    seconds = Math.floor(time % 60),

                    minutesText = (minutes < 10) ? '0' + minutes.toString() : minutes.toString(),
                    secondsText = (seconds < 10) ? '0' + seconds.toString() : seconds.toString();

                return minutesText + ':' + secondsText;
            }

        },


        Date: {

            format: function (date, options) {
                // TODO: Very high branching factor, re-implement to
                // not have so many if-else statements.
                options = (options || {});

                var month = ["Jan.","Feb.","March","April","May",
                             "June","July","Aug.","Sept.","Oct.","Nov.","Dec."],

                    dhms_difference = tokenizeDateDiff(date,new Date()),
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
                    returnScript += month[date.getMonth()] +
                                    " " + date.getDate() +
                                    ", " + date.getFullYear().toString();
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
            }


        },

        Text: {
            
            truncate: function(text, options) {
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
            }
        },

        Number: {

            format: function (number, options) {
                var formatted = number.toString(),
                    decimalIndex;

                options = (options || {});

                if (options.placesAfterDecimal === 0) {
                    formatted = Math.floor(number).toString();
                }
                else if (options.placesAfterDecimal > 0) {
                    decimalIndex = formatted.search(/\./);
                    if (decimalIndex >= 0) {
                        // Found the decimal place.
                        if ((formatted.length - decimalIndex - 1) < options.placesAfterDecimal) {
                            formatted = 
                                Formatter.Number._addZeros(formatted,
                                                           decimalIndex - 1 - options.placesAfterDecimal);
                        }
                        else if ((formatted.length - decimalIndex - 1) > options.placesAfterDecimal) {
                            // Remove zeros.
                            formatted = formatted.substr(0, decimalIndex + 1 + options.placesAfterDecimal);
                        }
                        // If it is equal, nothing needs to be done.
                    }
                    else if (options.placesAfterDecimal > 0) {
                        // Did not find a decimal in the number,
                        // this is an integer. Only need to add
                        // zeros to the integer if the number of
                        // zeros at the end is greater than 0.
                        formatted = Formatter.Number._addZeros(formatted + ".", options.placesAfterDecimal);
                    }


                }

                console.log("Formatted is " + formatted);
                return formatted;
            },

            /**
             * Add zeros to the end of a string and return
             * the new string.
             *
             * @method _addZeros
             * @private
             *
             * @param string { String } The string to add zeros to.
             *
             * @return { String } A new string with zeros appended.
             */
            _addZeros: function (string, numberOfZeros) {
                while (numberOfZeros > 0) {
                    string = string + "0";
                    --numberOfZeros;
                }
                return string;
            }

        }

    };


module.exports = Formatter;
