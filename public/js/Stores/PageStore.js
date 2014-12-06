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
                                            if (self._currentMode !== PageStore.Mode.CREATE_COURSE) {
                                                throw new Error("Cannot create a course " +
                                                                "when not in CREATE_COURSE mode.");
                                            } 
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        });

                };
            case Action.Name.ENTER_CREATE_COURSE_MODE:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        if (self._currentMode) {
                            throw new Error("Attempting to change to mode: " +
                                            PageStore.Mode.CREATE_COURSE + 
                                            " when already in mode " + self._currentMode);
                        }
                        self._currentMode = PageStore.Mode.CREATE_COURSE;
                        // TODO (brendan): Copy the payload.
                        self._currentPayload = payload;
                        resolve();
                    });
                };
            case Action.Name.CANCEL_CREATE_COURSE:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        if (self._currentMode !== PageStore.Mode.CREATE_COURSE) {
                            throw new Error("Cannot cancel create course " +
                                            "when not in CREATE_COURSE mode.");
                        }
                        self._currentMode = null;
                        self._currentPayload = null;
                        resolve();
                    });
                };
        };
    };

    /**
     * Get the current mode for the page.
     *
     * @method mode
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
     * @method payload
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
    CANCEL_TAKE_EXAM: 'CANCEL_TAKE_EXAM',
    CREATE_COURSE: 'CREATE_COURSE',
    CREATE_EXAM: 'CREATE_EXAM',
    CREATE_QUESTION: 'CREATE_QUESTION',
    DELETE_QUESTION: 'DELETE_QUESTION',
    EDIT_QUESTION: 'EDIT_QUESTION'
};

