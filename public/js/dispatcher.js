/**
 * dispatcher.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, React */

/**
 * The dispatcher that manages
 * traffic-control for actions.
 */
var Dispatcher = (function() {

    /* DECLARATION */

    /**
     * Registers a store with the
     * dispatcher, so that the store
     * will get updated whenever an
     * action is passed through the dispatcher.
     *
     * @method register
     * @param store {Store, Array} The store object
     * (or array of store objects) to register for
     * actions.
     */
    var register,

    /**
     * Dispatch an action through to the stores.
     *
     * @method dispatch
     * @param action {Action} The action to
     * dispatch.
     *
     * @throw An error if the dispatcher is
     * already propogating an event. Only
     * one event can be dispatched at a time.
     */
        dispatch,

    /**
     * Contains all the state for the dispatcher.
     *
     * @private
     * @property
     * @type Object
     */
        stateMap = {
            // Indicates if the dispatcher
            // is locked due to a propogating
            // event. Only 1 event can fire
            // at a time.
            locked: false
        };

    /* IMPLEMENTATION */

    register = function(store) {
        // TODO: Implement me!
    };


    dispatch = function(action) {
        // TODO: dispatcher should not directly touch
        // react js. Should dispatch directly to stores.
        // Change this to use stores to update the page.

        if (stateMap.locked) {
            throw new Error("Action is already propogating. Cannot call another action.");
        }
        stateMap.locked = true;

        if (action.getName() === "didLoad") {
            // Expecting this parameter to have
            // a parameter specifying the page to
            // render.
            View.render(action.getParams().page);

        }
        // Not an action that is recognized.
        // Reset the state before creating any error.
        stateMap.locked = false;
        throw new Error("Unrecognized action: " + action.getName());
    };


    return {register: register, dispatch: dispatch};

}());

