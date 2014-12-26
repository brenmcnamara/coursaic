/**
 * Store.js
 *
 * Contains all the stores.
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global */

var CAEvent = require('../Event.js').CAEvent,

/**
 * The parent class for all stores.
 *
 * @class Store
 * @constructor
 */
    Store = function() {};

/**
 * A table that maps callbacks to
 *  events.
 *
 * @property _callbackHash
 * @private
 * @type Object
 */
Store.prototype._callbackHash = {};

/**
 * Add an event listener to a store.
 *
 * @method addListender
 *
 * @param name {String} The name of an event.
 *
 * @param method {function} The method to call
 *  when the event is emitted.
 */
Store.prototype.on = function(name, method) {
    if (this._callbackHash[name]) {
        // Add the method to the event.
        this._callbackHash[name].push(method);
    }
    else {
        this._callbackHash[name] = [method];
    }
};


/**
 * Remove an event listener for a given method. If
 * the method is not registered for a change event.
 * If a method is registered to an event more
 * than once, this will remove only a single instance
 * of the method.
 *
 * @throw If no method is registered for the event, this
 *  will throw an error.
 *
 * @method name {String} The name of an event.
 *
 * @method method {function} The method that is registered
 *  for the event.
 */
Store.prototype.removeListener = function(name, method) {
    var i, n,
        callbacks = this._callbackHash[name];

    if (callbacks || callbacks.length === 0) {
        for (i = 0, n = callbacks.length; i < n; ++i) {
            if (method === callbacks[i]) {
                // Replace this method with the method
                // in the back of the list.
                callbacks[i] = callbacks[n - 1];

                // reduce the size of the array by 1.
                callbacks.pop();

                // Done removing, no more looping needed.
                return;
            }
        }
    }
    throw new Error("Method " + method + " is not registered for event " + name + ".");
};


/**
 * Emit an event on a store and call all the callbacks
 * associated with that event.
 *
 * @method emit
 *
 * @param event {Event} The event to emit from
 *  the store.
 */
Store.prototype.emit = function(event) {
    (this._callbackHash[event.name] || []).forEach(function (method) {
        method(event);
    });
};


// Temporary method.
Store.prototype.performAction = function(name, payload) {
    var self = this;
    var operation = function (name, payload) {
        return self.actionHandler[name](payload);
    };

    if (arguments.length === 1) {
        // Curry this method.
        return function (payload) {
            return operation(name, payload);
        };
    }
    // Assume this has 2 arguments.
    return operation(name, payload);

};

Store.prototype.doesHandleAction = function(name) {
    return !!this.actionHandler[name];
};
exports.Store = Store;