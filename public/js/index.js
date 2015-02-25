
var shore = require('shore'),
    Stores = require('./stores'),
    routes = require('./routes.js');

Parse.initialize(Env.parseAppId, Env.parseJavascriptId);

window.onload = function () {
    shore.config({
        
        dispatcher: {
            stores: [Stores.CourseStore(), Stores.QuestionStore(),
                     Stores.PageStore(), Stores.UserStore(), Stores.TopicStore() ]
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

    routes.config();

};
    