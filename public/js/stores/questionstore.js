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

    /**
     * A Store containing all data related to
     * courses.
     *
     * @module Store
     * @class QuestionStore
     */
    QuestionStore = StoreBuilder.createStore({

        /***********************************\
                   PRIVATE METHODS
        \***********************************/

        _Query: Query.queryBuilder({

            questionsNotDisabled: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return !question.get('disabled');
                    })
                });
            },

            questionsNotFlagged: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (question) {
                        return !store._flagsHash[question.id] ||
                               store._flagsHash[question.id].length === 0;
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
                // Now load all the data we need from each question,
                // and create a promise that completed when all question
                // data has been loaded.
                return Promise.all(questions.map(function (question) {
                    return self._loadQuestion(question);
                }));

            });
        },


        _loadQuestion: function (question) {
            var self = this,
                query = new Parse.Query(Flag);

            query.equalTo('question', question);
            return query.find().then(function (flags) {
                self._flagsHash[question.id] = flags;
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
            // The flag hash has keys as question ids,
            // and the value is an array of flags for that
            // question.
            this._flagsHash = {};
        },

        query: function () {
            return new this._Query(this._getQuestionList());
        },

        /***********************************\
                      NAMESPACES
        \***********************************/

        actionHandler: {

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

            }
        }

    }),

    // Local reference to the question store instance.
    store = new QuestionStore();

module.exports = store;
