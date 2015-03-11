/**
 * questionstore.js
 *
 * A store that manages all the course questions.
 */

var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    Constants = require('../constants.js'),
    StoreBuilder = require('shore').StoreBuilder,

    Question = require('./models.js').Question,
    Flag = require('./models.js').Flag,

    Query = require('./query.js'),

    Util = require('shore').Util,

    /**
     * A Store containing all data related to
     * questions.
     *
     * @module Store
     * @class QuestionStore
     */
    QuestionStore = StoreBuilder.createStore({

        /***********************************\
                   PRIVATE METHODS
        \***********************************/

        _Query: Query.queryBuilder({

            // Overridden Methods
            isEqual: function (question1, question2) {
                return question1.id === question2.id;
            },

            // Query chain methods.

            questionWithId: function (questionId) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return question.id === questionId;
                    })
                });    
            },

            questionsDisabled: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return question.get('disabled');
                    })
                });
            },

            questionsNotDisabled: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return !question.get('disabled');
                    })
                });
            },

            questionsFlagged: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return Stores.FlagStore()
                                     .query()
                                     .flagsForQuestion(question)
                                     .getAll()
                                     .length > 0;
                    })
                });
            },

            questionsNotFlagged: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return Stores.FlagStore()
                                     .query()
                                     .flagsForQuestion(question)
                                     .getAll()
                                     .length === 0;
                    })
                });
            },
 
            questionsForCourse: function (course) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return question.get('course').id === course.id;
                    })
                });
            },

            questionsForTopics: function () {
                var topics = arguments;
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return [].reduce.call(topics, function (hasTopic, topic) {
                            return hasTopic || question.get('topic').id === topic.id;
                        }, false);
                    })
                });
            },

            questionsByUser: function (user) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return question.get('author').id === user.id;
                    })
                });
            },

            questionsNotByUser: function (user) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return question.get('author').id !== user.id;
                    })
                });
            },

            sortByDescendingCreationDate: function () {
                return new Query.Pipe({
                    data: this.pipe.data.sort(function (question1, question2) {
                        return question2.createdAt.getTime() - question1.createdAt.getTime();
                    })
                });
            },

            sortByDescendingFlagCount: function () {
                return new Query.Pipe({
                    data: this.pipe.data.sort(function (question1, question2) {
                        var query = Stores.FlagStore().query(),
                            flag1Count = query.flagsForQuestion(question1).getAll().length,
                            flag2Count = query.flagsForQuestion(question2).getAll().length;
                        return flag2Count - flag1Count;

                    })
                });
            }

        }),


        _fetchQuestionsForCourse: function (course) {
            var self = this,
                asyncQuery = new Parse.Query(Question);

            asyncQuery.equalTo('course', course);

            return asyncQuery.find().then(function (questions) {
                questions.forEach(function (question) {
                    self._questionHash[question.id] = question;
                });
            });
        },


        _getQuestionList: function () {
            var list = [],
                prop;

            for (prop in this._questionHash) {
                if (this._questionHash.hasOwnProperty(prop)) {
                    list.push(this._questionHash[prop]);
                }
            }
            return list;
        },


        /***********************************\
                    PUBLIC METHODS
        \***********************************/

        initialize: function () {
            this._questionHash = {};
        },

        query: function () {
            return new this._Query(this._getQuestionList());
        },

        /***********************************\
                      NAMESPACES
        \***********************************/

        actionHandler: {

            DELETE_QUESTION: function (payload) {
                var question = this._questionHash[payload.questionId];

                return question.destroy().then(function (question) {
                    delete this._questionHash[payload.questionId];
                    this.emit(Constants.Event.DELETED_QUESTION);
                }.bind(this));

            },

            DISABLE_QUESTION: function (payload) {
                var self = this;
                return new Promise(function (resolve) {
                    var request = payload.request,
                        question = request.getOriginalObject();

                    question.set('disabled', request.get('disabled'));
                    question.save().then(function () {
                        self._questionHash[question.id] = question;
                        self.emit(Constants.Event.CHANGED_DISABLE_QUESTION_STATE);
                        resolve();
                    });
                });

            },


            LOAD_COURSE: function (payload) {
                var self = this;

                return Dispatcher.waitFor([ Stores.CourseStore().dispatcherIndex ])

                // Done calling the Course Store.
                .then(function () {
                    var CourseStore = Stores.CourseStore(),
                        courseId = payload.courseId,
                        course = CourseStore.query().courseWithId(courseId).getOne();

                    return self._fetchQuestionsForCourse(course);
                });

            },

            RESOLVE_MODE_CREATE_QUESTION: function (payload) {
                var user = Stores.UserStore().query().currentUser().getOne(),
                    question = new Question(),
                    request = payload.request;

                request.forEachChange(function (key, val) {
                    question.set(key, val);
                });

                // Any additional properties that are
                // not set by the user.
                question.set('author', user);
                question.set('disabled', false);

                return question.save().then(function (question) {
                    this._questionHash[question.id] = question;
                }.bind(this));
            },

            RESOLVE_MODE_EDIT_QUESTION: function (payload) {
                // TODO: Move this change request handling to another layer.
                var question = payload.request.getOriginalObject();

                payload.request.forEachChange(function (key, val) {
                    question.set(key, val);
                });


                return question.save().then(function (question) {
                    this._questionHash[question.id] = question;
                }.bind(this));
            },

            UNDISABLE_QUESTION: function (payload) {
                var self = this;
                return new Promise(function (resolve) {
                    var request = payload.request,
                        question = request.getOriginalObject();

                    question.set('disabled', request.get('disabled'));
                    question.save().then(function () {
                        self._questionHash[question.id] = question;
                        self.emit(Constants.Event.CHANGED_DISABLE_QUESTION_STATE);
                        resolve();
                    });
                });

            },

        }

    }),

    // Local reference to the question store instance.
    store = new QuestionStore();

module.exports = store;
