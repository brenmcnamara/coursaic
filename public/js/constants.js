/**
 * constants.js
 *
 * All the constants for the application.
 */

var
    Event = {

        LOADED_PAGE: 'LOADED_PAGE',

        PAGE_NOT_FOUND: 'PAGE_NOT_FOUND',
        
        DID_FETCH_COURSES: 'DID_FETCH_COURSES',
        // Event for when the exam hash is updated
        // to display an exam on the course page.
        DID_LOAD_EXAM: 'DID_LOAD_EXAM',
        // Event for when all exams of a course
        // are fetched.
        DID_FETCH_EXAMS: 'DID_FETCH_EXAMS',

        DID_CREATE_COURSE: 'DID_CREATE_COURSE',
        DID_CREATE_EXAM: 'DID_CREATE_EXAM',
        DID_CANCEL_CREATE_COURSE: 'DID_CANCEL_CREATE_COURSE',

        // Event for when you successfully enter
        // edit mode. 
        DID_BEGIN_EDITING: 'DID_BEGIN_EDITING',
        // Event for when you successfuly exit
        // the edit mode.
        DID_END_EDITING: 'DID_END_EDITING',

        // Notify that the enrollment of the current
        // user has changed.
        DID_CHANGE_ENROLLMENT: 'DID_CHANGE_ENROLLMENT',

        DID_CREATE_QUESTION: 'DID_CREATE_QUESTION',

        DID_CREATE_EXAM_RUN: 'DID_CREATE_EXAM_RUN',
        DID_GRADE_EXAM_RUN: 'DID_GRADE_EXAM_RUN',

        CHANGED_MODE: 'CHANGED_MODE'
    },


    Action = {

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

        LOAD_EXAM_RUN: 'LOAD_EXAM_RUN',

        LOAD_COURSE: 'LOAD_COURSE',

        LOAD_NOT_FOUND: 'LOAD_NOT_FOUND',

        LOGIN: 'LOGIN',

        SIGNUP: 'SIGNUP',
        
        SUBMIT_EXAM_RUN: 'SUBMIT_EXAM_RUN',

        TO_MODE_CANCEL_EXAM_RUN: 'TO_MODE_CANCEL_EXAM_RUN',

        TO_MODE_CREATE_COURSE: 'TO_MODE_CREATE_COURSE',    

        TO_MODE_CREATE_EXAM: 'TO_MODE_CREATE_EXAM',

        TO_MODE_CREATE_QUESTION: 'TO_MODE_CREATE_QUESTION',

        TO_MODE_DELETE_QUESTION: 'TO_MODE_DELETE_QUESTION',

        TO_MODE_EDIT_QUESTION: 'TO_MODE_EDIT_QUESTION',

        UNENROLL_CURRENT_USER: 'UNENROLL_CURRENT_USER'

    },


    ErrorType = { 

        INVALID_EXAM_RUN: "INVALID_EXAM_RUN",

        NO_USER_CREDENTIALS: "NO_USER_CREDENTIALS"

    };


module.exports = {
    Event: Event,
    Action: Action,
    ErrorType: ErrorType
};
