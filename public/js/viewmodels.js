/**
 * viewmodels.js
 *
 * Contains all the view models that
 * tranlsates models into views that
 * React views can interpret. ViewModels
 * serve as the bridge between Stores
 * and Views.
 */

 /*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/**
 * @module ViewModel
 */
var ViewModel = {};

/**
 * Convert the User to a view-model that React
 * can interpret.
 *
 * @method user
 * 
 * @param user {Parse.User} The user to
 * convert into a view-model.
 *
 * @return {Object} A hash of properties
 * to render the user.
 */
ViewModel.user = function(user) {
    return {
        "firstName": user.get("firstName"),
        "lastName": user.get("lastName"),
        "photoUrl": user.get("photoUrl")
    };
};

