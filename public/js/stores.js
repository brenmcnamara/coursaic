/**
 * stores.js
 *
 * Contains all the stores.
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global React, Parse, ViewModel */

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
 * @param event {Event} An event that is being
 *  propogated by the store.
 *
 * @param method {function} The method to call
 *  when the event is emitted.
 */
Store.prototype.addListener = function(event, method) {
    if (this._callbackHash[event.name]) {
        // Add the method to the event.
        this._callbackHash[event.name].push(method);
    }
    else {
        this._callbackHash[event.name] = [method];
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
 * @method event {Event} The event to remove the listener
 *  for.
 *
 * @method method {function} The method that is registered
 *  for the event.
 */
Store.prototype.removeListener = function(event, method) {
    var i, n,
        callbacks = this._callbackHash[event.name];

    if (callbacks || callbacks.length === 0) {
        for (i = 0, n = callbacks.length; i < n; ++i) {
            if (method === callbacks[i]) {
                // Replace this method with the method
                // in the back of the list.
                callbacks[i] = callbacks[n - 1];

                // reduce the size of the array by 1.
                callbacks.pop();
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


// TODO: Delete everything below this.

/**
 * @module Store
 * @class Users
 */
Store.Users = (function() {

    /* DECLARATION */

    /**
     * Perform the login process
     * without checking if the user
     * is already logged in to Facebook.
     *
     * @private
     * @method _performLogin
     *
     * @param token {Dispatcher.Token} A dispatch token
     * to notify of any actions that have been completed.
     */
    var _performLogin,

    /**
     * Handles all the post-login setup
     * of this store.
     *
     * @private
     * @method _didLogin
     *
     * @param user {Parse.User} The user that
     * logged in to the app.
     *
     * @param token {Dispathcer.Token} A dispatch
     * token to notify of any actions that have been completed.
     */
        _didLogin,

    /**
     * Login the user. If the user
     * is already logged in, then do
     * nothing.
     *
     * @method login
     *
     * @param token {Dispatcher.Token} A dispatch
     * token to notify of any actions that have been completed.
     */
        login,
    
    /**
     * @method current
     * @return {Parse.User} The current user.
     */
        current;

    /* IMPLEMENTATION */

    _performLogin = function(token) {
        Parse.FacebookUtils.logIn(null, {
            success: function(user) {
                _didLogin(user);
                token.done();
            },
            error: function(user, error) {
                alert("User cancelled the Facebook login or did not fully authorize.");
                token.done();
            }
        });
    };


    _didLogin = function(user, token) {
        var params;

        if (!user.existed()) {
            // Get the user data from facebook.
            // Note: This information might change. Current implementation
            // assumes this never changes.
            params = {fields: 'first_name,last_name,picture.type(square)'};
            FB.api("/me", params, function(response) {
                user.set("firstName", response.first_name);
                user.set("lastName", response.last_name);
                user.set("photoUrl", response.picture.data.url);
                user.save();

                // Render after all the data has been fetched.
                View.render("home", {
                    user: ViewModel.user(current())
                });
                token.done();
            });
        }
        else {
            // Render after all the data has been fetched.
            View.render("home", {
                user: ViewModel.user(current())
            });
            token.done();
        }
    };


    login = function(token) {
        FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
                _didLogin(current(), token);
            }
            else {
                _performLogin(token);
            }
        });  
    };


    current = function() {
        return Parse.User.current();
    };


    return {login: login, current: current};

}());


/**
 * @module Store
 * @class Courses
 */
Store.Courses = (function() {

    /* DECLARATION */


}());

