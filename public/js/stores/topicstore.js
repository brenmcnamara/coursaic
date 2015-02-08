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

        _topicsForCourse: function (course) {
            var self = this,
                asyncQuery = new Parse.Query(Topic);

            asyncQuery.equalTo("course", course);

            return asyncQuery.find().then(function (topics) {
                topics.forEach(function (topic) {
                    self._topicHash[topic.id] = topic;
                });
                console.log("Done loading topics: " + topics);
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

        /**
         * A variadic method that takes query objects
         * and generates a single topic after performing
         * all the queries. If multiple topics exist from
         * the queries, then the first one in the set
         * will be returned.
         *
         * @method getOne
         *
         * @return {User} A topic object.
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
                        course = CourseStore.getOne(CourseStore.query.filter.courseWithId(courseId));

                    return self._topicsForCourse(course);
                });
            }

        },

        query: {

            filter: {

                topicsForCourse: Query.createQuery(function (data) {
                    var course = this.params[0];

                    return data.filter(function (topic) {
                        return topic.get('course').id === course.id;
                    });
                })

            }
        }

    });

module.exports = new TopicStore();


