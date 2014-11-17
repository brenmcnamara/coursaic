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
    // TODO (brendan): Better name for this event.
    DID_LOAD: 'DID_LOAD',
    DID_FETCH_COURSES: 'DID_FETCH_COURSES',
    DID_LOAD_EXAM: 'DID_LOAD_EXAM',
    // Event for when all exams of a course
    // are fetched.
    DID_FETCH_EXAMS: 'DID_FETCH_EXAMS'
};

