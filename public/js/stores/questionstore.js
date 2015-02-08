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


        /**
         * A variadic method that takes query objects
         * and generates a single question after performing
         * all the queries. If multiple questions exist from
         * the queries, then the first one in the set
         * will be returned.
         *
         * @method getOne
         *
         * @return {Question} A Question object.
         */
        getOne: function () {
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
            }, this._getQuestionList());
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
                        course = CourseStore.getOne(CourseStore.query.filter.courseWithId(courseId));

                    return self._fetchQuestionsForCourse(course);
                });

            }
        },

        query: {

            filter: {

                questionsForCourse: Query.createQuery(function (data) {
                    var course = this.params[0];
                    return data.filter(function (question) {
                        return question.get('course').id === course.id;
                    });
                }),

                questionsForTopics: Query.createQuery(function (data) {
                    // Keep in mind that the topics array is a
                    // pseudo-array.
                    var topics = this.params;
                    return data.filter(function (question) {
                        return [].reduce.call(topics, function (hasTopic, topic) {
                            return hasTopic || question.get('topic').id === topic.id;
                        }, false);
                    });
                })

            }

        }

    });

module.exports = new QuestionStore();