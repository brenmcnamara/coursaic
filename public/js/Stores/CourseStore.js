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
        return null;
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
     * Fetch the courses for a given school.
     *
     * @method fetch
     *
     * @param school {School} The school to get the courses
     *  for.
     *
     * @param requestMap {Object} Any parameters that may
     *  configure the request for the school. This may
     *  include: skip, limit.
     *
     * @return {Promise} A promise that executed when the
     *  asynchronous call has returned.
     */
    StoreClass.prototype.fetchPage = function(school) {
        var self = this;

        if (this._isFetching) {
            throw new Error("Cannot fetch courses while a fetch is in progress.");
        }

        this._isFetching = true;
        return new Promise(function (resolved, rejected) {
            var query = self._createCourseQuery(
            {
                limit: self._limit,
                skip: self._page * self._limit
            });
            query.find({
                success: function(results) {
                    self._courses.push.apply(self._courses, results);
                    // Increment the paging value for the next fetch.
                    self._page += 1;
                    self._isFetching = false;
                    resolved();
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
