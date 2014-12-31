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
         maxlen:100, node:true
*/

var Dispatcher = require('./dispatcher.js'),

    Action = {};

Action.Name = {

    CREATE_COURSE: 'CREATE_COURSE',

    CREATE_EXAM: 'CREATE_EXAM',

    CREATE_QUESTION: 'CREATE_QUESTION',

    DELETE_QUESTION: 'DELETE_QUESTION',

    EDIT_QUESTION: 'EDIT_QUESTION',

    ENROLL_CURRENT_USER: 'ENROLL_CURRENT_USER',
    
    FROM_MODE_CANCEL_EXAM_RUN: 'FROM_MODE_CANCEL_EXAM_RUN',

    FROM_MODE_CREATE_COURSE: 'FROM_MODE_CREATE_COURSE',

    FROM_MODE_CREATE_EXAM: 'FROM_MODE_CREATE_EXAM',

    FROM_MODE_CREATE_QUESTION: 'FROM_MODE_CREATE_QUESTION',

    FROM_MODE_DELETE_QUESTION: 'FROM_MODE_DELETE_QUESTION',

    FROM_MODE_EDIT_QUESTION: 'FROM_MODE_EDIT_QUESTION',

    LOAD_COURSE: 'LOAD_COURSE',

    LOAD_EXAM_RUN: 'LOAD_EXAM_RUN',

    LOAD_HOME: 'LOAD_HOME',

    SUBMIT_EXAM_RUN: 'SUBMIT_EXAM_RUN',

    TO_MODE_CANCEL_EXAM_RUN: 'TO_MODE_CANCEL_EXAM_RUN',

    TO_MODE_CREATE_COURSE: 'TO_MODE_CREATE_COURSE',    

    TO_MODE_CREATE_EXAM: 'TO_MODE_CREATE_EXAM',

    TO_MODE_CREATE_QUESTION: 'TO_MODE_CREATE_QUESTION',

    TO_MODE_DELETE_QUESTION: 'TO_MODE_DELETE_QUESTION',

    TO_MODE_EDIT_QUESTION: 'TO_MODE_EDIT_QUESTION',

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

module.exports = {
    Action: Action
};

