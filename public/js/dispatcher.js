/**
 * dispatcher.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, Anchor, React */

/**
 * The dispatcher that manages
 * traffic-control for actions.
 */
var Dispatcher = (function() {

    /* DECLARATION */

    /**
     * Handles asynchonous calls
     * and provides a mechanism for stores
     * to register that any asynchronous
     * (or synchonous) process has been
     * finished.
     *
     * @constructor Token
     * @class
     * @param count {number} The number of completions
     * necessary before the dispatcher is notified
     * that an action has been completed.
     */
    // TODO: Add error-handling in the token as well.
    var Token,

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
     * @property stateMap
     * @type Object
     */
        stateMap = {
            // Indicates if the dispatcher
            // is locked due to a propogating
            // event. Only 1 event can fire
            // at a time.
            locked: false,
        };

    /* IMPLEMENTATION */

    /* TOKEN CLASS */

    Token = function(count) {
        this._count = count;
        this._current = 0;
    };


    /**
     * Register a callback for when the
     * token is done executing.
     *
     * @class Token
     * @method onDone
     */
    Token.prototype.onDone = function(callback) {
        this._callback = callback;
    };


    /**
     * Notify that an operation
     * has finished executing.
     *
     * @class Token
     * @method done
     */
    Token.prototype.done = function() {
        this._current = (this._current + 1);
        if (this._count === this._current) {
            this._callback();
        }
        else if (this._count < this._current) {
            throw new Error("Token has notified completion too many times.");
        }
    };


    dispatch = function(action) {
        // TODO: Handle errors that are thrown
        // by any of the stores that get called.
        var token,
            tokenCallback = function() {
                console.log("Hello world");
                stateMap.locked = false;
            };

        if (stateMap.locked) {
            throw new Error("Action is already propogating. Cannot call another action.");
        }
        stateMap.locked = true;


        if (action.getName() === "didLoad") {

            token = new Token(1);
            // Register callback before propogating any
            // stores since some of the actions may
            // be synchonous.
            token.onDone(tokenCallback);
            // Login the user.
            Store.Users.login(token);
        }
        else {
            // Not an action that is recognized.
            // Reset the state before creating any error.
            stateMap.locked = false;
            throw new Error("Unrecognized action: " + action.getName());
        }

    };


    return {Token: Token, dispatch: dispatch};

}());

