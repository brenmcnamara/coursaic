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

    var StoreClass = function() {};

    StoreClass.prototype =  new Store();

    // TODO: Delete this function after creating the CHANGE_MODE action.
    StoreClass.prototype._addMode = function(inputMap) {
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
            resolve();
        });
    };


    // TODO: Delete this function after creating the CHANG_MODE action.
    StoreClass.prototype._removeMode = function(inputMap) {
        var self = this,
            fromMode = inputMap.fromMode;

        return new Promise(function(resolve, reject) {
            if (self._currentMode !== fromMode) {
                throw new Error("Expected mode to be " + fromMode +
                                " when the mode is " + self._currentMode + ".");
            }
            self._currentMode = null;
            self._currentPayload = null;
            resolve();
        });
    };


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:
                return function(payload) {
                    return Dispatcher.waitFor([ UserStore.dispatcherIndex, CourseStore.dispatcherIndex,
                                                ExamStore.dispatcherIndex, FieldStore.dispatcherIndex ])

                                     .then(
                                        // Success.
                                        function() {
                                            self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        });
                };
            case Action.Name.CREATE_COURSE:
                return function(payload) {
                    return Dispatcher.waitFor([ CourseStore.dispatcherIndex ])
                                     .then(
                                        // Success.
                                        function() {
                                            return self._removeMode({ fromMode: PageStore.Mode.CREATE_COURSE });
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        });

                };
            case Action.Name.ENTER_CREATE_COURSE_MODE:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.CREATE_COURSE,
                                           toPayload: payload });
                };
            case Action.Name.CANCEL_CREATE_COURSE:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_COURSE });
                };
            case Action.Name.ENTER_DELETE_QUESTION_MODE:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.DELETE_QUESTION,
                                           toPayload: payload });
                };
            case Action.Name.CANCEL_DELETE_QUESTION_MODE:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.DELETE_QUESTION });
                };
            case Action.Name.DELETE_QUESTION:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.DELETE_QUESTION });
                };
            case Action.Name.ENTER_CANCEL_EXAM_RUN_MODE:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.CANCEL_EXAM_RUN,
                                           toPayload: payload });
                };
            case Action.Name.EXIT_CANCEL_EXAM_RUN_MODE:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CANCEL_EXAM_RUN });
                };
            case Action.Name.CANCEL_EXAM_RUN:
                return function(payload) {
                    return Dispatcher.waitFor([ ConfigStore.dispatcherIndex ])
                                     .then(
                                        // Success.
                                        function() {
                                            return self._removeMode({ fromMode: PageStore.Mode.CANCEL_EXAM_RUN });
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        })
                                     // Wait for the mode to change.
                                     .then(
                                        // Success.
                                        function() {
                                            self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        });
                };
            case Action.Name.ENTER_NEW_QUESTION_MODE:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.CREATE_QUESTION,
                                           toPayload: payload });
                };
            case Action.Name.CANCEL_CREATE_QUESTION:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_QUESTION });
                };
            case Action.Name.SAVE_QUESTION_NEW:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_QUESTION });
                };
            case Action.Name.ENTER_CREATE_EXAM_MODE:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.CREATE_EXAM,
                                           toPayload: payload });
                };
            case Action.Name.CANCEL_CREATE_EXAM:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_EXAM });
                };
            case Action.Name.CREATE_EXAM:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.CREATE_EXAM });
                };
            case Action.Name.PERFORM_QUESTION_EDIT:
                return function(payload) {
                    return self._addMode({ toMode: PageStore.Mode.EDIT_QUESTION,
                                           toPayload: payload });
                };
            case Action.Name.CANCEL_QUESTION_EDIT:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.EDIT_QUESTION });
                };
            case Action.Name.SAVE_QUESTION_EDIT:
                return function(payload) {
                    return self._removeMode({ fromMode: PageStore.Mode.EDIT_QUESTION });
                };
        };
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


    return new StoreClass();

}());

PageStore.Mode = {
    CANCEL_EXAM_RUN: 'CANCEL_EXAM_RUN',
    CREATE_COURSE: 'CREATE_COURSE',
    CREATE_EXAM: 'CREATE_EXAM',
    CREATE_QUESTION: 'CREATE_QUESTION',
    DELETE_QUESTION: 'DELETE_QUESTION',
    EDIT_QUESTION: 'EDIT_QUESTION'
};

