/**
 * topicstore.js
 *
 * A store for all the topics in any course.
 */

var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    Constants = require('../constants.js'),
    StoreBuilder = require('shore').StoreBuilder,

    Course = require('./models.js').Course,
    Topic = require('./models.js').Topic,

    Query = require('./query.js'),

    TopicStore = StoreBuilder.createStore({

        /***********************************\
                   PRIVATE METHODS
        \***********************************/

        _Query: Query.queryBuilder({

            topicForName: function (topicName) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (topic) {
                        return topic.get('name') === topicName;
                    })
                });
            },

            topicForQuestion: function (question) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (topic) {
                        return question.get('topic').id === topic.id;
                    })
                });
            },

            topicsForCourse: function (course) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (topic) {
                        return topic.get('course').id === course.id;
                    })
                });
            },

            topicsForIds: function () {
                var topicIds;

                if (Array.isArray(arguments[0])) {
                    // Passed in an array of topic ids.
                    topicIds = arguments[0];
                }
                else {
                    // Passed in topics as variadic parameters.
                    topicIds = arguments.slice();
                }
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (topic) {
                        return topicIds.reduce(function (hasTopicId, topicId) {
                            return hasTopicId || topicId === topic.id;
                        }, false);
                    })
                });
            }

        }),

        _topicsForCourse: function (course) {
            var self = this,
                asyncQuery = new Parse.Query(Topic);

            asyncQuery.equalTo("course", course);

            return asyncQuery.find().then(function (topics) {
                topics.forEach(function (topic) {
                    self._topicHash[topic.id] = topic;
                });
            });
        },

        _topicList: function () {
            var topics = [],
                prop;
            for (prop in this._topicHash) {
                if (this._topicHash.hasOwnProperty(prop)) {
                    topics.push(this._topicHash[prop]);
                }
            }
            return topics;
        },

        /***********************************\
                    PUBLIC METHODS
        \***********************************/

        initialize: function () {
            this._topicHash = {};
        },

        query: function () {
            return new this._Query(this._topicList());
        },

        /**
         * A variadic method that takes query objects
         * and generates a single topic after performing
         * all the queries. If multiple topics exist from
         * the queries, then the first one in the set
         * will be returned.
         *
         * @method getOne
         *
         * @return {Topic} A topic object.
         */
        getOne: function () {
            return this.getAll.apply(this, arguments)[0] || null;
        },

        /**
         * A variadic method that takes query objects
         * and generates a set of topics after performing
         * all the queries.
         *
         * @method getAll
         *
         * @return {Array} An array of topics.
         */
        getAll: function () {
            return [].reduce.call(arguments, function (memo, query) {
                return query(memo);
            }, this._topicList());
        },

        /***********************************\
                     NAMESPACES
        \***********************************/

        actionHandler: {

            LOAD_COURSE: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.CourseStore().dispatcherIndex ])

                // Course Store has completed.
                .then(function () {
                    var CourseStore = Stores.CourseStore(),
                        courseId = payload.courseId,
                        course = CourseStore.query().courseWithId(courseId).getOne();

                    return self._topicsForCourse(course);
                });
            }

        }

    });

module.exports = new TopicStore();


