/**
 * FieldStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Store */

var Field = Parse.Object.extend("Field"),

    FieldStore = (function() {

        /**
         * Private constructor for the field store.
         *
         * @class FieldStore
         * @private
         * @constructor
         */
        var StoreClass = function() {
            this._fieldHash = {};
            this.dispatcherIndex = 5;
        }
            self;

        StoreClass.prototype = new Store();

        StoreClass.prototype.actionHandler = {

            PERFORM_LOAD: function (payload) {
                return Dispatcher.waitFor([UserStore.dispatcherIndex])
                            
                                .then(
                                    // Success.
                                    function() {
                                        var query = new Parse.Query(Field);
                                        query.find({
                                            success: function(response) {
                                                response.forEach(function(field) {
                                                    // TODO: This is not equality safe.
                                                    self._fieldHash[field.id] = field;
                                                });
                                            },

                                            error: function(error) {
                                                throw error;
                                            }
                                        });
                                    },
                                    // Error.
                                    function(error) {
                                        throw error;
                                    });
            }


        };


        /**
         * Get all the fields that are currently in
         * the collection.
         *
         * @method fields
         *
         * @return {Array} An array containing all the fields.
         */
        StoreClass.prototype.fields = function() {
            var prop, arr = [];
            for (prop in this._fieldHash) {
                if (this._fieldHash.hasOwnProperty(prop)) {
                    arr.push(this._fieldHash[prop]);
                }
            }
            return arr;
        };


        /**
         * Get the field for a particular course. This will update the
         *  course's field property to contain the field.
         *
         * @method fetchFieldForCourse
         *
         * @param course {Course} The course to get the field for.
         *
         * @return {Promise} A promise that is called when the field
         *  has been fetched. The success callback for the promise
         *  will accept a single parameter of the course being updated.
         *  The failure callback will contain an error object.
         */
        StoreClass.prototype.fetchFieldForCourse = function(course) {
            return new Promise(function(resolve, reject) {
                var oldField = course.get('field');
                if (self._fieldHash[oldField.id]) {
                    course.set('field', self._fieldHash[oldField.id]);
                    resolve(course);
                }
                else {
                    oldField.fetch({
                        success: function() {
                            // Add the field to the field hash because
                            // it does not currently exist.
                            self._fieldHash[oldField.id] = oldField;
                            resolve(course);
                        },

                        error: function(error) {
                            throw error;
                        }
                    });
                }
            });
        };


        return (self = new StoreClass());
        
    }());