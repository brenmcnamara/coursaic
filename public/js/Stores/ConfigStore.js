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
                            case 'course':
                                Anchor.set({pageKey: 'course', course: payload.course},
                                           {silent: true});
                                break;
                            default:
                                Anchor.set({pageKey: payload.pageKey}, {silent: true});
                            }
                        }

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
     * page.
     */
    StoreClass.prototype.courseId = function() {

    };


    return new StoreClass();

}());

