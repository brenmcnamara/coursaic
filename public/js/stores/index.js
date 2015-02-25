/**
 * index.js
 *
 * Entry point for the Stores module. Provides
 * references to all stores.
 */

// Cache contains cached stores.
var cache = {};

module.exports = {

    CourseStore: function () {
        if (!cache.CourseStore) {
            cache.CourseStore = require('./coursestore.js');
        }
        return cache.CourseStore;
    },

    PageStore: function () {
        if (!cache.PageStore) {
            cache.PageStore = require('./pagestore.js');
        }
        return cache.PageStore;
    },

    TopicStore: function () {
        if (!cache.TopicStore) {
            cache.TopicStore = require('./topicstore.js');
        }
        return cache.TopicStore;
    },

    UserStore: function () {
        if (!cache.UserStore) {
            cache.UserStore = require('./userstore.js');
        }
        return cache.UserStore;
    },

    QuestionStore: function () {
        if (!cache.QuestionStore) {
            cache.QuestionStore = require('./questionstore.js');
        }
        return cache.QuestionStore;
    }

};
