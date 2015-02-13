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

_Query.prototype.map = function (callback) {
    var data = this.pipe.data;
    this.pipe.data = data.map(callback);

    return this;
};

_Query.prototype.getOne = function () {
    return this.pipe.data[0] || null;
};


_Query.prototype.getAll = function () {
    return this.pipe.data;
};

/**
 * Generate a query method that can be added to the
 * query object.
 */
_generateQueryMethod = function (extendMap, prop) {
    return function () {
        var newPipe = extendMap[prop].apply(this, arguments);
        this.pipe = newPipe;
        return this;
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

    for (prop in extendMap) {
        if (extendMap.hasOwnProperty(prop)) {
            if (typeof extendMap[prop] === 'function') {
                // Create a function wrapper that handled the context
                // switching and chaining.
                Subclass.prototype[prop] = _generateQueryMethod(extendMap, prop);
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
