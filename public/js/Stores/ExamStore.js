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
            this.dispatcherIndex = 4;
            // A hash of id -> exam object
            this._examHash = {};

            // A hash of exam id -> array of questions.
            this._questionHash = {};
        },
        self;


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
        var query = new Parse.Query(Exam);

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
     * Generate an exam run for the current exam.
     *
     * @method _generateExamRun
     * @private
     *
     * @return {ExamRun} An exam run of the current exam.
     */
    StoreClass.prototype._generateExamRun = function() {
        var MAX_QUESTION_COUNT = 30,
            // Make a copy of the array, since the array will be
            // modified by the randomization algorithm. Note that
            // the array is modified, but the questions inside the
            // array are not.
            allQuestions = this.questionsForExam(this.current()).slice(),
            // An array of random questions pulled to be in the exam run.
            // The maximum number of random questions is equal to the exam
            // run.
            randomQuestions, i, randomIndex;

        // TODO: Implement the randomization algorithm. For
        // now, just set the set of questions to all the questions available.
        randomQuestions = allQuestions;

        return new ExamRun(randomQuestions);
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
     * Get the current exam run for the run that the user
     * is taking. Note that this property is only applicable
     * to certain pages.
     *
     * @method currentExamRun
     *
     * @return {ExamRun} The current exam run for the page.
     */
    StoreClass.prototype.currentExamRun = function() {
        return this._examRun || null;
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


    StoreClass.prototype.actionHandler = {

        CREATE_EXAM: function (payload) {
            console.log("In ExamStore.");
            return new Promise(function (resolve, reject) {
                var examMap = payload.examMap,
                    exam = new Exam();

                examMap.course = CourseStore.courseWithId(examMap.courseId);
                examMap.author = UserStore.current();

                delete examMap.courseId;
                
                exam.set(examMap);
                exam.save()
                    .then(
                     // Success.
                    function (exam) {
                        self._examHash[exam.id] = exam;
                        self._questionHash[exam.id] = [];
                        self.emit(new CAEvent(CAEvent.Name.DID_CREATE_EXAM));
                        resolve();
                    },
                    // Error.
                    function (error) {
                        throw error;
                    });
            });
        },



        CREATE_QUESTION: function (payload) {
            return new Promise(function (resolve, reject) {
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
                question.save().then(
                      // Success.
                      function (question) {
                        self._questionHash[examId].push(question);
                        self.emit(new CAEvent(CAEvent.Name.DID_CREATE_QUESTION));
                        resolve();
                      },

                      function(error) {
                      throw error;
                });
            });
        },


        DELETE_QUESTION: function (payload) {
            return new Promise(function (resolve, reject) {
                var questionId = PageStore.currentPayload().questionId,
                    examId = PageStore.currentPayload().examId,
                    question = self.questionForExam(examId, questionId);

                question.destroy().then(
                      // Success.
                      function (question) {
                        var spliceIndex;
                        spliceIndex = self._questionHash[examId].indexOf(question);
                        if (spliceIndex != -1) {
                            self._questionHash[examId].splice(spliceIndex, 1);
                        }
                        else {
                            throw new Error("Cannot delete non-existent question");
                        }
                        resolve();
                      },

                      function (error) {
                      throw error;
                });
            });
        },


        DISPLAY_EXAM: function (payload) {
            return Dispatcher.waitFor([ ConfigStore.dispatcherIndex ])
                            // Done waiting for the ConfigStore to update ExamHash.
                            .then(
                                // Success.
                                function() {
                                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD_EXAM));
                                },
                                // Error.
                                function(err) {
                                    throw error;
                                });
        },


        EDIT_QUESTION: function (payload) {
            return new Promise(function (resolve, reject) {
                var question = self.questionForExam(PageStore.currentPayload().examId,
                                                    PageStore.currentPayload().questionId),
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
                question.save().then(
                    // Success.
                    function () {
                        resolve();
                    },
                    // Error.
                    function (error) {
                        throw error;
                    });
            });
        },


        PERFORM_LOAD: function (payload) {
            // The exams are loaded only when loading a course
            // page.
            switch (payload.pageKey) {

            case 'course':
            case 'exam':
                // Wait for the course to get loaded, then
                // load all the exams for the course and questions
                // for the exam.
                return Dispatcher.waitFor([UserStore.dispatcherIndex,
                                           CourseStore.dispatcherIndex])
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
                            // NOTE: This case is for both exam
                            // and courses. In the exam case, we
                            // have to generate an exam run to use.
                            if (payload.pageKey === 'exam') {
                                self._examRun = self._generateExamRun();
                                self.emit(new CAEvent(CAEvent.Name.DID_CREATE_EXAM_RUN));
                            }
                            self.emit(new CAEvent(CAEvent.Name.DID_FETCH_EXAMS,
                                                  { courseId: payload.course }));
                        },

                        // Error.
                        function(error) {
                            throw error;
                        });
            default:
                return new Promise(function(resolve) {
                    // Exam store does not need to do anything
                    // when rendering page that is non-course.
                    resolve();
                });
            }
        },


        SUBMIT_EXAM_RUN: function (payload) {
            return Dispatcher.waitFor([ PageStore.dispatcherIndex ])
                 .then(
                    // Success.
                    function () {
                        // Grade the exam and save it with the current exam run.
                        var prop, guesses = payload.guesses;
                        for (prop in guesses) {
                            // Prop is an index for the guess.
                            if (guesses.hasOwnProperty(prop)) {
                                self.currentExamRun().setGuess(+prop, guesses[+prop]);
                            }
                        }
                        self.emit(new CAEvent(CAEvent.Name.DID_GRADE_EXAM_RUN));
                    },
                    // Error.
                    function (error) {
                        throw error;
                    });
        }

    };


    return (self = new StoreClass());

}());