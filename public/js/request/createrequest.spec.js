/**
 * createrequest.spec.js
 *
 * Tests functionality from createrequest.js
 */

var Query = require('../stores/query'),

	CreateExamRun = require('./createrequest.js').ExamRun,

	CreateExamSubmission = require('./createrequest.js').ExamSubmission;

describe("Create Exam Submission Request", function () {

	// NOTE: Not testing getSolutionAtIndex and not testing
	// the getQuestionCount

	it("constructs an exam submission with the correct number of questions.", function () {
		var submission = CreateExamSubmission({ numOfQuestions: 2 });

		expect(submission.getQuestionCount()).toBe(2);
	});

	it("sets a solution for a particular index.", function () {
		var submission = CreateExamSubmission({ numOfQuestions: 1 });

		expect(submission.getSolutionAtIndex(0)).toBe(null);
		submission.setSolutionAtIndex("blah", 0);
		expect(submission.getSolutionAtIndex(0)).toBe("blah");
	});

	it("removes an index from the submission.", function () {
		var submission = CreateExamSubmission({ numOfQuestions: 2 });

		submission.setSolutionAtIndex("first", 0);
		submission.setSolutionAtIndex("second", 1);
		submission.removeIndex(0);

		expect(submission.getQuestionCount()).toBe(1);
		expect(submission.getSolutionAtIndex(0)).toBe("second");

	});

	it("clears the solution at a particular index.", function () {
		var submission = CreateExamSubmission({ numOfQuestions: 2 });

		submission.setSolutionAtIndex("first", 0);
		submission.clearIndex(0);

		expect(submission.getSolutionAtIndex(0)).toBe(null);
		expect(submission.getQuestionCount()).toBe(2);
	});

	it("iterates submissions.", function () {
		var submission = CreateExamSubmission({ numOfQuestions: 3 }),
			iterationCount = 0;

		submission.setSolutionAtIndex("first", 0);
		submission.setSolutionAtIndex("second", 1);

		submission.forEach(function (solution, index) {
			++iterationCount;
			switch (index) {

			case 0:
				expect(solution).toBe("first");
				break;
			case 1:
				expect(solution).toBe("second");
				break;
			case 2:
				expect(solution).toBe(null);
				break;
			default:
				throw Error("Iterating index that does not exist.");
			}
		});

		expect(iterationCount).toBe(3);

	});



});

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
