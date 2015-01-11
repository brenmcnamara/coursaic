
var shore = require('shore'),
    Stores = require('./stores'),
    validator = require('./validator.js'),
    routes = require('./routes.js');

Parse.initialize(Env.parseAppId, Env.parseJavascriptId);

window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId      : Env.facebookId,
            cookie     : true, // enable cookies to allow Parse to access the session
            xfbml      : true,
            version    : 'v2.1'
    });

    shore.config({
        
        dispatcher: {
            stores: [Stores.CourseStore(), Stores.ExamStore(),
                     Stores.FieldStore(), Stores.PageStore(),
                     Stores.UserStore()],

            // Validator that gets called before the action
            // is propogated through the stores. This assumes that
            // the Validator module has already been configured.
            preDispatchValidator: function (action, payload) {
                // Make sure that the schema of the payload is valid.
                var result = validator.validate(action, payload);
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
        },

        logger: {
            // Only log if in development environment.
            outputs: ((Env.NODE_ENV === 'development') ? [ console ] : [ ])
        },

        router: {
            // Give the location to look for the hash when checking for
            // changes.
            location: window.location
        }

    });

    validator.config();

    routes.config();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));
