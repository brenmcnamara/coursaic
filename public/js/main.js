
var Dispatcher = require('./dispatcher.js'),
    Stores = require('./stores'),
    Action = require('./Action.js').Action,
    CAEvent = require('./Event.js').CAEvent,
    View = require('./layout'),
    Schema = require('./schema'),
    Router = require('./router.js');

Parse.initialize("4mcPYbWGU0hIVcVCW5XKMgY5Gtr7UuPlRZkPnWj1", "Bl2qeQ6LdbhLpgi8B2a7nCpeITBs8QBeDsQQlGd8");
window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId      : Config.facebookId,
            cookie     : true, // enable cookies to allow Parse to access the session
            xfbml      : true,
            version    : 'v2.1'
    });

    Schema.config();

    Dispatcher.config({
        stores: [ Stores.CourseStore(), Stores.ExamStore(),
                  Stores.FieldStore(), Stores.PageStore(),
                  Stores.UserStore() ],

        preDispatchValidator: function (action, payload) {
            var result = Schema.validateAction(action, payload);
            if (result.valid || !result.hasSchema) {
                return null;
            }
            // Assuming there is an error at this point.
            // Report back the first validation error in the list.
            return Error("Action payload schema error for action " + action + ": " +
                         '"' + result.errors[0].message) + '".';
        }

    });

    View.register();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));
