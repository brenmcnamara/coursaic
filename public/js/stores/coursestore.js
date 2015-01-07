/**
 * CourseStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

var Stores = require('../Stores'),
    Dispatcher = require('../torque').Dispatcher,
    Constants = require('../constants.js'),

    Field = require('./models.js').Field,
    Course = require('./models.js').Course,

    /**
     * A Store containing all data related to
     * courses.
     *
     * @module Store
     * @class CourseStore
     */
    CourseStore = Stores.Factory.createStore({

        initialize: function () {
            this._isFetching = false;
            this._page = 0;
            this._limit = 30;

            this._courses = [];
        },

        actionHandler: {

            CREATE_COURSE: function (payload) {
                var self = this;
                // TODO: Note that if this fails,
                // createCourse mode will be exited since this
                // is getting called after the config store.
                // Not strongly exception-safe.
                return Dispatcher.waitFor([ Stores.PageStore().dispatcherIndex ])
                       // Wait for the config store to update the hash.
                       .then(
                        // Success.
                        function() {
                            var course = new Course(),
                                fieldId = payload.fieldId;
                            // Set the field object on the payload so
                            // it is added to the new course instance.
                            payload.field = new Field();
                            payload.field.id = fieldId;
                            // Add the school of the current user.
                            payload.school = Stores.UserStore().current().get('school');
                            // Enroll the current user into the course.
                            payload.enrolled = [ Stores.UserStore().current() ];
                            // Remove the field id from the payload before
                            // setting it on the course.
                            delete payload.fieldId;
                            course.set(payload);
                            return new Promise(function(resolve, reject) {
                                // TODO: Modify this using the
                                // promise syntax.
                                course.save({
                                    success: function(course) {
                                        self._courses.push(course);
                                        // Pass along the course.
                                        resolve(course);
                                    },

                                    error: function(error) {
                                        throw error;
                                    }
                                });
                            });
                        },
                        // Error.
                        function(error) {
                            throw error;
                        })
                        // Wait for the course to be saved.
                        .then(
                        // Success.
                        function(course) {
                            return self._loadCourse(course);
                        },
                        // Error.
                        function(error) {
                            throw error;
                        })
                        // Wait for the course to be saved.
                        .then(
                        // Success.
                        function() {
                            // TODO: Maybe pass the course as a parameter
                            // to this event.
                            self.emit(Constants.Event.DID_CREATE_COURSE);
                        },
                        // Error.
                        function(error) {
                            // TODO: Should I cancel create course mode?
                            throw error;
                        });
            },


            ENROLL_CURRENT_USER: function (payload) {
                var self = this,
                    course = self.courseWithId(payload.courseId);
                // Note that this call will cause an error to occur
                // if the user is already enrolled in the course.
                course.addUser(Stores.UserStore().current());
                return course.save()
                             .then(
                                // Success.
                                function() {
                                    self.emit(Constants.Event.DID_CHANGE_ENROLLMENT);
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
            },


            LOAD_COURSE: function (payload) {
                var self = this;
                // Wait for the User to be loaded.
                // Load all the information for the course.
                // NOTE: This is needed by the exam page key so that
                // the exam store can load the exam and question related
                // to the single exam of the course.
                // Just make sure the single course is loaded.
                return new Promise(function (resolve, reject) {
                    var course;
                    // Get the course if the course does not
                    // already exist.
                    if (!self.courseWithId(payload.courseId)) {
                        // Don't have the course, need to fetch it.
                        course = new Course();
                        course.id = payload.courseId;
                        self._fetchCourse(course)
                            .then(
                                function () {
                                    resolve();
                                },

                                function (error) {
                                    reject(error);
                                });
                    }
                    else {
                        resolve();
                    }
                });
            },


            LOAD_EXAM_RUN: function (payload) {
                var self = this;
                // Load all the information for the course.
                // NOTE: This is needed by the exam page key so that
                // the exam store can load the exam and question related
                // to the single exam of the course.
                // Just make sure the single course is loaded.
                return new Promise(function (resolve, reject) {
                    var course;
                    // Get the course if the course does not
                    // already exist.
                    if (!self.courseWithId(payload.courseId)) {
                        // Don't have the course, need to fetch it.
                        course = new Course();
                        course.id = payload.courseId;
                        self._fetchCourse(course)
                            .then(
                                function () {
                                    resolve();
                                },

                                function (error) {
                                    reject(error);
                                });
                    }
                    else {
                        resolve();
                    }
                });
            },


            LOAD_HOME: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex ])
                            // Done waiting for the User Store.
                           .then(
                            // Success.
                            function() {
                                return self.fetchPage();
                            },
                            // Error.
                            function(error) {
                                throw error;
                            })
                           // Finished getting the next set of courses.
                           .then(
                                // Success.
                                function() {
                                    self.emit(Constants.Event.DID_FETCH_COURSES);
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
            },


            UNENROLL_CURRENT_USER: function (payload) {
                var self = this,
                    course = self.courseWithId(payload.courseId);
                    course.removeUser(Stores.UserStore().current());
                return course.save()
                             .then(
                                // Success.
                                function() {
                                    self.emit(Constants.Event.DID_CHANGE_ENROLLMENT);
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
            }

            
        },


        /**
         * Create a query object used to fetch courses. This method
         * should only be called after a User has been logged in.
         *
         * @method _createQuery
         * @private
         *
         * @param requestMap {Object} The request parameters
         *  to configure the requests.
         *
         * @return {Parse.Query} The query to perform
         *  a network request.
         */
        _createCourseQuery: function(requestMap) {
            var query = new Parse.Query(Course);
            // Only get schools for the user.
            query.equalTo('school', Stores.UserStore().current().get('school'));
            query.limit(requestMap.limit);
            query.skip(requestMap.skip);

            return query;
        },


        /**
         * Fetch all the data for a course and all the course's
         * properties.
         *
         * @method _fetchCourse
         * @private
         *
         * @param course {Course} The course to be fetched.
         *
         * @return {Promise} A promise that is executed when
         *  the course has successfully been fetched.
         */
        _fetchCourse: function(course) {
            var self = this;
            return new Promise(function(resolve, reject) {
                course.fetch({
                    success: function() {
                        // TODO: Separate out load and
                        // fetch course calls.
                        self._loadCourse(course).then(
                            // Success
                            function() {
                                // Add the course to the course array.
                                var i, n, foundCourse;
                                for (i = 0, n = self._courses.length && !foundCourse; i < n; ++i) {
                                    if (course.id === self._courses[i].id) {
                                        // Refresh the course in the collection.
                                        self._courses[i] = course;
                                        foundCourse = true;
                                    }
                                }

                                // Add the new course to the collection.
                                if (!foundCourse) {
                                    self._courses.push(course);
                                }
                                resolve();
                            },
                            // Failure
                            function(error) {
                                throw error;
                            }
                        );
                    },
                    error: function(error) {
                        throw error;
                    }
                });
            });
        },


        /**
         * Load all the data for a single course.
         * This loading may occur asynchronously. This method
         * assumes that course.fetch has already been called on
         * the course itself. This method is intented to fetch
         * data within the course.
         *
         * @method _loadCourse
         * @private
         *
         * @param course {Course} The course to load
         *  the data for.
         *
         * @return {Promise} A promise that is completed
         *  when all the data for the course has been
         *  loaded. The success callback of the promise
         *  will contain a single parameter of the course
         *  that was loaded. The failure callback will contain
         *  the error describing the failure.
         */
        _loadCourse: function(course) {
            var 
                fieldPromise = Stores.FieldStore().fetchFieldForCourse(course),

                schoolPromise = new Promise(function(resolve, reject) {
                    course.get('school').fetch({
                        success: function() {
                            resolve(course);
                        },
                        error: function(error) {
                            throw error;
                        }
                    });
                });

            return Promise.all([fieldPromise, schoolPromise])
                          // Unify the promises to return a promise that will pass
                          // a single parameter of the course that was loaded.
                          .then(
                            // Success.
                            function() {
                                return new Promise(function(resolve, reject) {
                                    resolve(course);
                                });
                            },
                            // Error.
                            function(error) {
                                throw error;
                            });
        },


        /**
         * Fetch the courses for a given school.
         *
         * @method fetch
         *
         * @return {Promise} A promise that executed when the
         *  asynchronous call has returned.
         */
        fetchPage: function() {
            var self = this;
            if (this._isFetching) {
                throw new Error("Cannot fetch courses while a fetch is in progress.");
            }

            this._isFetching = true;
            return new Promise(function (resolve, reject) {
                var query = self._createCourseQuery(
                {
                    limit: self._limit,
                    skip: self._page * self._limit
                });
                query.find({
                    success: function(results) {
                        // Reduce the list of results to courses
                        // that don't already exist in the CourseStore.
                        results = results.reduce(function(memo, course) {
                            if (self.courseWithId(course.id)) {
                                return memo;
                            }
                            else {
                                memo.push(course);
                                return memo;
                            }
                        }, []);

                        // Add the courses that were just
                        // fetched to the list of courses
                        // that already exist.
                        self._courses.push.apply(self._courses, results);

                        // Increment the paging value for the next fetch.
                        self._page += 1;

                        // Get the promises that are mapped
                        // from all the _loadCourses calls.
                        Promise.all(results.map(function(course) {
                            return self._loadCourse(course);
                        })).then(
                            // Success
                            function() {
                                self._isFetching = false;
                                resolve();
                            },
                            // Error
                            function() {
                                throw new Error("Failed to fetch data for courses");
                            }
                        );
                    },
                    error: function(error) {
                        self._isFetching = false;
                        throw error;
                    }
                });
            });
        },


        /**
         * Get the course with the given id.
         *
         * @method courseWithId
         *
         * @param course_id {String} The id of the course
         * to fetch from the store.
         *
         * @return {Course} A course object with the given id. If the
         *  course object does not exist in the collection, this will return
         *  null.
         */
        courseWithId: function(course_id) {
            var i, n;
            for (i = 0, n = this._courses.length; i < n; ++i) {
                if (this._courses[i].id === course_id) {
                    return this._courses[i];
                }
            }
            return null;
        },


        /**
         * Get all the courses that a user is enrolled in.
         *
         * @method coursesForUser
         *
         * @param user {User} The user to get the courses for.
         *
         * @return {Array} An array of courses that the user is
         *  enrolled in.
         */
        coursesForUser: function(user) {
            return this._courses.filter(function(course) {
                return course.isEnrolled(user);
            });
        },


        /**
         * Get the current course for the page.
         *
         * @method current
         *
         * @return {Course} The current course. If the pageKey
         *  is not 'course', this will return null.
         */
        current: function() {
            // TODO: Maybe make this throw an
            // error if the current key is not called on
            // the correct page.
            return (Stores.PageStore().courseId()) ?
                    this.courseWithId(Stores.PageStore().courseId()) :
                    null;
        },


        forEach: function(callback) {
            this._courses.forEach(callback);
        },


        map: function(callback) {
            return this._courses.map(callback);
        }


    });


module.exports = new CourseStore();

