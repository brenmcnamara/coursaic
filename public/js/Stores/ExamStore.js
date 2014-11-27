/**
 * ExamStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, CAEvent, Exam, Course, Question */

/**
 * ExamStore.js
 */

var ExamStore = (function() {

    var StoreClass = function() {
        // A hash of id -> exam object
        this._examHash = {};

        // A hash of exam id -> array of questions.
        this._questionHash = {};
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

        query.equalTo('course', course);

        return new Promise(function(resolve, reject) {
            query.find({
                success: function(response) {
                    response = response || [];
                    response.forEach(function(exam) {
                        // Set the course since we know
                        // it based on the query.
                        exam.set('course', course);
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
     *
     * @method _loadExam
     * @private
     *
     * @return {Promise} A promise that is called when
     *  all the exam data has been fetched.
     */
    StoreClass.prototype._loadExam = function(exam) {
        var
            self = this,
            // Load the author of the exam.
            authorPromise = UserStore.fetchAuthorOfExam(exam),

            // Load all the questions that are in the exam.
            questionsPromise = new Promise(function(resolve, reject) {
                var query = new Parse.Query(Question);
                query.equalTo('exam', exam);

                query.find({
                    success: function(questions) {
                        // No need now to load all the data from
                        // the question, it is unnecessary.
                        questions.forEach(function(question) {
                            question.encodeAttrs();
                            // Set the exam on this question.
                            question.set('exam', exam);
                        });
                        // Cache the questions for the exam.
                        self._questionHash[exam.id] = questions;
                        resolve();
                    },

                    error: function(error) {
                        throw error;
                    }
                });
            });

        return Promise.all([authorPromise, questionsPromise]);
    };


    /**
     * Get the id of the question being deleted.
     *
     * @method deleteQuestionId
     *
     * @return {String} The id of a question being deleted.
     *  This will be null if no question is being deleted.
     */
    StoreClass.prototype.deleteQuestionId = function() {
        return ConfigStore.deleteQuestionId();
    };


    /**
     * Get all the questions for a particular exam. This
     * is a query method.
     *
     * @method questionsForExam
     *
     * @param exam {Exam} The exam to get the questions for.
     *
     * @param user {User} The user to get the questions for.
     *  This parameter is optional. If this parameter is not
     *  specified, then this method will return all the questions
     *  for the exam. If it is specified, it will return all
     *  questions in the exam that were created by the given user.
     *
     * @return {Array} An array of questions for the exam and
     *  (optionally) the user.
     */
    StoreClass.prototype.questionsForExam = function(exam, user) {
        // NOTE: Made the decision not to load the information
        // for the user of questions. This means when checking
        // if the question belongs to a user, check the id.
        var questions = this._questionHash[exam.id] || [];
        if (user) {
            // Get the questions that were created by
            // the user.
            return questions.filter(function(question) {
                return question.get('author').id === user.id;
            });
        }
        return questions;
    };


    /**
     * Check if there is a new question in the process of
     * being created.
     *
     * @method isCreateQuestionMode
     *
     * @return {Boolean} True if a question is being created, false
     *  otherwise.
     */
    StoreClass.prototype.isCreateQuestionMode = function() {
        return ConfigStore.questionEditId() === 'new';
    };


    /**
     * Check if there is a new exam in the process of being
     * created.
     *
     * @method isCreateExamMode
     *
     * @return {Boolean} True if an exam is being created, false
     *  otherwise.
     */
    StoreClass.prototype.isCreateExamMode = function() {
        return ConfigStore.isCreatingExam();
    };


    /**
     * A query operation to get an array of exams for a particular
     * course.
     *
     * @method examsForCourse
     *
     * @param course {Course} The course to query the exams
     *  with.
     *
     * @return {Array} An array of Exam objects. This is an empty
     *  array if there are no exams for the given course.
     */
    StoreClass.prototype.examsForCourse = function(course) {
        var prop, exams = [];
        for (prop in this._examHash) {
            if (this._examHash.hasOwnProperty(prop) &&
                this._examHash[prop].get('course') === course) {

                exams.push(this._examHash[prop]);
            }
        }
        return exams;
    };


    /**
     * Get the exam that is represented by the current
     * page.
     *
     * @method current
     *
     * @return {Exam} The current exam for the page. If the
     *  page is something that does not have an exam, this will
     *  return null.
     */
    StoreClass.prototype.current = function() {
        return (ConfigStore.examId()) ?
               this._examHash[ConfigStore.examId()] :
               null;
    };


    /**
     * Get the question with the specified id. First,
     *  gets the proper exam, and then loops through
     *  the questions in the exam until it finds the
     *  question matching the question id.
     *
     * @method questionForExam
     *
     * @param examId {String} The id of the exam. 
     *
     * @param questionId {String} The id of the question. 
     *
     * @return {Question} The question with the 
     *  associated questionId within the exam with
     *  the associated examId. Returns null if there
     *  is nothing is found.
     */ 
    StoreClass.prototype.questionForExam = function(examId, questionId) {
        var examQuestionArray = this._questionHash[examId];
        if (examQuestionArray) {
            for (i = 0; i < examQuestionArray.length; i++) {
                if(examQuestionArray[i].id === questionId)
                    return examQuestionArray[i];
            }
        }

        return null;

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
                                })
                            // After all the exams have been loaded.
                            .then(
                                // Success.
                                function() {
                                    self.emit(new CAEvent(CAEvent.Name.DID_FETCH_EXAMS,
                                                          {courseId: payload.course}));
                                },

                                // Error.
                                function(error) {
                                    throw error;
                                });
                }
                else {
                    return new Promise(function(resolve) {
                        // Exam store does not need to do anything
                        // when rendering page that is non-course.
                        resolve();
                    });
                }
            };
        case Action.Name.DISPLAY_EXAM:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                self.emit(new CAEvent(CAEvent.Name.DID_LOAD_EXAM));
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.PERFORM_QUESTION_EDIT:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                var question = self.questionForExam(payload.examId,
                                                 payload.questionId);
                                question.isEditing(true);
                                self.emit(new CAEvent(CAEvent.Name.DID_BEGIN_EDITING));
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.SAVE_QUESTION_EDIT:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                var question = self.questionForExam(payload.examId,
                                                                    payload.questionId),
                                    options = payload.questionMap.options,
                                    saveOptions = {};
                                if (options) {
                                    question.setOptions(options);
                                }
                                // Remove the options from the questionMap
                                // because they must be added in a particular
                                // way, as illustrated above.
                                delete payload.questionMap.options;
                                question.set(payload.questionMap);
                                question.isEditing(false);

                                return question.save().then(
                                    // Success.
                                    function() {
                                        self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    }
                                );
                                
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.ENTER_NEW_QUESTION_MODE:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                self.emit(new CAEvent(CAEvent.Name.DID_BEGIN_EDITING));
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.SAVE_QUESTION_NEW:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                var question = new Question(),
                                    options = payload.questionMap.options,
                                    saveOptions = {},
                                    examId = payload.questionMap.examId;
                                question.setOptions(options);


                                payload.questionMap.author = UserStore.current();
                                payload.questionMap.exam = self._examHash[examId];
                                // Delete any fields of the questionMap that should
                                // not be saved with the question.
                                delete payload.questionMap.options;
                                delete payload.questionMap.examId;
                                question.set(payload.questionMap);
                                return question.save().then(
                                      // Success.
                                      function(question) {
                                        self._questionHash[examId].push(question);
                                        self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                                        self.emit(new CAEvent(CAEvent.Name.DID_CREATE_QUESTION));
                                      },

                                      function(error) {
                                      throw error;
                                });
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.ENTER_DELETE_QUESTION_MODE:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                var question = self.questionForExam(payload.examId,
                                                 payload.deleteQuestionId);
                                // question.isEditing(true);
                                self.emit(new CAEvent(CAEvent.Name.DID_BEGIN_EDITING));
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.CANCEL_DELETE_QUESTION_MODE:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                   // Wait for the ConfigStore to finish updating
                   // the hash.
                   .then(
                    // Success.
                    function() {
                        var question = self.questionForExam(payload.examId,
                                             payload.deleteQuestionId);
                        // question.isEditing(false);
                        self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                    },
                    // Error.
                    function(error) {
                        throw error;
                    });
            };
        case Action.Name.DELETE_QUESTION:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        //Done waiting for the ConfigStore to update ExamHash
                        .then(
                            // Success.
                            function() {
                                var question = self.questionForExam(payload.examId,
                                               payload.deleteQuestionId),
                                    examId = payload.examId;
                                return question.destroy().then(
                                      // Success.
                                      function(question) {
                                        var spliceIndex;
                                        spliceIndex = self._questionHash[examId].indexOf(question);
                                        if (spliceIndex!=-1) {
                                            self._questionHash[examId].splice(spliceIndex, 1);
                                        }
                                        else{
                                            throw new Error("Cannot delete non-existent question");
                                        }
                                        self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                                      },

                                      function(error) {
                                      throw error;
                                });
                            },
                            // Error.
                            function(err) {
                                throw error;
                            });
                };
        case Action.Name.ENTER_CREATE_EXAM_MODE:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
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
        case Action.Name.CREATE_EXAM:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        .then(
                            // Success.
                            function() {
                                // TODO (brendan):
                                // Save the question.
                                var examMap = payload.examMap,
                                    exam = new Exam();

                                examMap.course = CourseStore.courseWithId(examMap.courseId);
                                examMap.author = UserStore.current();

                                delete examMap.courseId;
                                
                                exam.set(examMap);
                                return exam.save()
                                           .then(
                                            // Success.
                                            function() {
                                                self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                                            },
                                            // Error.
                                            function(error) {
                                                throw error;
                                            });
                            },
                            // Error.
                            function(error) {
                                throw error;
                            }
                        );
            };
        case Action.Name.CANCEL_CREATE_EXAM:
            return function(payload) {
                return Dispatcher.waitFor([ConfigStore.dispatcherIndex])
                        .then(
                            // Success.
                            function() {
                                self.emit(new CAEvent(CAEvent.Name.DID_END_EDITING));
                            },
                            // Error.
                            function(error) {
                                throw error;
                            }
                        );
            };
        default:
            return null;
        }
    };


    return new StoreClass();

}());