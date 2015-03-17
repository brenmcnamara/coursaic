/**
 * query.js
 */


var 

    Util = require('shore').Util,
    
    _Query,
    _generateQueryMethod,
    createQuery;


Pipe = function (inputMap) {
    this.data = inputMap.data;
};

_Query = function () {

};

_Query.prototype.isEqual = function (obj1, obj2) {
    return obj1 === obj2;
};

_Query.prototype.map = function (callback) {
    var data = this.pipe.data;
    this.pipe.data = data.map(callback);

    return this;
};

// Below are the query api's that should always
// the last element in the chain.

_Query.prototype.getOne = function () {
    return this.pipe.data[0] || null;
};


_Query.prototype.getAll = function () {
    return this.pipe.data;
};

_Query.prototype.getSlice = function () {
    return this.pipe.data.slice.apply(this.pipe.data, arguments);
};

// NOTE: Implement the method isEqual() to
// add custom equality checks. Otherwise, this
// will use ===.
_Query.prototype.contains = function (obj) {
    var data = this.pipe.data;
    return data.reduce(function (hasObject, iterObj) {
        return hasObject || this.isEqual(obj, iterObj);
    }.bind(this), false);
};

/**
 * Generate a query method that can be added to the
 * query object.
 */
_generateQueryMethod = function (Ctor, extendMap, prop) {
    return function () {
        // Create a new Query.
        var newPipe = extendMap[prop].apply(this, arguments);
        return new Ctor(newPipe.data);
    };
};

/**
 * Create a query object constructor that can be used
 * to generate queries for arrays of data.
 *
 * @method queryBuilder
 *
 * @param extendMap { Object } A map of methods
 *  and properties to add to the query object.
 */
queryBuilder = function (extendMap) {
    var prop,
        Subclass = function (data) {
            this.pipe = new Pipe({ data: data });
        };

    Subclass.prototype = new _Query();

    // Check for any overrided methods.
    // Add overrided methods without tweeking them.
    if (extendMap.isEqual) {
        Subclass.prototype.isEqual = extendMap.isEqual;
        delete extendMap.isEqual;
    }

    for (prop in extendMap) {
        if (extendMap.hasOwnProperty(prop)) {
            if (typeof extendMap[prop] === 'function') {
                // Create a function wrapper that handled the context
                // switching and chaining.
                Subclass.prototype[prop] = _generateQueryMethod(Subclass, extendMap, prop);
            }
            else {
                Subclass.prototype[prop] = extendMap[prop];
            }
        }
    }

    return Subclass;
};

module.exports = {
    Pipe: Pipe,
    queryBuilder: queryBuilder
};
