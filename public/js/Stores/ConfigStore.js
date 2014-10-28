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
     * Indicates if the ConfigStore
     * is ready for other stores to
     * query its data.
     *
     * @property _isReady
     * @private
     * @type Boolean
     */
    StoreClass.prototype._isReady = false;

    /**
     * An array of callbacks containing all
     * the callbacks from stores that
     * are waiting for the ConfigStore to
     * be ready with its initial configuration
     * data. These callbacks can be added
     * through the onReady method.
     *
     * @property _readyResolves
     * @type Array
     */
    StoreClass.prototype._readyResolves = [];


    /**
     * Perform any operations after the user has been
     * logged in.
     *
     * @method _didLogin
     * @private
     *
     * @param user {Parse.User} The user that was logged in.
     *
     * @return {Promise} A promise object that gets
     *  called when the post-login process has completed.
     */
    StoreClass.prototype._didLogin = function(user) {

        
        var 
            // Facebook promise will perform any operations needed
            // with the facebook api.
            fbPromise = new Promise(function(resolved, rejected) {
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
            }),

            // Fetch school promise will get the school for the indicated
            // user from the parse server.
            fetchSchoolPromise = new Promise(function(resolved, rejected) {
                user.get('school').fetch({
                    success: function(model, response, options) {
                        resolved();
                    },

                    error: function(model, response, options) {
                        throw new Error("The school of the user could not be fetched.");
                    }
                });
            }),

            fetchEnrolledPromise = CourseStore.fetchCoursesForUser(user);
        // Combine all the promises into one promise.
        return Promise.all([fbPromise, fetchSchoolPromise, fetchEnrolledPromise]);
    };


    /**
     * Login the user and perform any actions associated with logging
     * in.
     *
     * @method _login
     * @private
     *
     * @return {Promise} A promise object that gets called
     *  when the login process has completed.
     */
    StoreClass.prototype._login = function() {
        var self = this;

        return new Promise(function(resolved, rejected) {
            // Callback after the user has logged in successfully.
            var onDidLoginSuccess = function() {
                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD,
                                          {pageKey: self.pageKey()}));
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


    /**
     * Set the state of the ConfigStore to ready
     * and perform any other necessary actions
     * associated with setting the ready status.
     *
     * @method _becomeReady
     * @private
     *
     * @throw An error if trying to set the ready status
     * of the ConfigStore to true when it is already true.
     */
    StoreClass.prototype._becomeReady = function() {
        if (this._isReady) {
            throw new Error("Setting the ready status of the config store to " +
                            "true when it is already set to true.");
        }

        // Call any pending resolves.
        this._readyResolves.forEach(function(resolve) {
            resolve();
        });
        // Empty out all the pending resolves.
        this._readyResolves = [];
    };


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:
                return function(payload) {
                    // Get the promise for the login process.
                    return new Promise(function(resolve, rejected) {
                        self._login().then(
                            // Successful login.
                            function() {
                                self._becomeReady();
                                resolve();
                            },
                            // Failed login.
                            function() {
                                throw new Error("Login failed.");
                            }
                        );
                    });
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
        // Note: This won't be the case when the page
        // is not the normal page key.
        return this.user().get('school');
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
        // Change this when adding other pages. The page key will
        // have to be provided by the application and used to
        // configure other parts of this store.
        return 'home';
    };


    /**
     * A method for other stores to synchonnize with
     * with the ConfigStore. Because the ConfigStore contains
     * a lot of information that may be relevant to other stores,
     * so other stores may need to wait for this initial content
     * to the config store is ready.
     *
     * @return {Promise} A promise that is propogated
     *  when the ConfigStore is ready with its configuration
     *  information.
     */
    StoreClass.prototype.onReady = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            if (self._isReady) {
                // The config store is ready, just
                // resolve the promise.
                resolve();
            }
            else {
                // The config store is not yet ready,
                // save the resolve function and
                // call it when the store becomes ready.
                self._readyResolves.push(resolve);
            }
        });
    };


    return new StoreClass();

}());

