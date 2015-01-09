/**
 * validator.js
 *
 * Validate the dispatch of an action
 * prior to the Dispatch occuring.
 */

var 
    Action = require('shore').Action,
    Constants = require('./constants.js'),
    Schema = require('./schema'),
    Stores = require('./Stores'),
    Util = require('shore').Util,

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
        
        {
            details: "User must be logged in.",

            actions: [ Constants.Action.LOAD_COURSE, Constants.Action.LOAD_EXAM_RUN ],

            error: Constants.ErrorType.NO_USER_CREDENTIALS,

            handler: function () {
                return !!Stores.UserStore().current();
            }

        }

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
        var result = Schema.validateAction(action, payload);

        if (!result.valid && result.hasSchema) {
            // There is a schema error.
            return result;
        }


        // No schema error detected. Go through all the
        // dispatcher checks and see if there is any other
        // error.
        preDispatchChecks.forEach(function (check) {
            if (Util.contains(check.actions, action)) {
                var error;
                // This check if relevant.
                if (!check.handler()) {
                    // The handler failed, this action
                    // is not ready to be dispatched.
                    result.valid = false;
                    error = Error("Pre-Dispatch Checks failed with error: " + check.error);
                    error.type = check.error;
                    if (result.errors) {
                        result.errors.push(error);
                    }
                    else {
                        result.errors = [error];
                    }
                }
            }
        });

        return result;
    };


module.exports = {
    config: config,
    validate: validate
};