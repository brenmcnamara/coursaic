/**
 * PageStore.js
 */

var Dispatcher = require('shore').Dispatcher,
    StoreBuilder = require('shore').StoreBuilder,
    Stores = require('../stores'),
    Router = require('shore').Router,
    Constants = require('../constants.js'),

    PageStore = StoreBuilder.createStore({

        initializer: function () {
            this._currentMode = null;
        },

        _addMode: function(inputMap) {
            var self = this,
                toMode = inputMap.toMode,
                toPayload = inputMap.toPayload;
            // Assumes modes are valid (not null and part of the PageStore.Mode namespace).
            return new Promise(function(resolve, reject) {
                if (self._currentMode) {
                    throw new Error("Trying to change to mode " + toMode +
                                    " when the current mode is " + self._currentMode + ".");
                }
                self._currentMode = toMode;
                // TODO: Should copy the payload.
                self._currentPayload = toPayload;
                self.emit(Constants.Event.CHANGED_MODE);
                resolve();
            });
        },


        _removeMode: function(inputMap) {
            var self = this,
                fromMode = inputMap.fromMode;

            return new Promise(function(resolve, reject) {
                if (self._currentMode && self._currentMode !== fromMode) {
                    throw new Error("Expected mode to be " + fromMode +
                                    " when the mode is " + self._currentMode + ".");
                }
                self._currentMode = null;
                self._currentPayload = null;
                self.emit(Constants.Event.CHANGED_MODE);
                resolve();
            });
        },


        actionHandler: {

            CREATE_COURSE: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CREATE_COURSE });
            },

            FROM_MODE_CANCEL_EXAM_RUN: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CANCEL_EXAM_RUN });
            },

            FROM_MODE_CREATE_COURSE: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CREATE_COURSE });
            },

            FROM_MODE_CREATE_EXAM: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CREATE_EXAM });
            },

            FROM_MODE_CREATE_QUESTION: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CREATE_QUESTION });
            },

            FROM_MODE_DELETE_QUESTION: function (payload) {
                return this._removeMode({ fromMode: this.Mode.DELETE_QUESTION });
            },

            LOAD_COURSE: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.CourseStore().dispatcherIndex ])
                                 .then(function () {
                                    self._removeMode({fromMode: self.currentMode()});
                                 });
            },

            LOAD_EXAM_RUN: function (payload) {
                return this._removeMode({ fromMode: this.currentMode() });
            },

            LOAD_HOME: function (payload) {
                return this._removeMode({ fromMode: this.currentMode() });
            },

            LOAD_RESULTS: function (payload) {
                return this._removeMode({ fromMode: this.currentMode() });
            },

            LOAD_SPLASH: function (payload) {
                return this._removeMode({ fromMode: this.currentMode() });
            },

            LOGIN: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex, 
                                            Stores.CourseStore().dispatcherIndex ])
                                 .then(function () {
                                    self._removeMode({fromMode: self.currentMode()});
                                 });
            },

            RESOLVE_MODE_CREATE_QUESTION: function (payload) {
                var self = this;

                return Dispatcher.waitFor([ Stores.QuestionStore().dispatcherIndex ])
                        .then(function () {
                            self._removeMode({ fromMode: self.Mode.CREATE_QUESTION });
                        });
            },

            RESOLVE_MODE_EDIT_QUESTION: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.QuestionStore().dispatcherIndex ])
                        .then(function () {
                            self._removeMode({ fromMode: self.Mode.EDIT_QUESTION });
                        });
            },

            SUBMIT_EXAM_RUN: function (payload) {
                return this._addMode({ toMode: this.Mode.VIEW_EXAM_RESULTS,
                                       toPayload: payload });
            },

            TO_MODE_CANCEL_EXAM_RUN: function (payload) {
                return this._addMode({ toMode: this.Mode.CANCEL_EXAM_RUN,
                                       toPayload: payload });
            },

            TO_MODE_CREATE_COURSE: function (payload) {
                return this._addMode({ toMode: this.Mode.CREATE_COURSE,
                                       toPayload: payload });
            },

            TO_MODE_CREATE_QUESTION: function (payload) {
                return this._addMode({ toMode: this.Mode.CREATE_QUESTION,
                                       toPayload: payload });
            },

            TO_MODE_CREATE_EXAM: function (payload) {
                return this._addMode({ toMode: this.Mode.CREATE_EXAM,
                                       toPayload: payload });
            },

            TO_MODE_DELETE_QUESTION: function (payload) {
                return this._addMode({ toMode: this.Mode.DELETE_QUESTION,
                                       toPayload: payload });
            },

            TO_MODE_EDIT_QUESTION: function (payload) {
                return this._addMode({ toMode: this.Mode.EDIT_QUESTION,
                                       toPayload: payload });
            },

            QUIT_MODE_EDIT_QUESTION: function (payload) {
                return this._removeMode({ fromMode: this.Mode.EDIT_QUESTION });
            },

            QUIT_MODE_CREATE_QUESTION: function (payload) {
                return this._removeMode({ fromMode: this.Mode.CREATE_QUESTION });
            }

        },


        /**
         * Get the current mode for the page.
         *
         * @method currentMode
         *
         * @return {String} The current mode of the page.
         *  If there is no current mode, it will return null.
         */
        currentMode: function() {
            return this._currentMode || null;
        },


        /**
         * Get the payload for the current mode.
         *
         * @method currentPayload
         *
         * @return {Object} The payload for the current
         *  mode. If there is no mode, this will return null.
         */
        currentPayload: function() {
            return this._currentPayload || null;
        },


        /**
         * The course id represented by the current page.
         *
         * @method courseId
         *
         * @return {String} The course id for the current page,
         *  or null if the page has no course id.
         */
        courseId: function () {
            return Router.matchArguments("/course/<courseId>").courseId || null;
        },


        /**
         * A hash containing different possible modes of the page.
         * This property should not be mutated.
         *
         * @property Mode
         * @type Object
         */
        Mode: {
            CANCEL_EXAM_RUN: 'CANCEL_EXAM_RUN',
            CREATE_COURSE: 'CREATE_COURSE',
            CREATE_EXAM: 'CREATE_EXAM',
            CREATE_QUESTION: 'CREATE_QUESTION',
            DELETE_QUESTION: 'DELETE_QUESTION',
            EDIT_QUESTION: 'EDIT_QUESTION',
            VIEW_EXAM_RESULTS: 'VIEW_EXAM_RESULTS'           
        }


    });


module.exports = new PageStore();

