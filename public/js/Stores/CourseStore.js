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
        this._isFetching = false;
        this._page = 0;
        this._limit = 30;
        this._courses = [];
    };

    StoreClass.prototype = new Store();

    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch(name) {
            case Action.Name.PERFORM_LOAD:

                return function(payload) {
                    return new Promise(function(resolve, rejected) {
                        ConfigStore.onReady().then(
                            // On success from ConfigStore.   
                            function() {
                                self.fetchPage().then(
                                    // Success
                                    function() {
                                        self.emit(new CAEvent(CAEvent.Name.DID_FETCH_COURSES));
                                        resolve();
                                    },
                                    // Failure
                                    function() {
                                        throw new Error("Failed to fetch courses.");
                                    }
                                );
                            },
                            // On failure from ConfigStore.
                            function() {
                                console.log("Config store exploded");
                                throw new Error("ConfigStore failed to become ready.");
                            });
                    });

                };

            default:
                return null;
        }
    };


    /**
     * Create a query object used to fetch courses.
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

        query.limit(requestMap.limit);
        query.skip(requestMap.skip);

        return query;
    };


    /**
     * Load all the data for a single course.
     * This loading may occur asynchronously.
     *
     * @method _loadCourse
     * @private
     *
     * @param course {Course} The course to load
     *  the data for.
     *
     * @return {Promise} A promise that is executed
     *  when all the data for the course has been
     *  loaded.
     */
    StoreClass.prototype._loadCourse = function(course) {
        return new Promise(function(resolve, reject) {
            course.get('field').fetch({
                success: function() {
                    resolve();
                },
                error: function(error) {
                    throw error;
                }
            });
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
        return new Promise(function (resolve, rejecte) {
            var query = self._createCourseQuery(
            {
                limit: self._limit,
                skip: self._page * self._limit
            });
            query.find({
                success: function(results) {
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


    StoreClass.prototype.forEach = function(callback) {
        this._courses.forEach(callback);
    };


    StoreClass.prototype.map = function(callback) {
        return this._courses.map(callback);
    };


    return new StoreClass();

}());
