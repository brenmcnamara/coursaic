/**
 * PageStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Store */

var Dispatcher = require('../dispatcher.js'),
    Stores = require('../stores'),
    Anchor = require('../Anchor.js').Anchor,
    CAEvent = require('../Event.js').CAEvent,

    PageStore = Stores.Factory.createStore({

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
                self.emit(CAEvent.Name.CHANGED_MODE);
                resolve();
            });
        },


        _removeMode: function(inputMap) {
            var self = this,
                fromMode = inputMap.fromMode;

            return new Promise(function(resolve, reject) {
                if (self._currentMode !== fromMode) {
                    throw new Error("Expected mode to be " + fromMode +
                                    " when the mode is " + self._currentMode + ".");
                }
                self._currentMode = null;
                self._currentPayload = null;
                self.emit(CAEvent.Name.CHANGED_MODE);
                resolve();
            });
        },


        actionHandler: {

            CANCEL_EXAM_RUN: function (payload) {
                var self = this;
                return new Promise(function (resolve, reject) { 
                    Anchor.set({ pageKey: 'course' }, { silent: true });
                    resolve();
                })
                 .then(
                    // Success.
                    function () {
                        return self._removeMode({ fromMode: PageStore.Mode.CANCEL_EXAM_RUN});
                    },
                    // Error.
                    function (error) {
                        throw error;
                    })

                   .then(
                    // Success
                    function () {
                        self.emit(CAEvent.Name.LOADED_PAGE);
                    },
                    // Failure
                    function (error) {
                        throw error;
                    });
            },


            CREATE_COURSE: function (payload) {
                return this._removeMode({ fromMode: PageStore.Mode.CREATE_COURSE });
            },


            CREATE_EXAM: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.ExamStore().dispatcherIndex ])
                                 .then(
                                    // Success.
                                    function () {
                                        return self._removeMode(
                                                    { fromMode: PageStore.Mode.CREATE_EXAM });
                                    },
                                    // Error.
                                    function (error) {
                                        throw error;
                                    });
            },


            CREATE_QUESTION: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.ExamStore().dispatcherIndex ])
                                // Wait for the Exam Store to create the new
                                // question.
                                 .then(
                                    // Success.
                                    function () {
                                        return self._removeMode(
                                                    { fromMode: PageStore.Mode.CREATE_QUESTION});
                                    },
                                    // Error.
                                    function (error) {
                                        throw error;
                                    });
            },


            DELETE_QUESTION: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.ExamStore().dispatcherIndex ])
                                // Done waiting for the exam store to delete
                                // the question.
                                 .then(
                                    // Success.
                                    function() {
                                        return self._removeMode(
                                                    { fromMode: PageStore.Mode.DELETE_QUESTION });
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    });
            },

            // TODO: Get rid of this action.
            DISPLAY_EXAM: function (payload) {
                var self = this;
                return new Promise(function(resolve, rejected) {
                    // Nothing to do yet. Might add stuff here
                    if (!payload.examId) {
                        throw new Error("Displayed exam without any exam");
                    }
                    Anchor.set({pageKey: 'course', examId: payload.examId},
                               {silent: true});
                    self.emit(CAEvent.Name.DID_LOAD_EXAM);
                    resolve();
                });
            },


            EDIT_QUESTION: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.ExamStore().dispatcherIndex ])
                                 .then(
                                    // Success.
                                    function () {
                                        return self._removeMode(
                                                    { fromMode: this.Mode.EDIT_QUESTION });
                                    },
                                    // Error.
                                    function (error) {
                                        throw error;
                                    });
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


            FROM_MODE_EDIT_QUESTION: function (payload) {
                return this._removeMode({ fromMode: this.Mode.EDIT_QUESTION });
            },


            PERFORM_LOAD: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex, 
                                            Stores.CourseStore().dispatcherIndex,
                                            Stores.ExamStore().dispatcherIndex,
                                            Stores.FieldStore().dispatcherIndex ])

                         .then(
                            // Success.
                            function() {
                                payload.updateHash = (typeof payload.updateHash === 'boolean') ?
                                                     payload.updateHash :
                                                     true;
                                if (!payload.pageKey) {
                                    throw new Error("Page loaded without pageKey specified.");
                                }
                                if (payload.updateHash) {
                                    switch (payload.pageKey) {
                                    // All hash changes here should be set to silent. Non-silent
                                    // hash changes may be picked up and converted to another
                                    // action.
                                    case 'course':
                                        Anchor.set({pageKey: 'course', course: payload.course},
                                                   {silent: true});
                                        break;
                                    case 'home':
                                        Anchor.set({pageKey: 'home'},
                                                   {silent: true});
                                        Anchor.unset(['examId'], { silent: true });
                                        break;
                                    default:
                                        Anchor.set({pageKey: payload.pageKey},
                                                   {silent: true});
                                    }
                                }
                                if (payload.removeMode) {
                                    self._removeMode({ fromMode: payload.removeMode });
                                }
                                self.emit(CAEvent.Name.LOADED_PAGE);
                            },
                            // Error.
                            function(error) {
                                throw error;
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

