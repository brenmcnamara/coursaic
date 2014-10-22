/**
 * dispatcher.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, Anchor, UserStore */

/**
 * The dispatcher that manages
 * traffic-control for actions.
 */
var Dispatcher = (function() {

    /* DECLARATION */

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
    var register,

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
            stores: [ConfigStore]
            
        };

    /* IMPLEMENTATION */

    register = function(name) {
        // Go through the stores and register
        // action with each store.
        var callbacks = stateMap.stores.reduce(function(memo, store) {
            var callback = store.actionHandler(name);
            if (callback) {
                memo.push(callback);
            }
            return memo;
        }, []);

        stateMap.actionHash[name] = callbacks;
    };


    dispatch = function(name, payload) {
        // Get the callbacks for the action.
        var callbacks = stateMap.actionHash[name],
            promises;

        if (!callbacks) {
            throw new Error("Action " + name + " must be registered.");
        }

        // Lock the dispatcher before doing anything.
        stateMap.locked = true;

        // Get all the promises that are produced
        // by the functions.
        if (callbacks.length > 0) {
            promises = callbacks.reduce(function(memo, callback) {
                memo.push(callback(payload));
                return memo;
            }, []);

            Promise.all(promises).then(
                // Success callback
                function() {
                    stateMap.locked = false;
                },
                // Failure callback
                function(err) {
                    stateMap.locked =  false;
                    throw err;
                });
        }
        else {
            stateMap.locked = false;
        }
    };


    return {register: register, dispatch: dispatch};

}());

