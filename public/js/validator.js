/**
 * validator.js
 *
 * Validate the dispatch of an action
 * prior to the Dispatch occuring.
 */

var 
    Action = require('./Action.js').Action,

    Schema = require('./schema'),

    /**
     * An array of all checks that need to happen
     * before the action is considered valid.
     *
     * @property preDispatchChecks
     * @private
     *
     * @type Array
     */
    preDispatchChecks = [
        // TODO: Implement me!
    ],

    validate = function (action, payload) {
        var result = Schema.validateAction(action, payload);

        // TODO: Other checks go here.

        return result;
    };


module.exports = {
    validate: validate
};