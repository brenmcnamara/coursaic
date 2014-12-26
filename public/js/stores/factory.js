/**
 * factory.js
 */


var EventEmitter = require('events').EventEmitter,
    StoreBase = function () { },

    // Note: Stores must implemenet actionHandler object.
    createStore = function (obj) {
        // The constructor for the new store.
        var prop,
            Constructor = function () {
                this.setMaxListeners(20);
                if (this.initialize) {
                    this.initialize();
                }
            };

        Constructor.prototype = new StoreBase();

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                Constructor.prototype[prop] = obj[prop];
            }
        }
        return Constructor;
    };

// Setup the Base Class for all store objects. The base
// class inherits from the EventEmitter object and has
// a couple of additional methods for action handling.
StoreBase.prototype = new EventEmitter();

StoreBase.prototype.doesHandleAction = function (action) {
    return !!this.actionHandler[action];
};


StoreBase.prototype.performAction = function (action, payload) {
    // This function needs to be curry-able.
    var operation = function (action, payload) {
        return this.actionHandler[action].call(this, payload);
    }.bind(this);

    if (arguments.length === 1) {
        return function (payload) {
            return operation(action, payload);
        };
    }
    // Assume this has the correct number of arguments.
    return operation(action, payload);
};


module.exports = {
    createStore: createStore
};

