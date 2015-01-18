/**
 * routes.js
 *
 * List of all the routes to use.
 */

var 
    constants = require('./constants.js'),
    layout = require('./layout'),
    router = require('shore').Router;

module.exports = {

    /**
     * Configure the routes for the module. This method
     * assumes that the router for shore has already been configured.
     *
     * @method config
     */
    config: function () {

        // Add the routes.

        router.routes([
            {
                route: "/",
                action: constants.Action.LOAD_SPLASH,
                component: layout.splashLayout.Root
            },

            {
                // Note that you must extend the
                // payload to include a username
                // and password if you want to login
                // a user that is not already logged
                // into the app.
                route: "/home",
                action: constants.Action.LOGIN,
                component: layout.homeLayout.Root
            },

            {
                route: "/course/<courseId>",
                action: constants.Action.LOAD_COURSE,
                component: layout.courseLayout.Root
            },

            {
                route: "/course/<courseId>/exam/<examId>",
                action: constants.Action.LOAD_COURSE,
                component: layout.courseLayout.Root
            },

            {
                route: "/course/<courseId>/exam/<examId>/take",
                action: constants.Action.LOAD_EXAM_RUN,
                component: layout.examLayout.Root
            },

            {
                route: "/signup",
                action: constants.Action.SIGNUP,
                component: layout.notifyLayout.SignUpComplete
            },

            {
                route: '/resetpassword',
                component: layout.notifyLayout.ResetPassword
            }
        ]);

        // Add a default route.
        router.defaultRoute({
            action: constants.Action.LOAD_NOT_FOUND,
            component: layout.notifyLayout.PageNotFound
        });

        // Add all the error handling here.
        router.errors([
            {
                errorType: constants.ErrorType.NO_USER_CREDENTIALS,
                handler: function () {
                    console.log("No user credentials.");
                }
            },
            {
                errorType: constants.ErrorType.INVALID_EXAM_RUN,
                handler: router.ErrorOperation.pageNotFound
            }
        ]);

        router.defaultError(function () {
            console.log("Default error.");
        });

        // Start watching for routing changes.
        router.watch({ initialLoad: true });
    }

};
