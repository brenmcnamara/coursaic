/**
 * PageStore.js
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

/*global Store */

var PageStore = (function() {

    var StoreClass = function() {};

    StoreClass.prototype =  new Store();

    StoreClass.prototype.actionHandler = function(name) {
        var self = this;
        switch (name) {
            case Action.Name.PERFORM_LOAD:
                return function(payload) {
                    return Dispatcher.waitFor([ UserStore.dispatcherIndex, CourseStore.dispatcherIndex,
                                                ExamStore.dispatcherIndex, FieldStore.dispatcherIndex ])

                                     .then(
                                        // Success.
                                        function() {
                                            self.emit(new CAEvent(CAEvent.Name.DID_LOAD));
                                        },
                                        // Error.
                                        function(error) {
                                            throw error;
                                        });
                };
                    
        };
    };

    return new StoreClass();

}());