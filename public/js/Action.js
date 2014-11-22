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

/*global Dispather */


var Action = {};

Action.Name = {
    // TODO (daniel): Add an action to this list.
    // The page just loaded
    PERFORM_LOAD: 'PERFORM_LOAD',
    DISPLAY_EXAM: 'DISPLAY_EXAM',
    PERFORM_QUESTION_EDIT: 'PERFORM_QUESTION_EDIT',
    SAVE_QUESTION_EDIT: 'SAVE_QUESTION_EDIT'
    //SAVE_QUESTION_EDIT: 'SAVE_QUESTION_EDIT'
};


/**
 * Register the actions with the dispatcher.
 * This will reset the registered actions each
 * time this is called. This method must be called
 * before using Action.send.
 *
 * @method register
 */
Action.register = function() {
    var prop;
    for (prop in Action.Name) {
        if (Action.Name.hasOwnProperty(prop) && typeof prop === 'string') {
            Dispatcher.register(Action.Name[prop]);
        }
    }
};


/**
 * Send an action through the dispatcher.
 *
 * @method send
 *
 * @param name {String} The name of the
 *  action.
 *
 * @param payload {Object} The action
 *  parameters.
 */
Action.send = function(name, payload) {
    Dispatcher.dispatch(name, payload);
};

