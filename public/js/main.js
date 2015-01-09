
var Dispatcher = require('shore').Dispatcher,
    Stores = require('./stores'),
    Validator = require('./validator.js'),
    routes = require('./routes.js');

Parse.initialize("4mcPYbWGU0hIVcVCW5XKMgY5Gtr7UuPlRZkPnWj1", "Bl2qeQ6LdbhLpgi8B2a7nCpeITBs8QBeDsQQlGd8");
window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId      : Config.facebookId,
            cookie     : true, // enable cookies to allow Parse to access the session
            xfbml      : true,
            version    : 'v2.1'
    });

    Validator.config();

    Dispatcher.config({
        stores: [ Stores.CourseStore(), Stores.ExamStore(),
                  Stores.FieldStore(), Stores.PageStore(),
                  Stores.UserStore() ],

        preDispatchValidator: function (action, payload) {

            // Make sure that the schema of the payload is valid.
            var result = Validator.validate(action, payload);
            if (result.valid || !result.hasSchema) {
                return null;
            }
            // Assuming there is an error at this point.
            // Report back the first validation error in the list.
            error = Error("Action payload error for action " + action + ": " +
                          '"' + result.errors[0].message) + '".';
            error.type = result.errors[0].type;
            return result.errors[0];
        }

    });

    routes.config();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));
