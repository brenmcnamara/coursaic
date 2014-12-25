/**
 * Util.js
 *
 * Contains utility functions that may be
 * used by this project.
 */


var Util = {
    
    /**
     * Make a deep copy of the object.
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
    }

};


module.exports = Util;
