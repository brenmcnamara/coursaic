
var shore = require('shore'),
    Stores = require('./stores'),
    routes = require('./routes.js');

Parse.initialize(Env.parseAppId, Env.parseJavascriptId);

window.onload = function () {
    shore.config({
        
        dispatcher: {
            stores: [Stores.CourseStore(), Stores.QuestionStore(), Stores.ExamRunStore(),
                     Stores.PageStore(), Stores.UserStore(), Stores.TopicStore(),
                     Stores.FlagStore() ]
        },

        logger: {
            // Only log if in development environment.
            outputs: ((Env.NODE_ENV === 'development') ? [ console ] : [ ])
        },

        router: {
            window: window,
            root: document.getElementsByTagName('body')[0]
        }

    });

    routes.config();

};
    