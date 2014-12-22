/**
 * index.js
 *
 * Entry point for the Stores module. Provides
 * references to all stores.
 */

var cache = {};

module.exports = {

    ConfigStore: function () {
        if (!cache.ConfigStore) {
            cache.ConfigStore = require('./ConfigStore.js').ConfigStore;
        }
        return cache.ConfigStore;
    },


    CourseStore: function () {
        if (!cache.CourseStore) {
            cache.CourseStore = require('./CourseStore.js').CourseStore;
        }
        return cache.CourseStore;
    },


    ExamStore: function () {
        if (!cache.ExamStore) {
            cache.ExamStore = require('./ExamStore.js').ExamStore;
        }
        return cache.ExamStore;
    },

    
    FieldStore: function () {
        if (!cache.FieldStore) {
            cache.FieldStore = require('./FieldStore.js').FieldStore;
        }
        return cache.FieldStore;
    },


    PageStore: function () {
        if (!cache.PageStore) {
            cache.PageStore = require('./PageStore.js').PageStore;
        }
        return cache.PageStore;
    },


    UserStore: function () {
        if (!cache.UserStore) {
            cache.UserStore = require('./UserStore.js').UserStore;
        }
        return cache.UserStore;
    }


};
