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

/*global React, Parse */

/**
 * Module containing all the store objects.
 *
 * @module Store
 */
var Store = {};

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
     */
    var _performLogin,

    /**
     * Handles all the post-login setup
     * of this store.
     *
     * @private
     * @method _didLogin
     * @param user {Parse.User} The user that
     *  loggedi in to the app.
     */
        _didLogin,

    /**
     * Login the user. If the user
     * is already logged in, then do
     * nothing.
     *
     * @method login
     */
        login,
    
    /**
     * @method current
     * @return {Parse.User} The current user.
     */
        current;

    /* IMPLEMENTATION */

    _performLogin = function() {
        Parse.FacebookUtils.logIn(null, {
            success: function(user) {
                _didLogin(user);
            },
            error: function(user, error) {
                alert("User cancelled the Facebook login or did not fully authorize.");
            }
        });
    };


    _didLogin = function(user) {
        var params;

        if (!user.existed()) {
            // Get the user data from facebook.
            // Note: This information might change. Current implementation
            // assumes this never changes.
            params = {fields: 'first_name,last_name,picture.type(square)'};
            FB.api('/me', params, function(response) {
                user.set('firstName', response.first_name);
                user.set('lastName', response.last_name);
                user.set('photoUrl', response.picture.data.url);
                user.save();

                // Render after all the data has been fetched.
                View.render("home");
            });
        }
        else {
            // Render after all the data has been fetched.
            View.render("home");
        }
    };


    login = function() {
        FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
                _didLogin(current());
            }
            else {
                _performLogin();
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

    /**
     * Initial configuration for the
     * courses store.
     *
     * @method config
     */
    var config;
}());
