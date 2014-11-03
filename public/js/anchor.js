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
    var _serializeHash,

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
     */
        set;

    /* IMPLEMENTATION */

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


    set = function(addMap) {
        var currentMap = hashMap(), prop;
        for (prop in addMap) {
            if (addMap.hasOwnProperty(prop)) {
                currentMap[prop] = addMap[prop];
            }
        }
        window.location.hash = _serializeHash(currentMap); 
    };


    return {set: set, hashMap: hashMap};

}());

