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
                    // Get the promise for the login process.
                    return new Promise(function(resolve, rejected) {
                        // Nothing to do yet. Might add stuff here
                        resolve();
                    });
                };
            default:
                return null;
        }
    };


    /**
     * @method pageKey
     *
     * @return {String} A key representing the current page.
     */
    StoreClass.prototype.pageKey = function() {
        // Currently, on the home page is being represented.
        // Change this when adding other pages. The page key will
        // have to be provided by the application and used to
        // configure other parts of this store.
        return 'home';
    };

    return new StoreClass();

}());

