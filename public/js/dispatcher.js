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
    var dispatch,

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
            locked: false
        };

    /* IMPLEMENTATION */

    dispatch = function(action) {
        // TODO: dispatcher should not directly touch
        // react js. Should dispatch directly to stores.
        // Change this to use stores to update the page.

        if (stateMap.locked) {
            throw new Error("Action is already propogating. Cannot call another action.");
        }
        stateMap.locked = true;

        if (action.getName() === "didLoad") {
            // Login the user.
            Store.Users.login();
        }
        else {
            // Not an action that is recognized.
            // Reset the state before creating any error.
            stateMap.locked = false;
            throw new Error("Unrecognized action: " + action.getName());
        }
        // Done with dispatching, so unlock.
        stateMap.locked = false;
    };


    return {dispatch: dispatch};

}());

