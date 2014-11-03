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
     * Set the url hash.
     *
     * @param key {String} The key to set the hash
     *  to.
     *
     * @param value {String} The value to set for the
     *  key.
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


    set = function(key, val) {
        var map = hashMap();
        map[key] = val;
        window.location.hash = _serializeHash(map); 
    };


    return {set: set, hashMap: hashMap};

}());

