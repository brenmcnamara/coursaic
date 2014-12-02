/**
 * anchor.js
 */

/**
 * A module that keeps track of the
 * url hash for the page, performing
 * hash queries and hash updates.
 */
var Anchor = (function() {

    /* DECLARATION */

    
    var 

    /**
     * Check if an object is a subset of another object.
     *
     * @method _isSubset
     * @private
     *
     * @param subset {Object} The subset to check.
     * @param superset {Object} The superset to check.
     *
     * @return {Boolean} true if the superset is
     *  an actual superset of the object.
     */
        _isSubset,

    /**
     * Convert a hash object into a string
     * that can be inserted into the url hash.
     *
     * @method _serializeHash
     * @private
     *
     * @param hashMap {Object} A set of key/value pairs
     *  representing the hash values.
     *
     * @return {String} A new hash encoded from the hashMap.
     */
        _serializeHash,

    /**
     * Convert a string hash into a hashMap.
     *
     * @method _parseHash
     * @private
     *
     * @param hash {String} The string hash.
     *
     * @return {Object} A hash map of key-value pairs.
     */
        _parseHash,
    /**
     * Get the url hash.
     *
     * @method hashMap
     *
     * @return {Object} The url hash as
     *  key/value pairs.
     */
        hashMap,

    /**
     * Set the url hash with new properties from
     * another map.
     *
     * @param addMap {Object} A set of key/value pairs
     *  containing all the properties to add to
     *  the hash map.
     *
     * @param options {Object} A map of options to use
     *  when setting the hash.
     */
        set,

    /**
     * Unset the url hash properties that are
     * specified in the list of keys.
     *
     * @param keys {Array} An array of strings
     * that are the properties to remove from
     * the url hash. 
     *
     * @param options {Object} An object containing
     * all the options for modifying the hash.
     */
        unset,

    /**
     * Listen for the hash to change.
     *
     * @method onChange
     *
     * @param callback {Function} A callback
     *  function that is called when the
     *  hash changes.
     */
        onChange,

    /**
     * Contains all the state for this module.
     *
     * @property stateMap 
     * @type Object
     */
        stateMap = {
            // The current hash that is known.
            // This is to check for hash change
            // events.
            currentHash: window.location.hash,

            // When this flag is set to true, the
            // onChange event is not called for the next
            // hash change. This flag will be automatically
            // set back to false after the hash change has
            // occurred.
            silent: false   
        };

    /* IMPLEMENTATION */

    _isSubset = function(subset, superset) {
        var prop;
        // Check that all properties of the subset are
        // part of the superset.
        for (prop in subset) {
            if (subset.hasOwnProperty(prop)) {
                // NOTE: This check only intended for
                // shallow objects that contain a set
                // of strings.
                // Check if any elements in object are not equal.
                if (subset[prop] !== superset[prop]) {
                    return false;
                }
            }
        }
        return true;
    };


    _serializeHash = function(hashMap) {
        var prop, hashArr = [];
        for (prop in hashMap) {
            if (hashMap.hasOwnProperty(prop)) {
                hashArr.push(prop + "=" + hashMap[prop]);
            }
        }
        return (hashArr.length) ? ("#" + hashArr.join("&")) : "";
    };


    _parseHash = function(hash) {
        // Assumes that hash is in the correct format.
        if (hash && hash !== "" && hash !== "#") {
            return hash.substr(1, hash.length - 1)
                       .split("&")
                       .reduce(function(memo, pair) {
                            var breakPair = pair.split("=");
                            memo[breakPair[0]] = breakPair[1];
                            return memo;
                       }, {});
        }
        return {};
    };


    hashMap = function() {
        var hash = window.location.hash;
        return _parseHash(hash);
    };


    // TODO: Modify _serializeHash so that
    // the order the hash elements appear is deterministic
    // and we do not need to check for changes in set and unset
    // methods.
    set = function(addMap, options) {
        var hash,
            prop,
            currentMap = hashMap();

        // Check if what is being added is a subset
        // of the current map.
        // This is because the stateMap.silent
        // property should not be modified
        // if the hash is not going to change
        // anything.
        if (!_isSubset(addMap, currentMap)) {
            options = options || { silent: false };
            stateMap.silent = options.silent || false;

            for (prop in addMap) {
                if (addMap.hasOwnProperty(prop)) {
                    currentMap[prop] = addMap[prop];
                }
            }
            hash = _serializeHash(currentMap);
            window.location.hash = hash; 
        }
    };


    unset = function(keys, options) {
        var hash, prop, currentMap = hashMap(),
            // Check if any of the keys that are being
            // removed actually exist in the hash. Change
            // should not be triggered if no changes are actually
            // made
            isRemovingKeys = keys.reduce(function(memo, key) {
                return memo || !!currentMap[key];
            }, false);

        if (isRemovingKeys) {
            options = options || { silent: false };
            stateMap.silent = options.silent || false;

            keys.forEach(function(key) {
                delete currentMap[key];
            });
            hash = _serializeHash(currentMap);
            window.location.hash = hash;
        }
    };


    onChange = function(callback) {
        if (typeof callback !== 'function') {
            throw new Error("Must provide a function callback for hash changes.");
        }

        setInterval(function() {
            var hash = window.location.hash;
            if (hash !== stateMap.currentHash) {
                stateMap.currentHash = hash;
                if (stateMap.silent) {
                    stateMap.silent = false;
                }
                else {
                    callback(_parseHash(hash));
                }
            }
        }, 150);
    };


    return {set: set, unset: unset, hashMap: hashMap, onChange: onChange};

}());

