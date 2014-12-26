/**
 * index.js
 *
 * Entry point for the Stores module. Provides
 * references to all stores.
 */

// Cache contains cached stores.
var cache = {};

module.exports = {

    ConfigStore: function () {
        if (!cache.ConfigStore) {
            cache.ConfigStore = require('./configstore.js');
        }
        return cache.ConfigStore;
    },


    CourseStore: function () {
        if (!cache.CourseStore) {
            cache.CourseStore = require('./coursestore.js');
        }
        return cache.CourseStore;
    },


    ExamStore: function () {
        if (!cache.ExamStore) {
            cache.ExamStore = require('./examstore.js');
        }
        return cache.ExamStore;
    },

    
    FieldStore: function () {
        if (!cache.FieldStore) {
            cache.FieldStore = require('./fieldstore.js');
        }
        return cache.FieldStore;
    },


    PageStore: function () {
        if (!cache.PageStore) {
            cache.PageStore = require('./pagestore.js');
        }
        return cache.PageStore;
    },


    UserStore: function () {
        if (!cache.UserStore) {
            cache.UserStore = require('./userstore.js');
        }
        return cache.UserStore;
    },


    Factory: require('./factory.js')

};
