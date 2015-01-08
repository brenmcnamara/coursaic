/**
 * action.js
 *
 * Defines the Action object that is used
 * to communicate behavior between the Views
 * and dispatcher.
 */

var Dispatcher = require('./dispatcher.js'),


    /**
     * Send an action through the dispatcher.
     *
     * @method send
     *
     * @param name {String} The name of the
     *  action.
     *
     * @param payload {Object} The action
     *  parameters.
     *
     * @param options {Object} Options that can be injected
     *  into the dispatch of the action. This includes success
     *  and error callbacks when the action has completed dispatching.
     */
    send = function(name, payload) {
        return Dispatcher.dispatch(name, payload);
    };

module.exports = {
    send: send
};

