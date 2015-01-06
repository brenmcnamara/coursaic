/**
 * Util.js
 *
 * Contains utility functions that may be
 * used by this project.
 */

var argumentRegExp = /<[A-Za-z_]+>/g,
    
    argumentNameRegExp = /[A-Za-z_]+/g,

    Util = {
    
        /**
         * Check if an array contains an element.
         * This function will use triple equals to
         * determine if the array contains the given element.
         *
         * @method contains
         *
         * @param array {Array} The array to examine.
         *
         * @param obj {Object} The object to check if the
         *  array contains.
         *
         * @return {Boolean} True if the obj is contained by the
         *  array, false otherwise.
         */
        contains: function (array, obj) {
            var i, n;
            for (i = 0, n = array.length; i < n; ++i) {
                if (obj === array[i]) {
                    return true;
                }
            }
            return false;
        },


        /**
         * Make a deep copy of an object.
         *
         * @method copy
         * 
         * @param obj {Object} The object to be copied.
         *
         * @return {Object} A deep copy of the object.
         */
        copy: function(obj) {
            var prop, objCopy;
            switch (typeof obj) {
            case 'string':
            case 'number':
                return obj;
            case 'function':
                // Just leave functions by reference
                return obj;
            case 'object':
                if (!obj) {
                    // it is null
                    return null;
                }
                else if (Array.isArray(obj)) {
                    return obj.slice();
                }
                objCopy = {};
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        objCopy[prop] = Util.copy(obj[prop]);
                    }
                }
                return objCopy;
            default:
                return obj;
            }
        },


        /**
         * Take a set of objects and extend the
         * last object to contain all the properties of the
         * previous objects.
         *
         * @method extend
         *
         * @throw An error if any of the arguments are not
         *  objects that can be extended. Objects that can
         *  be extended include anything of type function,
         *  and any object that is not null or undefined.
         *
         * @return {Object} The object that was extended
         *  to contain the properties of the other objects.
         */
        extend: function () {
            var obj, i, n, prop;
            // Check that all objects are of the correct type.
            [].forEach.call(arguments, function (obj) {
                if (typeof obj !== 'function' && (typeof obj !== 'object' || !obj)) {
                    throw new Error("All arguments to extend must be ");
                }
            });

            if (arguments.length === 0) {
                return null;
            }
            obj = arguments[arguments.length - 1];
            for (i = 0, n = arguments.length - 1; i < n; ++i) {
                for (prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        obj[prop] = arguments[i][prop];
                    }
                }
            }
            return obj;
        },


        /**
         * Convert a pattern to a string using values that are
         * passed into an object.
         *
         * @method patternToString
         *
         * @param pattern {String} The pattern to convert
         *  into a string.
         *
         * @param argMap {Object} The object containing all
         *  the arguments that go into the string.
         */
        patternToString: function (pattern, argMap) {
            var args = pattern.match(argumentRegExp),
                argNames = args.map(function (arg) {
                    return arg.match(argumentNameRegExp)[0];
                }),
                argValues = argNames.map(function (argName) {
                    return argMap[argName];
                });

            return args.reduce(function (memo, arg, index) {
                return memo.replace(arg, argValues[index]);
            }, pattern);
        }


    };


module.exports = Util;
