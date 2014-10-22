/**
 * ConfigStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global React, Parse, Action, CAEvent */

/**
 * Contains all the major state for the current
 * page that defines the type of page it is, and
 * the major attributes of the page.
 *
 * @module Store
 * @class ConfigStore
 */
var ConfigStore = (function() {

    var StoreClass = function() {};

    StoreClass.prototype = new Store();

    
    /**
     * @method _login
     *
     * @return {Promise} A promise object that gets called
     *  when the login process has completed.
     */
    StoreClass.prototype._login = function() {
        var self = this;
        return new Promise(function(resolved, rejected) {
            // TODO: Perform the login operation here.
            console.log("Loggin in the user!");
            self.emit(new CAEvent(CAEvent.Name.DID_LOAD, {}));
            resolved();
        });
    };


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:
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
     * @method school
     *
     * @return {Parse.Object} The school that is currently
     *  being represented on the page. Null if no school is
     *  being represented on the page.
     */
    StoreClass.prototype.school = function() {
        return null;
    };


    /**
     * @method user
     *
     * @return {Parse.User} The user that is being represented
     *  on the current page. Null if no user is being represented
     *  on the page.
     */
    StoreClass.prototype.user = function() {
        return Parse.User.current() || null;
    };


    /**
     * @method exam
     *
     * @return {Parse.Object} The exam that is being represented
     *  on the current page. Null if no exam is being represented
     *  on the page.
     */
    StoreClass.prototype.exam = function() {
        return null;
    };


    /**
     * @method pageKey
     *
     * @return {String} A key representing the current page.
     */
    StoreClass.prototype.pageKey = function() {
        // Currently, on the home page is being represented.
        // Change this when adding other pages.
        return 'home';
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


