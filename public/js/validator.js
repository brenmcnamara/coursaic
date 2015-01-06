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


    /**
     * Configure the validator.
     *
     * @method config
     *
     * @param options {Object} Options used to configure the
     *  validator.
     */
    config = function (options) {
        Schema.config(options);
    },


    /**
     * Validate an action and its payload.
     *
     * @method validate
     *
     * @param action {String} The action to validate.
     *
     * @param payload {Object} The payload for the action.
     *
     * @return {Object} A results object containing all information
     *  related to the validation process.
     */
    validate = function (action, payload) {
        console.log("Validating.");
        var result = Schema.validateAction(action, payload);

        // TODO: Other checks go here.
        return result;
    };


module.exports = {
    config: config,
    validate: validate
};