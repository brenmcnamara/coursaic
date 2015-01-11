/**
 * routes.js
 *
 * List of all the routes to use.
 */

var 
    constants = require('./constants.js'),
    
    layout = require('./layout'),

    react = require('react'),

    matcher = require('shore').Matcher,
    router = require('shore').Router,

    defaultRoute = {
        action: constants.Action.LOAD_NOT_FOUND,
        component: layout.errorPage.Root
    },

    routes = [
        {
            route: "/",
            action: constants.Action.LOAD_HOME,
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
        }
    ],

    layoutMatcher = matcher.createPatternMatcher(),

    onLoadedPage = function () {
        var component;
        // Update the path of the layout matcher.
        layoutMatcher.path(router.path());

        if (!layoutMatcher.resolve()) {
            // Could not find any routes.
            component = react.createFactory(defaultRoute.component);
            react.render(component());
        }
    },

    onPageNotFound = function () {
        var component = react.createFactory(defaultRoute.component);
        react.render(component());
    };


module.exports = {

    /**
     * Configure the routes for the module. This method
     * assumes that the router for shore has already been configured.
     *
     * @method config
     */
    config: function () {

        // TODO: Remove any listeners if there are any that already exist.
        router.on(constants.Event.LOADED_PAGE, onLoadedPage);
        router.on(constants.Event.PAGE_NOT_FOUND, onPageNotFound);

        // Configure the layout matcher.
        layoutMatcher.config({ allowPartialMatch: false });

        // Add the routes from the routes array.
        routes.forEach(function (routeMap) {
            if (routeMap.action) {
                router.registerRoute(routeMap.route, routeMap.action);
            }

            if (routeMap.component) {
                layoutMatcher.forCase(routeMap.route, function (argMap) {
                    var component = react.createFactory(routeMap.component);
                    react.render(component(argMap),
                                 document.getElementsByTagName('body')[0]);
                    return true;
                });
            }

        });

        // Add a default route.
        router.registerDefaultRoute(defaultRoute.action);

        // Add all the error handling here.

        router.registerError(constants.ErrorType.NO_USER_CREDENTIALS, function () {
            console.log("No user credentials.");
        });

        router.registerError(constants.ErrorType.INVALID_EXAM_RUN, router.ErrorOperation.pageNotFound);

        router.registerDefaultError(function () {
            console.log("Default error.");
        });

        // Start watching for routing changes.
        router.watch({ initialLoad: true });
    }

};
