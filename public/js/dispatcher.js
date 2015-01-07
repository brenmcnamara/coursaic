/**
 * dispatcher.js
 */

/*global -Promise */

var 

    Promise = require('Promise'),

    /**
     * Contains all the state for the dispatcher.
     *
     * @private
     * @property stateMap
     * @type Object
     */
    stateMap = {
        // Indicates if the dispatcher
        // is locked due to a propogating
        // event. Only 1 event can fire
        // at a time.
        locked: false,

        // A reference to each store
        // for the dispatcher to use
        // and iterate. Stores can also
        // be referenced directly, but
        // these regerences can be used
        // for performing generic algorithms
        // over each store.
        stores: [ ],
        
        // A list of all resolves that are on the
        // wait list. This is a map of
        // dispatcherIndex -> Array of resolve callbacks.
        waitHash_resolve: {},

        // A list of all rejects that are on the
        // wait list. This is a map of
        // dispatcherIndex -> Array of reject callbacks.
        waitHash_reject: {},

        // A set of hooks that can be registered to be called
        // at any point during the dispatch process.
        hooks: {}

    },


    /**
     * Coordinates synchronizing store calls during
     * an action. A store can wait for another store to
     * finish executing before the store handles a
     * particular action.
     *
     * @method waitFor
     *
     * @param waitList {Array} A list of dispatcher
     *  indexes of stores to wait for.
     *
     * @throw An error if waitFor is called when the
     *  dispatcher is currently not dispatching an
     *  action.
     *
     * @return {Promise} A promise that is executed when
     *  all the stores in the waitFor list are done
     *  executing.
     */
    waitFor = function(waitList) {
        return Promise.all(waitList.map(function(dispatcherIndex) {
            return new Promise(function(resolve, reject) {
                // Assume that the waitHash_resolve and waitHash_reject
                // lists are symmetric. If an element in waitHash_resolve
                // exists, then an element in waitHash_reject
                // must also exist.
                if (stateMap.waitHash_resolve[dispatcherIndex]) {
                    stateMap.waitHash_resolve[dispatcherIndex].push(resolve);
                    stateMap.waitHash_reject[dispatcherIndex].push(reject);
                }
                else {
                    stateMap.waitHash_resolve[dispatcherIndex] = [resolve];
                    stateMap.waitHash_reject[dispatcherIndex] = [reject];
                }
            });
        }));
    },


    /**
     * Configure the dispatcher for use. This method must be
     * called before the dispatcher can be used.
     *
     * @method config
     *
     * @param options {Object} Any options needed to configure
     *  the dispatcher. This must include an array of
     *  stores to register with the dispatcher (key="stores").
     */
    config = function(options) {
        var stores = options.stores;

        stateMap.stores = stores.slice();
        // Assign a dispatcherIndex to each store.
        stateMap.stores.forEach(function (store, index) {
            store.dispatcherIndex = (index + 1);
        });

        stateMap.hooks.preDispatchValidator = options.preDispatchValidator || null;
    },


    /**
     * Generate the action handlers for a particular action.
     * This is an array of objects, each object containing an
     * index field and a callback field. The index is the dispatcherIndex
     * of the store that is handling the action and the callback is the
     * stores callback for the action.
     *
     * @method actionHandler
     * @private
     * @param name {Action.Name} The name of the action.
     *
     * @return {Array} An array of actionHandler objects.
     */
    actionHandlers = function (name) {
        return stateMap.stores.reduce(function(memo, store) {
            var callback;
            if (store.doesHandleAction(name)) {
                callback = store.performAction(name);
                if (typeof callback !== 'function') {
                    throw new Error("Dispatcher will only register objects of type " +
                                    "'function' from actionHandler. Cannot register " +
                                    name + " from store with index " + store.dispatcherIndex);
                }
                memo.push({'index': store.dispatcherIndex, 'callback': callback});
            }
            return memo;
        }, []);
    },


    /**
     * Check if there is an error when validating
     * the action and payload.
     *
     * @method validateError
     * @private
     *
     * @param action {Action.Name} The name of the action
     *  to validate.
     *
     * @param payload {Object} The payload of the action to validate.
     *
     * @return {Error} The error if there is one, null otherwise.
     */
    validateError = function (action, payload) {
        if (stateMap.hooks.preDispatchValidator) {
            return stateMap.hooks.preDispatchValidator(action, payload);
        }
        return null;
    },


    /**
     * Dispatch an action through to the stores.
     *
     * @method dispatch
     *
     * @param name {name} The name of the action
     *  to dispatch.
     *
     * @param payload {Object} The parameters associated
     *  with the action.
     *
     * @throw If the dispatcher is currently
     *  dispatching another action (only 1 action can be
     *  propogated at a time).
     *
     * @return {Promise} A promise that is completed once
     *  either all the stores have completed their actions or
     *  an error has occurred.
     */
    dispatch = function(name, payload) {
        // Get the callbacks for the action.
        return new Promise(function (resolve, reject) {
            var error,
                self = this,
                storeCalls = actionHandlers(name),
                actionHandlerPromises;

            if (stateMap.locked) {
                throw new Error("Dispatcher trying to dispatch " + name +
                                " while an action is already dispatching.");
            }

            error = validateError(name, payload);

            if (error) {
                throw error;
            }

            // Lock the dispatcher before performing dispatch to
            // stores.
            console.log("Locking.");
            stateMap.locked = true;
            this._currentAction = name;
            // Get all the promises that are produced
            // by the functions.
            if (storeCalls.length > 0) {
                actionHandlerPromises = storeCalls.map(function(storeCall) {
                    var index = storeCall.index,
                        callback = storeCall.callback;
                    // TODO: Clean up unnecessary nested promises.
                    return new Promise(function(resolve, reject) {
                        callback(payload).then(
                            // On success
                            function() {
                                resolve();
                                // Notify all objects waiting for the
                                // resolution of this callback to notify
                                // that the callback has resolved.
                                (stateMap.waitHash_resolve[index] || [])
                                    .forEach(function(wait_resolve) {
                                        wait_resolve();
                                    });
                                // Empty out all resolution and rejection
                                // calls associated with this index.
                                stateMap.waitHash_resolve[index] = [];
                                stateMap.waitHash_reject[index] = [];
                            },
                            // On error
                            function(err) {
                                console.log("Error called.");
                                // TODO: Take another look at this
                                // error handling here.
                                
                                // Notify all objects waiting for the
                                // resolution of this callback to resolve
                                // that the callback has rejection.
                                (stateMap.waitHash_reject[index] || [])
                                .forEach(function(wait_reject) {
                                        wait_reject(err);
                                    });
                                // Empty out all resolution and rejection
                                // calls associated with this index.
                                stateMap.waitHash_resolve[index] = [];
                                stateMap.waitHash_reject[index] = [];
                                // Reject the encompassing promise created
                                // at the root of Dispatch's scope.
                                reject(err);
                            }
                        );
                    });
                });

                Promise.all(actionHandlerPromises)
                    // All store promises have completed.
                    .then(
                        // Success callback
                        function() {
                            stateMap.locked = false;
                            self._currentAction = null;
                            resolve();
                        },

                        // Failure callback
                        function(err) {
                            stateMap.locked =  false;
                            self._currentAction = null;

                            reject(err);
                        });
            }
            else {
                // No actions to take, just resolve this action.
                stateMap.locked = false;
                this._currentAction = null;
                resolve();
            }
        });
    
    };


module.exports = {
    dispatch: dispatch,
    config: config,
    waitFor: waitFor
};

