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
 *
 * @param name {String} The name of the action
 *
 * @param params {Object} Any parameters that are
 *  used to specify the action. These parameters
 *  are interpretted by the dispathcer.
 */
var Action = function(name, params) {
    if (!(this instanceof Action)) {
        return new Action(name, params);
    }
    this._name = name;
    this._params = params || null;
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


/**
 * Getter for the parameters of
 * the action.
 *
 * @method getParams
 * @return {Object} The parameters of the
 *  action, or null if there are no
 *  parameters.
 */
Action.prototype.getParams = function() {
    return this._params;
};

