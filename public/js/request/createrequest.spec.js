/**
 * createrequest.spec.js
 *
 * Tests functionality from createrequest.js
 */

var Query = require('../stores/query'),
	CreateExamRun = require('./createrequest.js').ExamRun;

describe("Create ExamRun Request", function () {

	var QueryConstructor;

	beforeEach(function () {
		QueryConstructor = Query.queryBuilder({
			filterEven: function () {
				return new Query.Pipe({
					data: this.pipe.data.filter(function (val) {
						return val % 2 === 0;
					})
				});
			},

			filterNumbersGreaterThan: function (val) {
				return new Query.Pipe({
					data: this.pipe.data.filter(function (innerVal) {
						return innerVal > val;
					})
				});
			}

		});
	});


	it("should allow setting a query.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3]);

		request.setQuery(query);
		expect(request.getAllQuestions()).toEqual([1, 2, 3]);
	});

	it("should allow adding queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3]);

		request.setQuery(query);
		request.addQuery(query.filterEven);

		expect(request.getAllQuestions()).toEqual([2]);
	});

	it("should allow adding queries with parameters.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.setQuery(query);
		request.addQuery(query.filterNumbersGreaterThan, [3]);

		expect(request.getAllQuestions()).toEqual([4, 5]);
	});

	it("should allow adding multiple queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.setQuery(query);
		request.addQuery(query.filterNumbersGreaterThan, [ 2 ]);
		request.addQuery(query.filterEven);

		expect(request.getAllQuestions()).toEqual([ 4 ]);
	});

});