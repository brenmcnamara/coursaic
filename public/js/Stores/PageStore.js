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

var PageStore = (function() {

    var StoreClass = function() {

        this.dispatcherIndex = 6;
    },
        self;

    StoreClass.prototype = new Store();

    // TODO: Delete this function after creating the CHANGE_MODE action.
    StoreClass.prototype._addMode = function(inputMap) {
        var
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
            self.emit(new CAEvent(CAEvent.Name.CHANGED_MODE));
            resolve();
        });
    };


    // TODO: Delete this function after creating the CHANG_MODE action.
    StoreClass.prototype._removeMode = function(inputMap) {
        var fromMode = inputMap.fromMode;

        return new Promise(function(resolve, reject) {
            if (self._currentMode !== fromMode) {
                throw new Error("Expected mode to be " + fromMode +
                                " when the mode is " + self._currentMode + ".");
            }
            self._currentMode = null;
            self._currentPayload = null;
            self.emit(new CAEvent(CAEvent.Name.CHANGED_MODE));
            resolve();
        });
    };


    StoreClass.prototype.actionHandler = {
        
        TO_MODE_DELETE_QUESTION: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.DELETE_QUESTION,
                                   toPayload: payload });
        },


        PERFORM_LOAD: function (payload) {
            return Dispatcher.waitFor([ UserStore.dispatcherIndex, CourseStore.dispatcherIndex,
                                        ExamStore.dispatcherIndex, FieldStore.dispatcherIndex ])

                             .then(
                                // Success.
                                function() {
                                    if (payload.removeMode) {
                                        self._removeMode({ fromMode: payload.removeMode });
                                    }
                                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
        },


        CREATE_COURSE: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.CREATE_COURSE });
        },


        ENTER_CREATE_COURSE_MODE: function (payload) {
            console.log("Create course mode.");
            return self._addMode({ toMode: PageStore.Mode.CREATE_COURSE,
                                   toPayload: payload });
        },


        CANCEL_CREATE_COURSE: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.CREATE_COURSE });
        },


        CANCEL_DELETE_QUESTION_MODE: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.DELETE_QUESTION });
        },


        DELETE_QUESTION: function (payload) {
            return Dispatcher.waitFor([ ExamStore.dispatcherIndex ])
                            // Done waiting for the exam store to delete
                            // the question.
                             .then(
                                // Success.
                                function() {
                                    return self._removeMode({ fromMode: PageStore.Mode.DELETE_QUESTION });
                                },
                                // Error.
                                function(error) {
                                    throw error;
                                });
        },


        ENTER_CANCEL_EXAM_RUN_MODE: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.CANCEL_EXAM_RUN,
                                   toPayload: payload });
        },


        EXIT_CANCEL_EXAM_RUN_MODE: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.CANCEL_EXAM_RUN });
        },


        CANCEL_EXAM_RUN: function (payload) {
            return Dispatcher.waitFor([ ConfigStore.dispatcherIndex ])
                             .then(
                                // Success.
                                function () {
                                    return self._removeMode({ fromMode: PageStore.Mode.CANCEL_EXAM_RUN})
                                },
                                // Error.
                                function (error) {
                                    throw error;
                                })

                               .then(
                                // Success
                                function () {
                                    self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                                },
                                // Failure
                                function (error) {
                                    throw error;
                                });
        },


        CANCEL_CREATE_QUESTION: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.CREATE_QUESTION,
                                   toPayload: payload });
        },


        ENTER_NEW_QUESTION_MODE: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.CREATE_QUESTION,
                                   toPayload: payload });
        },


        SAVE_QUESTION_NEW: function (payload) {
            return Dispatcher.waitFor([ ExamStore.dispatcherIndex ])
                            // Wait for the Exam Store to create the new
                            // question.
                             .then(
                                // Success.
                                function () {
                                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_QUESTION});
                                },
                                // Error.
                                function (error) {
                                    throw error;
                                });
        },


        ENTER_CREATE_EXAM_MODE: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.CREATE_EXAM,
                                   toPayload: payload });
        },


        CANCEL_CREATE_EXAM: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.CREATE_EXAM });
        },


        CREATE_EXAM: function (payload) {
            console.log("Calling CREATE_EXAM");
            return Dispatcher.waitFor([ ExamStore.dispatcherIndex ])
                             .then(
                                // Success.
                                function () {
                                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_EXAM });
                                },
                                // Error.
                                function (error) {
                                    throw error;
                                });
        },


        PERFORM_QUESTION_EDIT: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.EDIT_QUESTION,
                                   toPayload: payload });
        },


        CANCEL_QUESTION_EDIT: function (payload) {
            return self._removeMode({ fromMode: PageStore.Mode.EDIT_QUESTION });
        },


        SAVE_QUESTION_EDIT: function (payload) {
            return Dispatcher.waitFor([ ExamStore.dispatcherIndex ])
                             .then(
                                // Success.
                                function () {
                                    return self._removeMode({ fromMode: PageStore.Mode.EDIT_QUESTION });
                                },
                                // Error.
                                function (error) {
                                    throw error;
                                });
        },


        SUBMIT_EXAM_RUN: function (payload) {
            return self._addMode({ toMode: PageStore.Mode.VIEW_EXAM_RESULTS,
                                   toPayload: payload });
        }


    };
    /**
     * Get the current mode for the page.
     *
     * @method currentMode
     *
     * @return {String} The current mode of the page.
     *  If there is no current mode, it will return null.
     */
    StoreClass.prototype.currentMode = function() {
        return this._currentMode || null;
    };


    /**
     * Get the payload for the current mode.
     *
     * @method currentPayload
     *
     * @return {Object} The payload for the current
     *  mode. If there is no mode, this will return null.
     */
    StoreClass.prototype.currentPayload = function() {
        return this._currentPayload || null;
    };


    return (self = new StoreClass());

}());


PageStore.Mode = {
    CANCEL_EXAM_RUN: 'CANCEL_EXAM_RUN',
    CREATE_COURSE: 'CREATE_COURSE',
    CREATE_EXAM: 'CREATE_EXAM',
    CREATE_QUESTION: 'CREATE_QUESTION',
    DELETE_QUESTION: 'DELETE_QUESTION',
    EDIT_QUESTION: 'EDIT_QUESTION',
    VIEW_EXAM_RESULTS: 'VIEW_EXAM_RESULTS'
};

