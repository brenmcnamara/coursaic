/**
 * ConfigStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Action, CAEvent */

/**
 * Contains all the major state for the current
 * page that defines the type of page it is, and
 * the major attributes of the page.
 *
 * @module Store
 * @class ConfigStore
 */
var ConfigStore = (function() {

    var StoreClass = function() {
        this.dispatcherIndex = 1;
    };

    StoreClass.prototype = new Store();


    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:

                return function(payload) {
                    // Update hash has a default value
                    // of true if not provided. UpdateHash
                    // is used to update the hash of the page.
                    // This should be set to false if the load
                    // action is coming from an event that is watching
                    // the hash.
                    payload.updateHash = (typeof payload.updateHash === 'boolean') ?
                                         payload.updateHash :
                                         true;

                    // Get the promise for the login process.
                    return new Promise(function(resolve, rejected) {
                        // Nothing to do yet. Might add stuff here
                        if (!payload.pageKey) {
                            throw new Error("Page loaded without pageKey specified.");
                        }
                        if (payload.updateHash) {
                            // TODO: This is very hacky.
                            Anchor.unset(['examResults'], { silent: true });
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

                        resolve();
                    });
                };
            case Action.Name.DISPLAY_EXAM:
                return function(payload) {
                    // Get the promise for the exam display process.
                    return new Promise(function(resolve, rejected) {
                        // Nothing to do yet. Might add stuff here
                        if (!payload.examId) {
                            throw new Error("Displayed exam without any exam");
                        }
                        Anchor.set({pageKey: 'course', examId: payload.examId},
                                   {silent: true});
                        resolve();
                    });
                };
            case Action.Name.CREATE_EXAM:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        Anchor.unset(['createExam'], { silent: true });
                        resolve();
                    });
                };
            case Action.Name.ENTER_CANCEL_EXAM_RUN_MODE:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        Anchor.set({ 'cancelExam': 'true' }, { silent: true });
                        resolve();
                    });
                };
            case Action.Name.EXIT_CANCEL_EXAM_RUN_MODE:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        Anchor.unset(['cancelExam'], { silent: true });
                        resolve();
                    });
                };
            case Action.Name.CANCEL_EXAM_RUN:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        Anchor.unset(['cancelExam'], { silent: true });
                        Anchor.set({'pageKey': 'course'}, { silent: true });
                        resolve();
                    });
                };
            case Action.Name.SUBMIT_EXAM_RUN:
                return function(payload) {
                    return new Promise(function(resolve, reject) {
                        Anchor.set({'examResults': 'true'}, { silent: true });
                        resolve();
                    });
                };
            default:
                return null;
        }
    };


    /**
     * Get the page key for the current page. This method should
     * only be called after the page has been loaded.
     *
     * @method pageKey
     *
     * @return {String} A key representing the current page.
     */
    StoreClass.prototype.pageKey = function() {
        return Anchor.hashMap().pageKey;
    };


    /**
     * Get the id of the course representing
     * the current page. Note that this is only
     * applicable to a pageKey of 'course'.
     *
     * @method courseId
     *
     * @return {String} The id of the course for the current
     * page. If the page does not specify a course id, then this
     * will return null.
     */
    StoreClass.prototype.courseId = function() {
        return Anchor.hashMap().course || null;
    };


    /**
     * Get the id of the exam that is being presented
     * on the current page.  Note that this is applicable
     * for certain pageKey's, such as the 'course' pageKey.
     *
     * @method examId
     *
     * @return {String} The id of the exam for the current page.
     *  If the page does not specify an exam id, then this will
     *  return null.
     */
    StoreClass.prototype.examId = function() {
        return Anchor.hashMap().examId || null;
    };


    /**
     * Get the id of the question that is being edited
     * on the current page.  
     *
     * @method questionEditId
     *
     * @return {String} The id of the question that
     * is being deleted.
     */
    StoreClass.prototype.questionEditId = function() {
        return Anchor.hashMap().questionEditId || null;
    };


    /**
     * Get the id of the question that is being deleted
     * on the current page.  Note that this is applicable
     * for certain pageKey's, such as the 'course' pageKey.
     *
     * @method deleteQuestionId
     *
     * @return {String} The id of the exam for the current page.
     *  If the page does not specify an exam id, then this will
     *  return null.
     */
    StoreClass.prototype.deleteQuestionId = function() {
        return Anchor.hashMap().deleteQuestionId || null;
    };


    /**
     * Determine if the hash specifies that a class
     * is in the process of being canceled.
     *
     * @method isCancelingExamRun
     *
     * @return {Boolean} True if an exam run is being
     *  canceled, false otherwise.
     */
     StoreClass.prototype.isCancelingExamRun = function() {
        return Anchor.hashMap().cancelExam === 'true';
     };


     StoreClass.prototype.isShowingExamResults = function() {
        return Anchor.hashMap().examResults === 'true';
     };


    return new StoreClass();

}());

