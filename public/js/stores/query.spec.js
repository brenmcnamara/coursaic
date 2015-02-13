/**
 * query.spec.js
 */

var Query = require('./query.js');

describe("Query Object", function () {

    it("creates simple data pipes.", function () {

        var Ctor = Query.queryBuilder({

            filterEvenNumbers: function () {
                var data = this.pipe.data;

                return new Query.Pipe({
                    data: data.filter(function (val) {
                        return val % 2 === 0;
                    })
                });
            }

        }),

        query = new Ctor([1, 2, 3, 4]);

        expect(query.filterEvenNumbers().getAll()).toEqual([2, 4]);
    });

    it("allows fetching single objects.", function () {

        var Ctor = Query.queryBuilder({

            filterNumbersGreaterThan: function (number) {
                var data = this.pipe.data;

                return new Query.Pipe({
                    data: data.filter(function (val) {
                        return val > number;
                    })
                });
            }

        }),

        query = new Ctor([8, 12, 15, 17]);

        expect(query.filterNumbersGreaterThan(10).getOne()).toEqual(12);

    });

    it("chains together query calls.", function () {
        var Ctor = Query.queryBuilder({

            filterNumbersGreaterThan: function (number) {
                var data = this.pipe.data;
                return new Query.Pipe({
                    data: data.filter(function (val) {
                        return val > number;
                    })
                });
            },

            filterEvenNumbers: function () {
                var data = this.pipe.data;
                return new Query.Pipe({
                    data: data.filter(function (val) {
                        return val % 2 === 0;
                    })
                });
            }


        }),

        query = new Ctor([1, 2, 3, 9, 10, 11, 12 ,13, 14]);

        expect(query.filterNumbersGreaterThan(10).filterEvenNumbers().getAll()).toEqual([12, 14]);
    });

    it("maps objects in the query.", function () {
        var Ctor = Query.queryBuilder({ }),
            query = new Ctor([1, 2, 3, 4]),
            doubleValue = function (val) {
                return val * 2;
            };

        expect(query.map(doubleValue).getAll()).toEqual([2, 4, 6, 8]);
    });

});
