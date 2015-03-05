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

		expect(request.getAllQuestions(query)).toEqual([1, 2, 3]);
	});

	it("adds queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3]);

		request.addQuery("filterEven");

		expect(request.getAllQuestions(query)).toEqual([2]);
	});

	it("adds queries with parameters.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.addQuery("filterNumbersGreaterThan", [3]);

		expect(request.getAllQuestions(query)).toEqual([4, 5]);
	});

	it("adds multiple queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.addQuery("filterNumbersGreaterThan", [ 2 ]);
		request.addQuery("filterEven");

		expect(request.getAllQuestions(query)).toEqual([ 4 ]);
	});

	it("removes queries.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4, 5]);

		request.addQuery("filterEven");
		request.addQuery("filterNumbersGreaterThan", [ 3 ]);
		request.removeQuery("filterEven");

		expect(request.getAllQuestions(query)).toEqual([4, 5]);
	});

	it("throws an error if running a query with an unrecognized propogator.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4]),

			getAllQuestions = function () {
				request.getAllQuestion(query);
			};

		request.addQuery("this is nonsense");

		expect(getAllQuestions).toThrow();
	});

	it("throws an error if trying to add a query that is not of type string.", function () {
		var request = CreateExamRun(),
			query = new QueryConstructor([1, 2, 3, 4]),
			addQuery = function () {
				request.addQuery(1);
			};

		expect(addQuery).toThrow();

	});


});