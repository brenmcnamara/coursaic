/**
 * CourseStore.js
 */

var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    Constants = require('../constants.js'),
    StoreBuilder = require('shore').StoreBuilder,

    Course = require('./models.js').Course,

    Query = require('./query.js'),

    /**
     * A Store containing all data related to
     * courses.
     *
     * @module Store
     * @class CourseStore
     */
    CourseStore = StoreBuilder.createStore({

        /***********************************\
                   PRIVATE METHODS
        \***********************************/

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
                                // If the course already exists in the _courses
                                // array, then replace the element with this course.
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
            return this._loadTagsForCourse(course);
        },


        /**
         * Load all the tags in the course and add them
         * to the course object.
         */
        _loadTagsForCourse: function (course) {
            var self = this;
            return Promise.all(
                (course.get('tags') || [])
                    // Filter out all the tags that have
                    // already been added to the tag hash.
                    .filter(function (tag, index) {
                        return !self._tagHash[tag.id];
                    })

                    .map(function (tag) {
                        return new Promise(function (resolve) {
                            tag.fetch({
                                success: function (tag) {
                                    self._tagHash[tag.id] = tag;
                                    resolve();
                                },
                                error: function (error) {
                                    throw error;
                                }
                            });
                        });
                    })
            )
            // After all the tags for all the courses
            // have been loaded.
            .then(function () {
                // Add the tags to the course.
                var tagList = course.get('tags') || [];

                // Replace the tags with the updated ones from
                // the hash. Note that some of these tags might
                // already be updated from the tag hash but there
                // are some that need to be force updated here.
                course.set('tags', tagList.map(function (tag) {
                    return self._tagHash[tag.id];
                }));
            });
        },


        /***********************************\
                    PUBLIC METHODS
        \***********************************/

        initialize: function () {
            this._courses = [];
            // A set of all the tags for any courses.
            this._tagHash = {};
        },


        /**
         * Fetch the courses.
         *
         * @method fetchCourses
         *
         * @return {Promise} A promise that executed when the
         *  asynchronous call has returned.
         */
        fetchCourses: function() {
            var self = this;

            return new Promise(function (resolve, reject) {
                var query = new Parse.Query(Course);

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

                        // Get the promises that are mapped
                        // from all the _loadCourses calls.
                        Promise.all(results.map(function(course) {
                            return self._loadCourse(course);
                        })).then(
                            // Success
                            function() {
                                // Pass on the courses to the next promise.
                                resolve(results);
                            }
                        );
                    },
                    error: function(error) {
                        throw error;
                    }
                });
            })

            // Done fetching all the courses from the backend.
            // Now time to load the tags for each of those courses.
            .then(function (courses) {
                return Promise.all(courses.map(function (course) {
                    return self._loadCourse(course);
                }));
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
        currentCourse: function() {
            // TODO: Maybe make this throw an
            // error if the current key is not called on
            // the correct page.
            return (Stores.PageStore().courseId()) ?
                    this.courseWithId(Stores.PageStore().courseId()) :
                    null;
        },


        /**
         * A variadic method that takes query objects
         * and generates a single course after performing
         * all the queries. If multiple users exist from
         * the queries, then the first one in the set
         * will be returned.
         *
         * @method getOne
         *
         * @return {User} A course object.
         */
        getOne: function () {
            console.log("Get one was called.");
            return this.getAll.apply(this, arguments)[0] || null;
        },


        /**
         * A variadic method that takes query objects
         * and generates a set of courses after performing
         * all the queries.
         *
         * @method getAll
         *
         * @return {Array} An array of courses.
         */
        getAll: function () {
            return [].reduce.call(arguments, function (memo, query) {
                return query(memo);
            }, this._courses);
        },


        /***********************************\
                      NAMESPACES
        \***********************************/
        
        actionHandler: {

            LOAD_COURSE: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex ])

                // After the user store has completed what it needs to do.
                .then(function () {
                    var course;
                    // Get the course if the course does not
                    // already exist.
                    if (!self.courseWithId(payload.courseId)) {
                        // Don't have the course, need to fetch it.
                        course = new Course();
                        course.id = payload.courseId;
                        return self._fetchCourse(course);
                    }
                });
            },

            LOGIN: function (payload) {
                // When the user is logged in, we need to get course data.
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex ])
                            // Done waiting for the User Store.
                           .then(
                            // Success.
                            function() {
                                return self.fetchCourses();
                            })
                           // Finished getting the next set of courses.
                           .then(
                                // Success.
                                function() {
                                    self.emit(Constants.Event.DID_FETCH_COURSES);
                                });
            }
            
        },


        query: {

            filter: {

                courseWithId: Query.createQuery(function (data) {
                    console.log("Course with id filter");
                    var courseId = this.params[0];
                    return data.filter(function (course) {
                        return courseId === course.id;
                    });
                }),

                coursesForUser: Query.createQuery(function (data) {
                    var user = this.params[0];
                    return data.filter(function (course) {
                        return user.isEnrolled(course);
                    });
                }),

                coursesNotForUser: Query.createQuery(function (data) {
                    var user = this.params[0];
                    return data.filter(function (course) {
                        return !user.isEnrolled(course);
                    });
                })

            }
        }


    }),


    // Create an instance of the course store
    // to use as a local reference.
    store = new CourseStore();


module.exports = store;

