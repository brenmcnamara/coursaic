/**
 * query.js
 */


var

    /**
     * Generate a query operation. A query operation
     * is one that takes an array and creates a new
     * array after the array has been processed
     * by the queryFunction.
     *
     * @method createQuery
     *
     * @param queryFunction {Function} A function
     *  that takes an array and returns a new array.
     */
    createQuery = function (queryFunction) {

        return function () {

            var params = arguments;

            return function (data) {
                return queryFunction.call({params: params }, data.slice());
            };

        };

    };

module.exports = {

    createQuery: createQuery

};