/**
 * action.js
 *
 * Defines the Action object that is used
 * to communicate behavior between the Views
 * and dispatcher.
 */

var Dispatcher = require('./torque').Dispatcher,

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

    LOAD_NOT_FOUND: 'LOAD_NOT_FOUND',

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
 * Send an action through the dispatcher.
 *
 * @method send
 *
 * @param name {String} The name of the
 *  action.
 *
 * @param payload {Object} The action
 *  parameters.
 *
 * @param options {Object} Options that can be injected
 *  into the dispatch of the action. This includes success
 *  and error callbacks when the action has completed dispatching.
 */
Action.send = function(name, payload) {
    return Dispatcher.dispatch(name, payload);
};

module.exports = {
    Action: Action
};

