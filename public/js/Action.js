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
    // Action that is called when the
    // for entering create-course mode.
    ENTER_CREATE_COURSE_MODE: 'ENTER_CREATE_COURSE_MODE',

    CREATE_COURSE: 'CREATE_COURSE',
    CANCEL_CREATE_COURSE: 'CANCEL_CREATE_COURSE',

    PERFORM_QUESTION_EDIT: 'PERFORM_QUESTION_EDIT',
    SAVE_QUESTION_EDIT: 'SAVE_QUESTION_EDIT',

    // Change the enrollment status of the current
    // user for a particular course. The id of the course
    // to change the enrollment status for should be provided
    // in the payload of the action.
    ENROLL_CURRENT_USER: 'ENROLL_CURRENT_USER',
    UNENROLL_CURRENT_USER: 'UNENROLL_CURRENT_USER'

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

