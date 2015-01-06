/**
 * router.js
 */

var
    Util = require('./util.js'),
    Action = require('./Action.js').Action,
    Constants = require('./constants.js'),
    Path = require('./path.js'),


    emitter = new (require('events').EventEmitter)(),

    stateMap = {

        // The location object to get the
        // most updated hash.
        location: null,

        // The id of the callback that is being monitored
        // by set interval.
        watchId: null,

        // An array of error handler objects used to map
        // an error to a single handler.
        errorHandlers: [],

        // The default error handler function.
        defaultErrorHandler: null,

        // A pattern matcher used to resolve routes to
        // actions.
        directory: null,

        // The action that is called when routing has failed.
        defaultAction: null

    },


    /**
     * Save the hash to a new value that is passed in.
     * This method should only be called AFTER the
     * stateMap.location property has been set.
     *
     * @method syncHash
     * @private
     *
     * @param hash {String} The hash to sync with
     *  the location object.
     */
    syncHash = function (hash) {
        stateMap.location.hash = hash;
    },


    /**
     * Get the hash and modify it so it is readable by the Router.
     * This is the hash from the location object. This method should
     * only be called AFTER the stateMap.location property has
     * been set.
     *
     * @method getHash
     * @private
     *
     * @return {String} The hash value.
     */
    getHash = function () {
        var rawHash = stateMap.location.hash;
        if (rawHash.length === 0) {
            return "/";
        }
        else if (rawHash.length === 1 && rawHash.charAt(0) === "#") {
            return "/";
        }
        else if (rawHash.charAt(0) === "#") {
            return rawHash.substr(1, rawHash.length - 1);
        }
        else {
            return rawHash;
        }
    },


    /**
     * Route the page to the current path.
     *
     * @method route
     * @private
     */
    route = function () {
        if (!stateMap.directory.resolve()) {
            if (stateMap.defaultAction) {
                Action.send(stateMap.defaultAction, { path: stateMap.directory.path() })
                    .then(
                        // Success.
                        function () {
                            emitter.emit(Constants.Event.PAGE_NOT_FOUND);
                        },
                        // Failure.
                        function (error) {
                            // Routing failed.
                            console.error(error);
                            if (!error.type) {
                                stateMap.defaultErrorHandler();
                            }

                            var i, n;
                            for (i = 0, n = stateMap.errorHandlers.length; i < n; ++i) {
                                if (stateMap.errorHandlers[i].errorType === error.type) {
                                    stateMap.errorHandlers[i].handler();
                                    return;
                                }
                            }
                        });
            }
        }
    },


    /**
     * Configure the router so that it is ready
     * for use.
     */
    config = function (options) {
        var hash;

        stateMap.location = options.location;
        
        hash = getHash();

        stateMap.directory = Path.createPatternMatcher(hash);
        stateMap.directory.config({ allowPartialMatch: false });
    },


    /**
     * Begin watching for changes to the
     * hash.
     *
     * @method watch
     *
     * @param options {Object} Any options that
     *  go into configuring the watch call. This parameter
     *  is not optional and must be provided.
     *
     * @throw Error if watch has already been called with being
     *  unwatched.
     */
    watch = function (options) {
        if (stateMap.watchId) {
            throw new Error("Router is already watching hash.");
        }

        stateMap.watchId = setInterval(function () {
            var currentPath = getHash(),
                savedPath = stateMap.directory.path();

            if (currentPath !== savedPath) {
                stateMap.directory.path(currentPath);
                route();
            }
        }, 150);


        // Check if we send an initial action.
        if (options.initialLoad) {
            route();
        }
    },


    /**
     * Stop watching for changes to the hash.
     *
     * @method unwatch
     */
    unwatch = function () {
        clearInterval(stateMap.watchId);
        stateMap.location = null;
    },


    /**
     * Match arguments with the current path.
     *
     * @method matchArguments
     *
     * @param pattern {String} The pattern to resolve
     *  the variable names with.
     *
     * @return {Object} An object containing all the resolved
     *  variables in the pattern.
     */
    matchArguments = function (pattern) {
        return Path.matchArguments(pattern, stateMap.directory.path());
    },


    /**
     * Get and set the path of the router. Setting the path
     * will cause an action to trigger.
     *
     * @method path
     *
     * @param pattern {String} The pattern used to set the
     *  path. This parameter is optional. If no parameters
     *  are provided, the method call is treated as a getter.
     *  If an argMap is provided as a second parameter, this
     *  pattern will be combined with the argMap to form a
     *  path. Otherwise, the pattern will be set to the path
     *  directly.
     *
     * @param argMap {Object} An object to resolve variables
     *  in the pattern. Used to set the path.
     */
    path = function () {
        var path;

        switch (arguments.length) {
            
        case 0:
            // Treat this method call as a getter.
            return stateMap.directory.path();
        case 1:
            // Treat this as a setter.
            syncHash(arguments[0]);
            break;
        default:
            // Assume 2 parameters.
            syncHash(Util.patternToString(arguments[0], arguments[1]));
        }
    },


    /**
     * Register a route to watch for that will trigger a specified
     * action. The action that is dispatched on the pattern will
     * be given a payload containing all the resolved variables
     * in the pattern, and the current path (key name "path").
     *
     * @method registerRoute
     *
     * @param pattern {String} The pattern to match against
     *  the route.
     *
     * @param action {Action.Name} The name of the action to
     *  execute when the pattern has been achieved.
     */
    registerRoute = function (pattern, action) {
        stateMap.directory.forCase(pattern, function (argMap) {
            var path = stateMap.directory.path();
            Action.send(action, Util.extend(argMap, { path: path }))
                .then(
                    // Success.
                    function () {
                        emitter.emit(Constants.Event.LOADED_PAGE);
                    },
                    // Error.
                    function (error) {
                        // TODO: This code exists in 2 places. Abstract
                        // out to a function.
                        console.error(error);
                        if (!error.type) {
                            stateMap.defaultErrorHandler();
                        }

                        var i, n;
                        for (i = 0, n = stateMap.errorHandlers.length; i < n; ++i) {
                            if (stateMap.errorHandlers[i].errorType === error.type) {
                                stateMap.errorHandlers[i].handler();
                                return;
                            }
                        }

                    });

            return true;
        });
    },


    /**
     * Register an action for a default route. This action is sent
     * if the current route is not handled by any other. This is
     * optional, no action is required for bad routes.
     *
     * @method registerDefaultRoute
     *
     * @param action {Action.Name} The action that is sent when
     *  the route has failed. This action is given a payload containing
     *  the path that was attempted (key = "path").
     */
    registerDefaultRoute = function (action) {
        stateMap.defaultAction = action;
    },


    /**
     * Register an error with the router and a handler to handle
     * the error. If multiple errors appear, only the first error
     * will be triggered.
     *
     * @method registerError
     *
     * @param errorType {String} The error to register.
     *
     * @param handler {Function} The handler for the error
     *  when it appears.
     */
    registerError = function (errorType, handler) {
        stateMap.errorHandlers.push({errorType: errorType, handler: handler });
    },


    /**
     * Register an error handler for any errors that do not
     * have a type listed.
     *
     * @method registerDefaultError
     *
     * @param handler {Function} The handler to call when a
     *  default error is detected.
     */
    registerDefaultError = function (handler) {
        stateMap.defaultErrorHandler = handler;
    },


    /**
     * Add a callback to an event that is called
     * by the Router.
     *
     * @method on
     *
     * @param event {String} The event to listen for.
     *
     * @param callback {Function} The function to execute
     *  when the event is called.
     */
    on = emitter.on.bind(emitter),


     /**
      * Remove a callback from an event that is called
      * by the Router.
      *
      * @method removeListener
      *
      * @param event {String} The event to remove the
      *  callback function from.
      *
      * @param callback {Function} The callback to remove.
      */
    removeListener = emitter.removeListener.bind(emitter);


module.exports = {

    registerDefaultRoute: registerDefaultRoute,
    registerRoute: registerRoute,
    registerError: registerError,
    registerDefaultError: registerDefaultError,
    path: path,
    on: on,
    removeListener: removeListener,
    matchArguments: matchArguments,
    watch: watch,
    unwatch: unwatch,
    config: config
};
