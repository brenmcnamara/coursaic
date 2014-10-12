/**
 * action.js
 *
 * Defines the Action object that is used
 * to communicate behavior between the Views
 * and dispatcher.
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/**
 * Actions that are communicated between
 * the views and dispatcher.
 *
 * @class Action
 * @constructor
 * @param name {String} The name of the action
 */
var Action = function(name) {
    if (!(this instanceof Action)) {
        return new Action(name);
    }
    this._name = name;
};


/**
 * Getter for the name of the action.
 *
 * @method getName
 * @return {String} The name of the action.
 */
Action.prototype.getName = function() {
    return this._name;
};

