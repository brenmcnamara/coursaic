/**
 * ConfigStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, CAEvent, Store */

var UserStore = (function() {

    var StoreClass = function() {
        this.dispatcherIndex = 3;
        // A hash of id -> Parse.User
        this._userHash = {};
    };

    StoreClass.prototype = new Store();

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
            fbPromise = new Promise(function(resolve, reject) {
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
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            }),

            // Fetch school promise will get the school for the indicated
            // user from the parse server.
            fetchSchoolPromise = new Promise(function(resolve, reject) {
                user.get('school').fetch({
                    success: function(model, response, options) {
                        resolve();
                    },

                    error: function(model, response, options) {
                        throw new Error("The school of the user could not be fetched.");
                    }
                });
            }),

            // TODO (brendan): This method will be called before CourseStore
            // is ready but that's okay, because this method does
            // not need to be called after CourseStore's setup (it can be called
            // at anytime). Need to document which methods need to be called
            // after setup of Stores.
            fetchEnrolledPromise = CourseStore.fetchCoursesForUser(user);

        // Add the current user to the hash.
        this._userHash[user.id] = user;
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

        return new Promise(function(resolve, reject) {
            // Callback after the user has logged in successfully.
            var onDidLoginSuccess = function() {
                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                    resolve();
                },

                onDidLoginFailure = function(error) {
                    throw error;
                };

            // First check if the user connection status with Facebook.
            // Check if they are logged in to Facebook, not just Parse.
            FB.getLoginStatus(function(response) {
                if (response.status === "connected") {
                    // They are logged in to Facebook.
                    self._didLogin(self.current()).then(onDidLoginSuccess, onDidLoginFailure);
                }
                else {
                    // They are NOT logged in to Facebook.

                    // User is not logged in. Perform the login operation.
                    Parse.FacebookUtils.logIn(null, {
                        success: function(user) {
                            self._didLogin(self.current()).then(onDidLoginSuccess,
                                                                onDidLoginFailure);
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
              return new Promise(function(resolve, reject) {
                    Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        .then(self._login.bind(self))
                        .then(function() {
                            resolve();
                        });
                });              
            };
        default:
            return null;
        }
    };


    /**
     * @method current
     *
     * @return {Parse.User} The current user.
     */
    StoreClass.prototype.current = function() {
        return Parse.User.current();
    };


    /**
     * Get the users that are enrolled in a course.
     * These users are added to the UserStore.
     *
     * @method fetchEnrolledUsers
     *
     * @param course {Course} The course to get the users
     *  for. This will set the enrollCount attribute on the
     *  course.
     *
     * @return {Promise} A promise that is executed when
     *  fetching the course has completed.
     */
    StoreClass.prototype.fetchEnrolledUsers = function(course) {
        var self = this,
            userQuery = new Parse.Query(Parse.User);

        userQuery.equalTo('enrolled', course);
        return new Promise(function(resolve, reject) {
            userQuery.find({
                // Success
                success: function(results) {
                    // Add the users to the UserStore
                    // if they do not already exist.
                    course.set('enrollCount', results.length);
                    results.forEach(function(user) {
                        // Overwrite any users when fetching a new
                        // set of users. This saves a conditional
                        // check and creates updates in case
                        // user information has changed.
                        
                        // To avoid issues with parse, don't update
                        // the user if the user fetched is the
                        // currently logged in user.
                        if (self.current().id !== user.id) {
                            self._userHash[user.id] = user;
                        }
                    });
                    resolve(results);
                },
                // Error
                error: function(error) {
                    throw error;
                }
            });
        });
    };


    return new StoreClass();

}());

