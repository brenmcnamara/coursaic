/**
 * index.js
 *
 * Entry point for the schema submodule.
 */

var
    actionPayloadValidator = require('./actionPayload.js'),

    /**
     * Configure the schema module. This method should
     * be called before using the module.
     *
     * @method config
     *
     * @param options {Object} Any options that
     *  are used to configure this module.
     */
    config = function (options) {
        actionPayloadValidator.config(options);
    },


    /**
     * Validate the payload of an action to make
     * sure that it has the correct schema.
     *
     * @method validateAction
     *
     * @param action {String} The name of the action.
     *
     * @param payload {Object} The payload for the action.
     *
     * @return {Object} An object containing all validator
     *  information that was retrieved while trying to
     *  validate the payload. This includes errors and
     *  whether the validation passed.
     */
    validateAction = function (action, payload) {
        return actionPayloadValidator.validate(action, payload);
    };



module.exports = {
    config: config,
    validateAction: validateAction

};