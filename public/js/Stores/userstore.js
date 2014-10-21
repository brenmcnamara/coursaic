/**
 * userstore.js
 *
 * The store for the user.
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global StoreBase, React, Parse, ViewModel, Action */

var UserStore = (function() {

    var StoreClass = function() {},
        stateMap = {};

    StoreClass.prototype = StoreBase;

    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.DID_LOAD:
                return function(payload) {
                    // Get the promise for the login
                    // process.
                    return self._login();
                };
            default:
                return null;
        }
    };


    /**
     * Perform the login operation for the user for
     * the current user. This method will do nothing if 
     * the user is already logged in.
     *
     * @private 
     * @method _login
     *
     * @return {Promise} A promise that will be
     *  executed when the login procedure has been
     *  completed.
     */
    StoreClass.prototype._login = function() {
        var self = this;
        return new Promise(function(resolved, rejected) {
            // TODO: Perform the login operation here.
            self.emit(new CAEvent(CAEvent.Name.DID_LOAD, {}));
            resolved();
        });
    };


    /**
     * @method current
     * @return {Parse.User} The current user.
     */
     StoreClass.prototype.current = function() {
        // TODO: Access this locally.
        return Parse.User.current();
     };


    return new StoreClass();

}());

// TODO: Delete everything below here.
/*
Store.Users = (function() {
    var _performLogin,
        _didLogin,
        login,
        current;

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
*/
