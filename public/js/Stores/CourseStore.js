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

var Course = Parse.Object.extend("Course"),
    
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
                    return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                            // Done waiting for the ConfigStore
                           .then(self.fetchPage())
                           // Finished getting the next set of courses.
                           .then(
                                // Success.
                                function() {
                                    self.emit(new CAEvent(CAEvent.Name.DID_FETCH_COURSES))
                                },
                                // Error.
                                function(err) {
                                    throw error;
                                });
                case 'course':
                    // Just make sure the single course is loaded.
                    return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                           .then(
                                // Success.
                                function() {
                                    var course;
                                    // Get the course if the course does not
                                    // already exist.
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
                            )
                default:
                    return new Promise(function(resolve, reject) {
                        resolve();
                    });
                }
                return new Promise(function(resolve, reject) {

                });

            };
        case Action.Name.ENTER_CREATE_COURSE_MODE:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        // Done waiting for ConfigStore to finish.
                       .then(
                        // Success.
                        function() {
                            self.emit(new CAEvent(CAEvent.Name.DID_ENTER_CREATE_COURSE_MODE));
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
     *  loaded.
     */
    StoreClass.prototype._loadCourse = function(course) {
        var 
            fieldPromise = FieldStore.fetchFieldForCourse(course),

            schoolPromise = new Promise(function(resolve, reject) {
                course.get('school').fetch({
                    success: function() {
                        resolve();
                    },
                    error: function(error) {
                        throw error;
                    }
                });
            }),

            enrolledUsersPromise = UserStore.fetchEnrolledUsers(course);

        return Promise.all([fieldPromise, schoolPromise, enrolledUsersPromise]);
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
        return new Promise(function (resolve, rejecte) {
            var query = self._createCourseQuery(
            {
                limit: self._limit,
                skip: self._page * self._limit
            });
            query.find({
                success: function(results) {
                    

                    // Reduce the list of results to courses
                    // that don't already exist in the collection.
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
     * Fetch the courses for a particular user. This method
     * assumes that the user has been fetched.
     *
     * @method fetchCoursesForUser
     *
     * @param user {Parse.User} The user to get the courses for.
     *
     * @return {Promise} A promise that is executed when all
     * the courses for the user have been fetched. The courses
     * are automatically added to the user.
     */
    StoreClass.prototype.fetchCoursesForUser = function(user) {
        var self = this,
            enrolledList = user.get('enrolled') || [],
            courses = [], promises = [], courseFromStore,
            i, n;

        // Loop through the courses in the enrolled list.
        // Unify the enrolled list with the collection and
        // generate all the promises necessary for fetching the
        // courses.
        for (i = 0, n = enrolledList.length; i < n; ++i) {
            courseFromStore = this.courseWithId(enrolledList[i].id);
            if (courseFromStore) {
                courses.push(courseFromStore);
            }
            else {
                // Keep the course in the enrolled list.
                courses.push(enrolledList[i]);
                // Add the course to the current course store.
                this._courses.push(enrolledList[i]);
                // load any missing data for the course and
                // save the promise.

                promises.push(self._fetchCourse(enrolledList[i]));
            }
        }
        // Set the courses in the enrolled list
        // to contain the courses that were saved.
        user.set('enrolled', courses);
        return Promise.all(promises);
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
