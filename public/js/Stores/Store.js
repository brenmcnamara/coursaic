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

/**
 * The parent class for all stores.
 *
 * @class Store
 * @constructor
 */
var Store = function() {};

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
Store.prototype.addListener = function(name, method) {
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
    throw new Error("Method " + method + " is not registered for event " + event.name + ".");
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


/**
 * Register an action callback. This method is
 * called by the dispatcher to map callbacks
 * to actions.
 *
 * @method actionHandler
 *
 * @param name {String} The name of the action.
 *
 * @return {Function} A callback function that
 *  will get executed when the action is
 *  handled by the Dispatcher. This function
 *  takes a single parameter of the payload of
 *  the action. The function return must itself
 *  return a promise when it is executed. If this store
 *  does not respond to a particular action, then
 *  this method will return null instead of a function.
 */
Store.prototype.actionHandler = function(name) {
    // This method must be implemented by all
    // stores.
    throw new Error("actionHandler should be implemented by store.");
};

