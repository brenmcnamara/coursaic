/**
 * router.js
 */

var 
    Util = require('./util.js'),

    pathRegExp = /^(\/[^_\(\)<>\[\]]*)+$/,

    idRegExp = /[A-Za-z\d]{10}/,

    idArgumentRegExp = /<[A-Za-z][A-Za-z\d]*>/,

    emptyArgumentRegExp = /<_>/,

    customEmptyArgumentRegExp = /<_:\([^<>\(\)]+\)>/,

    argumentNameRegExp = /[A-Za-z][A-Za-z\d]*/,

    customArgumentRegExp = /<[A-Za-z][A-Za-z\d]*:\([^<>\(\)]+\)>/,

    argumentMatcherRegExp = /\([^<>\(\)]+\)/,
    
    stateMap = {

        // The current path for the page.
        path: '/'

    },


    createPatternMatcher = function () {
        return new PatternMatcher(stateMap.path);
    },


    /**
     * Get the current path of the router.
     *
     * @method getPath
     * @return {String} The current path of the router.
     */
    getPath = function () {
        return stateMap.path;
    },


    /**
     * Set the path of the router.
     *
     * @method setPath
     * @param path {String} The new path for the router.
     */
    setPath = function (path) {
        stateMap.path = path;
    },


    /**
     * True if the given path is valid.
     *
     * @method isValidPath
     * @param path {String} The path to check for validity.
     */
    isValidPath = function (path) {
        return pathRegExp.test(path);
    },


    /**
     * Perform pattern matching on the arguments
     * and get an object containing all the matched
     * patterns.
     *
     * @method matchArguments
     * @param pattern {String} The pattern to match
     *  the current path against.
     *
     * @return {Object} An argument map of all the matched
     *  patterns.
     */
    matchArguments = function (pattern) {
        var matcher = createPatternMatcher();
        matcher.config({ defaultResolveValue: {} });
        matcher.forCase(pattern, function (argMap) {
            return argMap;
        });
        return matcher.resolve();
    },

    /**
     * An object that matches against path
     * patterns.
     *
     * @class PatternMatcher
     * @constructor
     * @param path {String} The path to match against.
     */
    PatternMatcher = function (path) {
        this._path = path;
        // Set the default options.
        this._options = {
            allowPartialMatch: true,
            defaultResolveValue: null,
            shortCircuit: true
        };

        this._cases = [];
    };


/**
 * Configure the PatternMatcher with pre-defined options.
 *
 * @method config
 * @param optionsMap {Object} A set of options to configure
 *  the pattern matcher for.
 */
PatternMatcher.prototype.config = function (optionsMap) {
    this._options = Util.extend(optionsMap, this._options);
};


/**
 * Check the path against the pattern for a particular case.
 *
 * @method forCase
 * @param pattern {String} A string pattern to match against
 *  the path.
 *
 * @param callback {Function} A callback function that gets executed
 *  if the case has passed. The callback will receive a single argument
 *  containing any resolved variable names during matching.
 */
PatternMatcher.prototype.forCase = function (pattern, callback) {
    this._cases.push({ sections: pattern.split('/'), callback: callback });
};


/**
 * Perform the pattern matching and iterate through the
 * the cases.
 *
 * @method resolve
 * @return {Object} The return value of the successful case.
 */
PatternMatcher.prototype.resolve = function () {
    var i, n,
        j, m,
        pathSections = stateMap.path.split('/'),
        nextCase,
        caseSection,
        pathSection,
        didAllSectionsMatch,
        argMap = {},
        // This property is only used when the shortCircuit option
        // is turned off.
        allResolves = [];

    for (i = 0, n = this._cases.length; i < n; ++i) {
        nextCase = this._cases[i];
        m = nextCase.sections.length;

        if ((this._options.allowPartialMatch && m <= pathSections.length) ||
            m === pathSections.length) {
            // The number of sections in this case makes it possible that
            // the case will match the path. Needs more investigation.

            // Assume that all path and case sections match one another
            // until finding a pair that do not match.
            didAllSectionsMatch = true;
            for (j = 0; j < m && didAllSectionsMatch; ++j) {
                // Check if the case section matches the path section
                // in any way.
                caseSection = nextCase.sections[j];
                pathSection = pathSections[j];
                // Check if the case section is pattern matching for an
                // object id and the path section is an object id.
                if (idArgumentRegExp.test(caseSection) && idRegExp.test(pathSection)) {
                    // Resolve the id.
                    argMap[caseSection.match(argumentNameRegExp)[0]] = pathSection;
                }
                // Check if the case secion is pattern matching for
                // a custom section definition using a custom matcher.
                
                else if (customArgumentRegExp.test(caseSection) &&
                         RegExp(caseSection.match(argumentMatcherRegExp)[0]).test(pathSection)) {
                    // Resolve the case section.
                    argMap[caseSection.match(argumentNameRegExp)[0]] = pathSection;
                }

                // Check the remaining cases here. These are all the cases that do not
                // result in argument being generated to the argument map, but all these
                // cases indicate a valid match.
                else if (
                    // Empty argument indicates that the path section could be an object id.
                    !(emptyArgumentRegExp.test(caseSection) && idRegExp.test(pathSection)) &&
                    // Empty argument with a custom matcher.
                    !( customEmptyArgumentRegExp.test(caseSection) &&
                       RegExp(caseSection.match(argumentMatcherRegExp)[0]).test(pathSection)) &&
                    // The path section is literally the same as the case section.
                    pathSection !== caseSection) {

                    // There is no available matching.
                    didAllSectionsMatch = false;
                }

            }

            if (didAllSectionsMatch) {
                // All case and path sections matched.
                // Execute the callback for the matching case,
                // passing it the arguments that were resolved
                // during the matching.
                if (this._options.shortCircuit) {
                    // Short-circuit the pattern matching
                    // and stop looking for case statements
                    // after the first one was found.
                    return nextCase.callback(argMap);
                }
                else {
                    // If not short-circuiting, then add the
                    // result of this case statement to the
                    // array and continue looking for
                    // more matches.
                    allResolves.push(nextCase.callback(argMap));
                }

            }
        }
    }
    // No cases match.
    if (this._options.shortCircuit) {
        return this._options.defaultResolveValue;
    }
    else {
        return allResolves;
    }

};


module.exports = {
    createPatternMatcher: createPatternMatcher,
    getPath: getPath,
    setPath: setPath,
    isValidPath: isValidPath,
    matchArguments: matchArguments
};
