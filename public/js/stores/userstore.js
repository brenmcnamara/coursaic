/**
 * UserStore.js
 */

/*global Parse, Action, Store */


var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    StoreBuilder = require('shore').StoreBuilder,
    Constants = require('../constants.js'),

    logger = require('shore').logger,


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
            var self = this;

            // Combine all the promises into one promise.
            return new Promise(function (resolve, reject) {
                self._userHash[user.id] = user;
                resolve();
            });
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
        _login: function(username, password) {
            var self = this;

            return Parse.User.logIn(username, password)
                        .then(
                            function (user) {
                                logger.log(logger.Level.INFO, "Login successful.");
                                return self._didLogin(user);
                            },
                            function (user, error) {
                                // TODO: Set the error type to something
                                // related to login failed.
                                logger.log(logger.Level.Error, "Login error.");
                                throw error;
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

            LOGIN: function (payload) {
                // Check if the user is already logged in.
                if (this.current()) {
                    logger.log(logger.Level.INFO, "Skipping login. User already logged in.");

                    // Return an empty promise, the user is
                    // already logged in on the client.
                    return new Promise(function (resolve) {
                        resolve();
                    });
                }
                else {
                    logger.log(logger.Level.INFO, "Logging in user " + payload.username + ".");
                    // Need to login the user.
                    return this._login(payload.username, payload.password);
                }

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
