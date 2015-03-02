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


	it("sets a base query to build other queries on.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3]);

		request.setBaseQuery(query);
		expect(request.getAllQuestions()).toEqual([1, 2, 3]);
	});

	it("adds queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3]);

		request.setBaseQuery(query);
		request.addQuery(query.filterEven);

		expect(request.getAllQuestions()).toEqual([2]);
	});

	it("adds queries with parameters.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.setBaseQuery(query);
		request.addQuery(query.filterNumbersGreaterThan, [3]);

		expect(request.getAllQuestions()).toEqual([4, 5]);
	});

	it("adds multiple queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.setBaseQuery(query);
		request.addQuery(query.filterNumbersGreaterThan, [ 2 ]);
		request.addQuery(query.filterEven);

		expect(request.getAllQuestions()).toEqual([ 4 ]);
	});

	it("removes queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.setBaseQuery(query);
		request.addQuery(query.filterEven);
		request.addQuery(query.filterNumbersGreaterThan, [ 3 ]);
		request.removeQuery(query.filterEven);

		expect(request.getAllQuestions()).toEqual([4, 5]);
	});

	it("adds queries using the name of a query instead of the query itself", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4]);

		request.setBaseQuery(query);
		request.addQuery("filterNumbersGreaterThan", [ 3 ]);

		expect(request.getAllQuestions()).toEqual([ 4 ]);
	});

	it("removes queries using the name of a query instead of the query itself", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4]);

		request.setBaseQuery(query);
		request.addQuery("filterNumbersGreaterThan", [ 3 ]);

		request.removeQuery("filterNumbersGreaterThan");

		expect(request.getAllQuestions()).toEqual([1, 2, 3, 4]);
	});


});