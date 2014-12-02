/**
 * event.js
 *
 * Defines the event class.
 */

/**
 * An event that is propogated through stores
 * and controller-views.
 *
 * @class CAEvent
 * @constructor
 *
 * @param name {String} The name of the event.
 *  The name of any event should match with an
 *  event name listed in the objects.
 *
 * @param params {Object} Any parameters that
 * should be available to callbacks of this event.
 * These parameters are bound directly to the event
 * object. The parameters should never contain a
 * "name" property.
 */
var CAEvent = function(name, params) {
    var prop;
    this.name = name;
    for (prop in params) {
        if (params.hasOwnProperty(prop)) {
            this[prop] = params[prop];
        }
    }
};

/**
 * Possible event names.
 * These are constants that should
 * never be redefined outside
 * of this module.
 *
 * @property Name
 * @type Object
 */
CAEvent.Name = {
    // TODO: Better name for this event.
    DID_LOAD: 'DID_LOAD',
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
    DID_GRADE_EXAM_RUN: 'DID_GRADE_EXAM_RUN'
};

