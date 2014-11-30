/**
 * FieldStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global FB, Parse, Action, CAEvent */

/**
 * A Course object.
 *
 * @class Course
 * @constructor
 */
var Course = Parse.Object.extend("Course", {

        /**
         * Check the number of people enrolled in a particular
         * course.
         *
         * @method enrollCount
         *
         * @return {Number} The enroll count of the course.
         */
        enrollCount: function() {
            return (this.get('enrolled') || []).length;        
        },


        /**
         * See if a user is enrolled in a particular
         * course.
         *
         * @method isEnrolled
         *
         * @param user {User} The user to check for
         *  enrollment.
         *
         * @return {Boolean} True if the user is enrolled in
         *  the course, false otherwise.
         */
        isEnrolled: function(user) {
            var enrolled = (this.get('enrolled') || []),
                i, n;

            for (i = 0, n = enrolled.length; i < n; ++i) {
                if (user.id === enrolled[i].id) {
                    return true;
                }
            }
            return false;
        },


        /**
         * Add a user to the course so that he/she is
         * now enrolled. This method does not perform
         * any persistence.
         *
         * @method addUser
         *
         * @param user {User} The user to add.
         *
         * @throw An error if the user is already added
         *  to this course.
         */
        addUser: function(user) {
            var enrolled;
            if (this.isEnrolled(user)) {
                throw new Error("Could not find user " + user.id + " while" +
                                "adding to course " + this.id);
            }
            enrolled = this.get('enrolled') || [];
            enrolled.push(user);
            this.set('enrolled', enrolled);
        },


        /**
         * Remove a user from the course so that he/she
         * is no longer enrolled. THis method does not
         * perform any persistence.
         *
         * @method removeUser
         *
         * @param user {User} The user to remove.
         *
         * @throw An erro if the user is not already
         *  enrolled in the course.
         */
        removeUser: function(user) {
            var enrolled = this.get('enrolled') || [],
                i, n, indexOfUser = -1;
            for (i = 0, n = enrolled.length; i < n && indexOfUser < 0; ++i) {
                if (enrolled[i].id === user.id) {
                    indexOfUser = i;
                }
            }
            if (indexOfUser < 0) {
                throw new Error("Could not find user " + user.id + " while " +
                                "removing from course " + this.id);
            }
            enrolled = enrolled.slice(0, indexOfUser)
                               .concat(enrolled.slice(indexOfUser + 1, n));
            this.set('enrolled', enrolled);
        }


    }),
    

    /**
     * A Store containing all data related to
     * courses.
     *
     * @module Store
     * @class CourseStore
     */
    CourseStore = (function() {

        var StoreClass = function() {
            this.dispatcherIndex = 2;
            this._isFetching = false;
            this._page = 0;
            this._limit = 30;
            // TODO (brendan): Consider turning this into
            // a hash table of courses and changing related
            // methods.
            this._courses = [];
        };

        StoreClass.prototype = new Store();

        StoreClass.prototype.actionHandler = function(name) {
            var self = this;
            switch(name) {
            case Action.Name.PERFORM_LOAD:
                return function(payload) {
                    switch (payload.pageKey) {
                    case 'home':
                        // Fetch a page-worth of courses.
                        return Dispatcher.waitFor([ConfigStore.dispatcherIndex,
                                                   UserStore.dispatcherIndex])
                                // Done waiting for the ConfigStore
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
                                        self.emit(new CAEvent(CAEvent.Name.DID_FETCH_COURSES))
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    });
                    case 'course':
                    case 'exam':
                        // Wait for the User to be loaded.
                        // Load all the information for the course.
                        // NOTE: This is needed by the exam page key so that
                        // the exam store can load the exam and question related
                        // to the single exam of the course.
                        // Just make sure the single course is loaded.
                        return Dispatcher.waitFor([ConfigStore.dispatcherIndex,
                                                   UserStore.dispatcherIndex])
                               .then(
                                    // Success.
                                    function() {
                                        var course;
                                        // Get the course if the course does not
                                        // already exist.
                                        if (!payload.course) {
                                            throw new Error("PERFORM_LOAD must provide course id in payload");
                                        }
                                        if (!self.courseWithId(payload.course)) {
                                            // Don't have the course, need to fetch it.
                                            course = new Course();
                                            course.id = payload.course;
                                            return self._fetchCourse(course);
                                        }
                                    },

                                    // Error.
                                    function(error) {
                                        throw error;
                                    }
                                );

                    default:
                        return new Promise(function(resolve, reject) {
                            resolve();
                        });
                    }
                };
            case Action.Name.ENTER_CREATE_COURSE_MODE:
                return function(payload) {
                    return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                            // Done waiting for ConfigStore to finish.
                           .then(
                            // Success.
                            function() {
                                self.emit(new CAEvent(CAEvent.Name.DID_BEGIN_EDITING));
                            },
                            // Error.
                            function(error) {
                                throw error;
                            });
                };
            case Action.Name.CREATE_COURSE:
                return function(payload) {
                    // TODO (brendan): Note that if this fails,
                    // createCourse mode will be exited since this
                    // is getting called after the config store.
                    // Not strongly exception-safe.
                    // TODO (brendan): Make sure that the app is in
                    // createCourse mode in the first place.
                    return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
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
                                payload.school = UserStore.current().get('school');
                                // Enroll the current user into the course.
                                payload.enrolled = [UserStore.current()];
                                // Remove the field id from the payload before
                                // setting it on the course.
                                delete payload.fieldId;
                                course.set(payload);
                                return new Promise(function(resolve, reject) {
                                    // TODO (brendan): Modify this using the
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
                                // TODO (brendan): Maybe pass the course as a parameter
                                // to this event.
                                self.emit(new CAEvent(CAEvent.Name.DID_CREATE_COURSE));
                                self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                            },
                            // Error.
                            function(error) {
                                // TODO (brendan): Should I cancel create course mode?
                                throw error;
                            });
                };
            case Action.Name.CANCEL_CREATE_COURSE:
                // TODO (brendan): Make sure that the app is
                // in create course mode in the first palce.
                return function(payload) {
                    return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                       // Wait for the ConfigStore to finish updating
                       // the hash.
                       .then(
                        // Success.
                        function() {
                            self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                        },
                        // Error.
                        function(error) {
                            throw error;
                        });
                };
            case Action.Name.ENROLL_CURRENT_USER:
                return function(payload) {
                    var course = self.courseWithId(payload.courseId);
                    // Note that this call will cause an error to occur
                    // if the user is already enrolled in the course.
                    course.addUser(UserStore.current());
                    return course.save()
                                 .then(
                                    // Success.
                                    function() {
                                        self.emit(new CAEvent(CAEvent.Name.DID_CHANGE_ENROLLMENT));
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    });
                };
            case Action.Name.UNENROLL_CURRENT_USER:
                return function(payload) {
                    var course = self.courseWithId(payload.courseId);
                    course.removeUser(UserStore.current());
                    return course.save()
                                 .then(
                                    // Success.
                                    function() {
                                        self.emit(new CAEvent(CAEvent.Name.DID_CHANGE_ENROLLMENT));
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    });
                };
            default:
                return null;
            }
        };


        /**
         * Create a query object used to fetch courses. This method
         * should only be called after a User has been logged in.
         *
         * @private
         * @method _createQuery
         *
         * @param requestMap {Object} The request parameters
         *  to configure the requests.
         *
         * @return {Parse.Query} The query to perform
         *  a network request.
         */
        StoreClass.prototype._createCourseQuery = function(requestMap) {
            var query = new Parse.Query(Course);
            // Only get schools for the user.
            query.equalTo('school', UserStore.current().get('school'));
            query.limit(requestMap.limit);
            query.skip(requestMap.skip);

            return query;
        };


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
        StoreClass.prototype._fetchCourse = function(course) {
            var self = this;
            return new Promise(function(resolve, reject) {
                course.fetch({
                    success: function() {
                        // TODO (brendan): Separate out load and
                        // fetch course calls.
                        self._loadCourse(course).then(
                            // Success
                            function() {
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
        };


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
        StoreClass.prototype._loadCourse = function(course) {
            var 
                fieldPromise = FieldStore.fetchFieldForCourse(course),

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
        };


        /**
         * Fetch the courses for a given school.
         *
         * @method fetch
         *
         * @return {Promise} A promise that executed when the
         *  asynchronous call has returned.
         */
        StoreClass.prototype.fetchPage = function() {
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
        };


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
        StoreClass.prototype.courseWithId = function(course_id) {
            var i, n;
            for (i = 0, n = this._courses.length; i < n; ++i) {
                if (this._courses[i].id === course_id) {
                    return this._courses[i];
                }
            }
            return null;
        };


        /**
         * Check if the course store is in create course mode.
         *
         * @method isCreateCourseMode
         *
         * @return {Boolean} Create course mode.
         */
        StoreClass.prototype.isCreateCourseMode = function() {
            return ConfigStore.isCreatingCourse();
        };


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
        StoreClass.prototype.coursesForUser = function(user) {
            return this._courses.filter(function(course) {
                return course.isEnrolled(user);
            });
        };


        /**
         * Get the current course for the page.
         *
         * @method current
         *
         * @return {Course} The current course. If the pageKey
         *  is not 'course', this will return null.
         */
        StoreClass.prototype.current = function() {
            // TODO (brendan): Maybe make this throw an
            // error if the current key is not called on
            // the correct page.
            return (ConfigStore.pageKey() === 'course') ?
                    this.courseWithId(ConfigStore.courseId()) :
                    null;
        };


        StoreClass.prototype.forEach = function(callback) {
            this._courses.forEach(callback);
        };


        StoreClass.prototype.map = function(callback) {
            return this._courses.map(callback);
        };


        return new StoreClass();

    }());
