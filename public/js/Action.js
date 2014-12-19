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
    // The page just loaded
    PERFORM_LOAD: 'PERFORM_LOAD',
    DISPLAY_EXAM: 'DISPLAY_EXAM',
    // Action that is called when the
    // for entering create-course mode.
    ENTER_CREATE_COURSE_MODE: 'ENTER_CREATE_COURSE_MODE',

    CREATE_COURSE: 'CREATE_COURSE',
    CANCEL_CREATE_COURSE: 'CANCEL_CREATE_COURSE',

    PERFORM_QUESTION_EDIT: 'PERFORM_QUESTION_EDIT',
    CANCEL_QUESTION_EDIT: 'CANCEL_QUESTION_EDIT',
    SAVE_QUESTION_EDIT: 'SAVE_QUESTION_EDIT',

    // Change the enrollment status of the current
    // user for a particular course. The id of the course
    // to change the enrollment status for should be provided
    // in the payload of the action.
    ENROLL_CURRENT_USER: 'ENROLL_CURRENT_USER',
    UNENROLL_CURRENT_USER: 'UNENROLL_CURRENT_USER',
    ENTER_NEW_QUESTION_MODE: 'ENTER_NEW_QUESTION_MODE',
    CANCEL_CREATE_QUESTION: 'CANCEL_CREATE_QUESTION',
    
    SAVE_QUESTION_NEW: 'SAVE_QUESTION_NEW',
    
    FROM_MODE_CREATE_EXAM: 'FROM_MODE_CREATE_EXAM',
    FROM_MODE_DELETE_QUESTION: 'FROM_MODE_DELETE_QUESTION',
    TO_MODE_CREATE_EXAM: 'TO_MODE_CREATE_EXAM',
    TO_MODE_DELETE_QUESTION: 'TO_MODE_DELETE_QUESTION',

    DELETE_QUESTION: 'DELETE_QUESTION',
    
    CREATE_EXAM: 'CREATE_EXAM',

    // Called when the user tries to cancel
    // an exam that is in process.
    ENTER_CANCEL_EXAM_RUN_MODE: 'ENTER_CANCEL_EXAM_RUN_MODE',
    EXIT_CANCEL_EXAM_RUN_MODE: 'EXIT_CANCEL_EXAM_RUN_MODE',
    CANCEL_EXAM_RUN: 'CANCEL_EXAM_RUN',
    
    SUBMIT_EXAM_RUN: 'SUBMIT_EXAM_RUN'
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

