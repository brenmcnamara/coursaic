/**
 * UserStore.js
 */

/*global Parse, Action, Store */


var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    StoreBuilder = require('shore').StoreBuilder,
    Constants = require('../constants.js'),

    ShoreError = require('shore').Error,

    logger = require('shore').logger,


    User = require('./models.js').User,
    Course = require('./models.js').Course,

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

        _Query: Query.queryBuilder({

            currentUser: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (user) {
                        return user.id === store._currentUser().id;
                    })
                });
            },

            usersForCourse: function (course) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (user) {
                        return user.isEnrolled(course);
                    })
                });
            }

        }),

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
         * @private
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
         * @private
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

        query: function () {
            return new this._Query(this._getUserList());
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

        /***********************************\
                      NAMESPACES
        \***********************************/

        actionHandler: {

            ENROLL_CURRENT_USER: function (payload) {
                var self = this,
                    CourseStore = Stores.CourseStore(),
                    courseId = payload.courseId,
                    course = CourseStore.query().courseWithId(courseId).getOne();

                this._currentUser().enroll(course);
                return this._currentUser().save().then(function () {
                    self.emit(Constants.Event.CHANGED_ENROLLMENT);
                });
            },

            LOAD_COURSE: function (payload) {
                var error,
                    self = this;
                if (!this._currentUser()) {
                    throw ShoreError(Constants.ErrorType.NO_USER_CREDENTIALS,
                                     "User is not logged in.");
                }

                // Otherwise, the user is logged in.
                return this._didLogin(this._currentUser())
                // Finished doing didLogin operation.
                .then(function() {
                    var courseId = payload.courseId,
                        course = new Course(),
                        query = new Parse.Query(User);

                    course.id = courseId;
                    query.equalTo("enrolled", course);
			
                    return query.find();
			
                })
                // Called when the users for a course are fetched.
                .then(function(users) {
                    users.forEach(function (user) {
                        self._userHash[user.id] = user;
                    });
                });
            },

            LOAD_HOME: function (payload) {
                var self = this;
                return new Promise(function (resolve) {
                    var user = self._currentUser();
                    if (!user) {
                        throw ShoreError(Constants.ErrorType.NO_USER_CREDENTIALS,
                                         "User is not logged in.");
                    }
                    self._userHash[user.id] = user;
                    resolve();
                });
            },

            LOAD_SPLASH: function (payload) {
                var self = this;

                return new Promise(function (resolve) {
                    var user = Parse.User.current();
                    if (user) {
                        throw ShoreError(Constants.ErrorType.EXISTING_USER_CREDENTIALS, "User already logged in.");
                    }
                    resolve();
                });
            },

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

            RESET_PASSWORD: function (payload) {
                return Parse.User.requestPasswordReset(payload.email);
            },

            SIGNUP: function (payload) {
                logger.log(logger.Level.INFO, "Signing up new user");
                // Create a new user.
                var user = new User();
                user.set('firstName', payload.firstName);
                user.set('lastName', payload.lastName);
                user.set('username', payload.email);
                user.set('email', payload.email);
                user.set('password', payload.password);

                return user.signUp(null);
            },

            UNENROLL_CURRENT_USER: function (payload) {

                var self = this,
                    CourseStore = Stores.CourseStore(),
                    courseId = payload.courseId,
                    course = CourseStore.query().courseWithId(courseId).getOne();


                this._currentUser().unenroll(course);
                return this._currentUser().save().then(function () {
                    self.emit(Constants.Event.CHANGED_ENROLLMENT);
                });
            }

        }

    }),

    // Instance of the user store for local reference.
    store = new UserStore();


module.exports = store;
