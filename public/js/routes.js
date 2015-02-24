/**
 * routes.js
 *
 * List of all the routes to use.
 */

var 
    Constants = require('./constants.js'),
    Layout = require('./layout'),
    Router = require('shore').Router,
    Stores = require('./stores'),
    ErrorHandler = require('shore').ErrorHandler;

module.exports = {

    /**
     * Configure the routes for the module. This method
     * assumes that the router for shore has already been configured.
     *
     * @method config
     */
    config: function () {

        // Add the routes.

        Router.routes([
            {
                route: "/",
                action: Constants.Action.LOAD_SPLASH,
                component: Layout.splashLayout.Root,
            },

            {
                route: "/home",
                action: Constants.Action.LOAD_HOME,
                component: Layout.homeLayout.Root
            },

            {
                route: "/course/<courseId>",
                action: Constants.Action.LOAD_COURSE,
                component: Layout.courseLayout.Root
            },

            {
                route: "/exam",
                component: Layout.examLayout.Root
            },

            {
                route: "/result",
                component: Layout.resultLayout.Root
            },

            {
                route: "/signup",
                component: Layout.notifyLayout.SignUpComplete
            },

            {
                route: '/resetpassword',
                component: Layout.notifyLayout.ResetPassword
            },

            {
                route: '/resetpasswordemail',
                component: Layout.notifyLayout.ResetPasswordEmail
            }

        ]);

        // Add a default route.
        Router.defaultRoute({
            action: Constants.Action.LOAD_NOT_FOUND,
            component: Layout.notifyLayout.PageNotFound
        });

        Router.errors([
            ErrorHandler.Redirect({
                errorType: Constants.ErrorType.EXISTING_USER_CREDENTIALS,
                currentPath: '/',
                targetPath: '/home'
            })

        ]);

        // Start watching for routing changes.
        Router.watch({ initialLoad: true });
    }

};
