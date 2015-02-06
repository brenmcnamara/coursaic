/**
 * query.spec.js
 */

var Query = require('./query.js');

describe("Query Object", function () {

    it("should generate a simple filter query.", function () {

        var filterByEvens = Query.createQuery(function (data) {
            return data.filter(function (val) {
                return val % 2 === 0;
            });
        }),

            process = filterByEvens();

        expect(process([1, 2, 3])).toEqual([2]);
    });


    it("should generate a filter that takes parameters.", function () {

        var filterBetweenValues = Query.createQuery(function (data) {
            var lowerBound = this.params[0],
                upperBound = this.params[1];

            return data.filter(function (val) {
                return val >= lowerBound && val <= upperBound;
            });
        }),

            process = filterBetweenValues(1, 10);

        expect(process([-5, -2, 1, 4, 7, 11])).toEqual([1, 4, 7]);
    });

});
