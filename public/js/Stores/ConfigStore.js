/**
 * ConfigStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global FB, Parse, Action, CAEvent */

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
     * Perform any operations after the user has been
     * logged in.
     *
     * @method _didLogin
     *
     * @param user {Parse.User} The user that was logged in.
     *
     * @return {Promise} A promise object that gets
     *  called when the post-login process has completed.
     */
    StoreClass.prototype._didLogin = function(user) {
        return new Promise(function(resolved, rejected) {
            var params;
            if (!user.existed()) {
                // Get the user data from facebook.
                // Note: This information might change. Current implementation
                // assumes this never changes.
                params = {fields: 'first_name,last_name,picture.type(square)'};
                // TODO: Make sure to handle errors coming back from
                // the facebook api.
                FB.api("/me", params, function(response) {
                    user.set("firstName", response.first_name);
                    user.set("lastName", response.last_name);
                    user.set("photoUrl", response.picture.data.url);
                    // Save to the parse database. Response of save
                    // is not being reaped, might want to change this later.
                    user.save();
                    resolved();
                });
            }
            else {
                resolved();
            }
        });
    };


    /**
     * @method _login
     *
     * @return {Promise} A promise object that gets called
     *  when the login process has completed.
     */
    StoreClass.prototype._login = function() {
        var self = this;

        return new Promise(function(resolved, rejected) {
            // Callback after the user has logged in successfully.
            var onDidLoginSuccess = function() {
                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD, {pageKey: self.pageKey()}));
                    resolved();
                },

                onDidLoginFailure = function(error) {
                    throw error;
                };

            // First check if the user connection status with Facebook.
            // Check if they are logged in to Facebook, not just Parse.
            FB.getLoginStatus(function(response) {
                if (response.status === "connected") {
                    // They are logged in to Facebook.
                    self._didLogin(self.user()).then(onDidLoginSuccess, onDidLoginFailure);
                }
                else {
                    // They are NOT logged in to Facebook.

                    // User is not logged in. Perform the login operation.
                    Parse.FacebookUtils.logIn(null, {
                        success: function(user) {
                            self._didLogin(self.user()).then(onDidLoginSuccess, onDidLoginFailure);
                        },
                        error: function(user, error) {
                            throw error;    
                        }
                    });
                }
            }); 
        });
    };


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:
                return function(payload) {
                    // Get the promise for the login process.
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

