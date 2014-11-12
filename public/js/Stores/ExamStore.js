/**
 * ConfigStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, CAEvent, Exam, Course */

/**
 * ExamStore.js
 */

var ExamStore = (function() {

    var StoreClass = function() {
        // A hash of id -> exam object
        this._examHash = {};
    };


    StoreClass.prototype = new Store();


    /**
     * Get all the exams for a given course. This method
     * will get the base data for an exam and asynchronously
     * provide an array of exams in a promise. _loadExam should
     * be called after to finish loading any exam. The exam that
     * are fetched are automatically added to the exam hash.
     *
     * @method _fetchExamsForCourse
     * @private
     *
     * @param course {Course} The course to get the exams
     *  for.
     *
     * @return {Promise} A promise that is executed when fetching
     *  has completed.
     */
    StoreClass.prototype._fetchExamsForCourse = function(course) {
        var self = this,
            query = new Parse.Query(Exam);

        return new Promise(function(resolve, reject) {
            query.find({
                success: function(response) {
                    response = response || [];
                    response.forEach(function(exam) {
                        self._examHash[exam.id] = exam;
                    });
                    resolve(response);
                },

                error: function(error) {
                    throw error;
                }
            });
        });
    };


    /**
     * Get all the data for a given exam, this includes
     * the creator of the exam, the questions, etc...
     */
    StoreClass.prototype._loadExam = function(exam) {
        return UserStore.fetchAuthorOfExam(exam);
    };


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
        case Action.Name.PERFORM_LOAD:
            return function(payload) {
                // The exams are loaded only when loading a course
                // page.
                if (payload.pageKey === 'course') {
                    return Dispatcher.waitFor([CourseStore.dispatcherIndex])
                            // After the CourseStore has finished.
                            .then(
                                // Success.
                                function() {
                                    return self._fetchExamsForCourse(
                                            CourseStore.courseWithId(payload.course));
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                })
                            // After the exams have been fetched for the course.
                            .then(
                                // Success.
                                function(exams) {
                                    // Map the exams in the course into
                                    // a list of promises.
                                    return Promise.all(exams.map(function(exam) {
                                        // Load all the data in the exam.
                                        return self._loadExam(exam);
                                    }));
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
                }
                else {
                    return new Promise(function(resolve) {
                        resolve();
                    });
                }
            };
        }
    };


    return new StoreClass();

}());