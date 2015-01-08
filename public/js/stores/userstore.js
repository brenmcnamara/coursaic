/**
 * UserStore.js
 */

/*global Parse, Action, Store */


var Stores = require('../stores'),
    Dispatcher = require('../flex-node').Dispatcher,
    StoreBuilder = require('../flex-node').StoreBuilder,
    Constants = require('../constants.js'),

    School = Parse.Object.extend("School"),


    /**
     * The Store that manages all user data as
     * well as login and logout operations.
     *
     * @module Store
     * @class UserStore
     */
    UserStore = StoreBuilder.createStore({

        initialize: function () {
            this._userHash = {};
        },


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
        _didLogin: function(user) {
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
                        
                        resolve();
                    }
                    else {
                        resolve();
                    }
                }),

                // Fetch school promise will get the school for the indicated
                // user from the parse server.
                fetchSchoolPromise = new Promise(function(resolve, reject) {
                    // Upenn hard-coded here.
                    var school = new School();
                    school.id = "rQIGXlBeyE";
                    user.set('school', school);
                    user.get('school').fetch({
                        success: function(model, response, options) {
                            resolve();
                        },

                        error: function(model, response, options) {
                            throw new Error("The school of the user could not be fetched.");
                        }
                    });
                });

            // Add the current user to the hash.
            this._userHash[user.id] = user;
            // Combine all the promises into one promise.
            return Promise.all([fbPromise, fetchSchoolPromise]);
        },


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
        _login: function() {
            var self = this;
            return new Promise(function(resolve, reject) {
                // Callback after the user has logged in successfully.
                var onDidLoginSuccess = function() {
                        resolve();
                    },

                    onDidLoginFailure = function(error) {
                        throw error;
                    };

                // First check if the user connection status with Facebook.
                // Check if they are logged in to Facebook, not just Parse.
                FB.getLoginStatus(function(response) {
                    if (response.status === "connected" && Parse.User.current()) {
                        // They are logged in to Facebook.
                        self._didLogin(self.current()).then(onDidLoginSuccess, onDidLoginFailure);
                    }
                    else {
                        // They are NOT logged in to Facebook.

                        // User is not logged in. Perform the login operation.
                        Parse.FacebookUtils.logIn(null, {
                            success: function(user) {
                                self._didLogin(user).then(onDidLoginSuccess,
                                                          onDidLoginFailure);
                            },
                            error: function(user, error) {
                                throw error;    
                            }
                        });
                    }
                }); 
            });
        },


        /**
         * Add a user to the collection.
         *
         * @method _addUser
         * @private
         *
         * @param user {Parse.User} The user to add to
         *  the store.
         */
        _addUser: function(user) {
            // Avoid updating the user if it is the current
            // user. This may cause consistency issues with
            // Parse.
            if (user.id !== this.current().id) {
                this._userHash[user.id] = user;
            }
        },


        actionHandler: {

            LOAD_HOME: function (payload) {
                return this._login();
            }

        },


        /**
         * @method current
         *
         * @return {Parse.User} The current user.
         */
        current: function() {
            return Parse.User.current();
        },


        /**
         * Get the author of the exam for the course.
         *
         * @method fetchAuthorOfExam
         *
         * @param exam {Exam} The exam to get the author for.
         *
         * @return {Promise} The promise that gets called when
         *  fetching the author has completed.
         */
        fetchAuthorOfExam: function(exam) {
            var self = this;
            return new Promise(function(resolve, reject) {
                exam.get('author').fetch({
                    success: function(user) {
                        self._addUser(user);
                        resolve();
                    },

                    error: function(error) {
                        throw error;
                    }
                });
            });
        }
    

    });


module.exports = new UserStore();
