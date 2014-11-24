/**
 * dispatcher.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, Anchor, UserStore, CourseStore, ConfigStore */

/**
 * The dispatcher that manages
 * traffic-control for actions.
 */
var Dispatcher = (function() {

    /* DECLARATION */

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
    var waitFor,

    /**
     * Register an action with the store. If an action
     * was already registered with the store, this will
     * clear any state that was previously registered.
     * All actions must be registered before they are
     * dispatched.
     *
     * @method register
     *
     * @param name {String} The name of the action to
     *  register.
     */
        register,

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
        dispatch,

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

            // A mapping of actions to callbacks.
            // When an action is dispatched,
            // all the callbacks for that action
            // are executed.
            actionHash: {},

            // A reference to each store
            // for the dispatcher to use
            // and iterate. Stores can also
            // be referenced directly, but
            // these regerences can be used
            // for performing generic algorithms
            // over each store.
            // TODO: Should have a way for UserStores
            // to get registered when the app is initialized.
            stores: [ConfigStore, CourseStore, UserStore, ExamStore],
            
            // A list of all resolves that are on the
            // wait list. This is a map of
            // dispatcherIndex -> Array of resolve callbacks.
            waitHash_resolve: {},

            // A list of all rejects that are on the
            // wait list. This is a map of
            // dispatcherIndex -> Array of reject callbacks.
            waitHash_reject: {}

        };

    /* IMPLEMENTATION */

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
    };


    register = function(name) {
        // Go through the stores and register
        // action with each store.
        var storeCalls = stateMap.stores.reduce(function(memo, store) {
            var callback = store.actionHandler(name);
            if (callback) {
                if (typeof callback !== 'function') {
                    throw new Error("Dispatcher will only register objects of type" +
                                    "'function' from actionHandler.");
                }
                memo.push({'index': store.dispatcherIndex, 'callback': callback});
            }
            return memo;
        }, []);

        stateMap.actionHash[name] = storeCalls;
    };


    dispatch = function(name, payload) {
        // Get the callbacks for the action.
        var storeCalls = stateMap.actionHash[name],
            promises;

        if (!storeCalls) {
            throw new Error("Action " + name + " must be registered.");
        }

        // Lock the dispatcher before doing anything.
        stateMap.locked = true;
        // Get all the promises that are produced
        // by the functions.
        if (storeCalls.length > 0) {
            promises = storeCalls.map(function(storeCall) {
                var index = storeCall.index,
                    callback = storeCall.callback;
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
            // TODO (brendan): Make better name for promises. 
            Promise.all(promises).then(
                // Success callback
                function() {
                    stateMap.locked = false;
                },
                // Failure callback
                function(err) {
                    stateMap.locked =  false;
                    console.error(err);
                    throw err;
                });
        }
        else {
            stateMap.locked = false;
        }
    };


    return {register: register, dispatch: dispatch, waitFor: waitFor};

}());

