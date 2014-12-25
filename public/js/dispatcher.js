/**
 * dispatcher.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/





var

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
        waitHash_reject: {}

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
     * Register a list of stores with the dispatcher.
     *
     * @method register
     *
     * @param name {Array} An array of stores to get tracked
     *  by the dispatcher.
     */
    register = function(stores) {
        stateMap.stores = stores.slice();
        // Assign a dispatcherIndex to each store.
        stateMap.stores.forEach(function (store, index) {
            store.dispatcherIndex = (index + 1);
        });
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
     * @return { Array } An array of actionHandler objects.
     */
    actionHandlers = function (name) {
        return stateMap.stores.reduce(function(memo, store) {
            var callback = store.actionHandler[name];
            if (callback) {
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
     * @throw If the action has not yet been
     *  registered.
     */
    dispatch = function(name, payload) {
        // Get the callbacks for the action.
        var self = this,
            storeCalls = actionHandlers(name),
            promises;

        if (!storeCalls) {
            throw new Error("Action " + name + " must be registered.");
        }

        if (stateMap.locked) {
            throw new Error("Dispatcher trying to dispatch " + name +
                            " while an action is already dispatching.");
        }

        // Lock the dispatcher before doing anything.
        stateMap.locked = true;
        this._currentAction = name;
        // Get all the promises that are produced
        // by the functions.
        if (storeCalls.length > 0) {
            promises = storeCalls.map(function(storeCall) {
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
                            reject(err);
                            // Notify all objects waiting for the
                            // resolution of this callback to resolve
                            // that the callback has rejection.
                            (stateMap.waitHash_reject[index] || [])
                            .forEach(function(wait_reject) {
                                    wait_reject();
                                });
                            // Empty out all resolution and rejection
                            // calls associated with this index.
                            stateMap.waitHash_resolve[index] = [];
                            stateMap.waitHash_reject[index] = [];
                        }
                    );
                });
            });
            // TODO: Make better name for promises. 
            Promise.all(promises).then(
                // Success callback
                function() {
                    stateMap.locked = false;
                    self._currentAction = null;
                },
                // Failure callback
                function(err) {
                    stateMap.locked =  false;
                    self._currentAction = null;
                    console.error(err);
                    throw err;
                });
        }
        else {
            stateMap.locked = false;
            this._currentAction = null;
        }
    };


module.exports = {
    dispatch: dispatch,
    register: register,
    waitFor: waitFor
};

