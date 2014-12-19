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


    StoreClass.prototype.courseId = function() {
        return Anchor.hashMap().course;
    };


    StoreClass.prototype.examId = function() {
        return Anchor.hashMap().examId;
    };


    return (self = new StoreClass());

}());

