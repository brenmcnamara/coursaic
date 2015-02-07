/**
 * actionPayload.js
 *
 * Schema validation for action payloads.
 */

var 
    validator = new (require('jsonschema').Validator)(),

    stateMap = {

        // The regular expression used to validate
        // object ids. This regular expression must
        // be provided from the config method.
        objectIdRegExp: null

    },

    schemas = {

        LOAD_COURSE: function () {
            return ({
                type: "object",
                properties: {
                        path: {
                            type: "string",
                            pattern: /((^\/$)|(^(\/([^_\/\(\)\[\]])+)+$))/
                        },
                        courseId: {
                            type: "string",
                            pattern: stateMap.objectIdRegExp
                        }
                    }
            });
        }

    },

    /**
     * Configure this module so that it is
     * ready for use. This method must be called
     * prior to any other methods on this module.
     *
     * @method config
     *
     * @param options {Object} Options used
     *  to configure the module.
     */
    config = function(options) {
        options = options || {};

        if (options.objectIdRegExp) {
            stateMap.objectIdRegExp = options.objectIdRegExp;
        }
        else {
            stateMap.objectIdRegExp = /[A-Za-z\d]+/;
        }
    },


    /**
     * Validate the schema of an action. This
     * validator will automatically return
     * true if the action cannot be found.
     *
     * @method validate
     *
     * @param action {String} The name of the action
     *  to validate.
     *
     * @param payload {Object} The payload for the action.
     *
     * @return {Object} An object containing any information
     *  retrieved while validating the payload. This includes
     *  any errors and whether or not the validation has succeeded.
     */
    validate = function (action, payload) {
        console.log("In validate.");
        var result;
        if (schemas[action]) {
            result = validator.validate(payload, schemas[action]());
            result.hasSchema = true;
            return result;
        }
        return {  hasSchema: false, valid: false };
    };


module.exports = {
    config: config,
    validate: validate
};
