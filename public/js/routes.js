/**
 * routes.js
 *
 * List of all the routes to use.
 */

var 
    Constants = require('./constants.js'),
    Layout = require('./layout'),
    Router = require('shore').Router,
    Stores = require('./stores');

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
                component: Layout.splashLayout.Root,
                preRouteCheck: function (request) {
                    var UserStore = Stores.UserStore();

                    if (request.getAction() !== Constants.Action.LOGOUT &&
                        UserStore.query().currentUser().getOne()) {
                        // Redirect to the home page if the
                        // user is already logged in.
                        request.redirect("/home");
                    }
                }
            },

            {
                // Note that you must extend the
                // payload to include a username
                // and password if you want to login
                // a user that is not already logged
                // into the app.
                route: "/home",
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

        // Start watching for routing changes.
        Router.watch({ initialLoad: true });
    }

};
