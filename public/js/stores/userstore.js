/**
 * UserStore.js
 */

/*global Parse, Action, Store */


var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    StoreBuilder = require('shore').StoreBuilder,
    Constants = require('../constants.js'),

    logger = require('shore').logger,


    User = require('./models.js').User,

    Query = require('./query.js'),

    /**
     * The Store that manages all user data as
     * well as login and logout operations.
     *
     * @module Store
     * @class UserStore
     */
    UserStore = StoreBuilder.createStore({


        /***********************************\
                   PRIVATE METHODS
        \***********************************/

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
            if (user.id !== this.currentUser().id) {
                this._userHash[user.id] = user;
            }
        },


        /**
         * @method current
         *
         * @return {Parse.User} The current user.
         */
        _currentUser: function () {
            return Parse.User.current();
        },


        /**
         * Get all the users in the store
         * in array form.
         *
         * @method _getUserList
         *
         * @return {Array} An array of all the
         *  users in the user store.
         */
        _getUserList: function () {
            var list = [],
                prop;

            for (prop in this._userHash) {
                if (this._userHash.hasOwnProperty(prop)) {
                    list.push(this._userHash[prop]);
                }
            }
            return list;
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


        /***********************************\
                    PUBLIC METHODS
        \***********************************/

        initialize: function () {
            this._userHash = {};
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
        fetchAuthorOfExam: function (exam) {
            var self = this;
            return new Promise(function(resolve, reject) {
                exam.get('author').fetch({
                    success: function (user) {
                        self._addUser(user);
                        resolve();
                    },

                    error: function (error) {
                        throw error;
                    }
                });
            });
        },


        /**
         * A variadic method that takes query objects
         * and generates a single user after performing
         * all the queries. If multiple users exist from
         * the queries, then the first one in the set
         * will be returned.
         *
         * @method getOne
         *
         * @return {User} A user object.
         */
        getOne: function () {
            return this.getAll.apply(this, arguments)[0] || null;
        },


        /**
         * A variadic method that takes query objects
         * and generates a set of users after performing
         * all the queries.
         *
         * @method getAll
         *
         * @return {Array} An array of users.
         */
        getAll: function () {
            return [].reduce.call(arguments, function (memo, query) {
                return query(memo);
            }, this._getUserList());
        },


        /***********************************\
                      NAMESPACES
        \***********************************/

        actionHandler: {


            LOGIN: function (payload) {
                // Check if the user is already logged in.
                if (this._currentUser()) {
                    logger.log(logger.Level.INFO, "Skipping login. User already logged in.");

                    return this._didLogin(this._currentUser());
                }
                else {
                    logger.log(logger.Level.INFO, "Logging in user " + payload.username + ".");
                    // Need to login the user.
                    return this._login(payload.username, payload.password);
                }
            },


            LOGOUT: function (payload) {
                return new Promise(function (resolve) {
                    Parse.User.logOut();
                    resolve();
                });
            },


            SIGNUP: function (payload) {
                // Create a new user.
                var user = new User();
                user.set('firstName', payload.firstName);
                user.set('lastName', payload.lastName);
                user.set('username', payload.email);
                user.set('email', payload.email);
                user.set('password', payload.password);

                return user.signUp(null);
            },


            RESET_PASSWORD: function (payload) {
                return Parse.User.requestPasswordReset(payload.email);
            }


        },


        query: {

            current: Query.createQuery(function (data) {
                return data.filter(function (user) {
                    return user.id === store._currentUser().id;
                });
            })

        }


    }),

    // Instance of the user store for local reference.
    store = new UserStore();


module.exports = store;
