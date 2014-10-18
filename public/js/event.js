/**
 * event.js
 *
 * Defines the event class.
 */

/**
 * An event that is propogated through stores
 * and controller-views.
 *
 * @class Event
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
var Event = function(name, params) {
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
Event.Name = {};

