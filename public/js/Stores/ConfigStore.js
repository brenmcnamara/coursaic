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
        },
        self;

    StoreClass.prototype = new Store();

    StoreClass.prototype.actionHandler = {


        PERFORM_LOAD: function (payload) {
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
        },


        CANCEL_EXAM_RUN: function (payload) {
            return new Promise(function (resolve, reject) {
                Anchor.set({ pageKey: 'course' });
                resolve();
            });
        },


        DISPLAY_EXAM: function (payload) {
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


    return (self = new StoreClass());

}());

