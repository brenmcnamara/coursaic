/**
 * changerequest.spec.js
 */

var ChangeRequest = require('./changerequest.js');

describe("MultiChoice change request", function () {

	var question;

	beforeEach(function () {
		question = {
			attributes: {
				ask: "What is 2 + 2?",
				solution: "4",
				explanation: "Just because!",
				options: '["3", "4", "5", "6"]',
				topic: { id: 1 }
			},

			get: function (key) {
				return question.attributes[key];
			}

		};
	});

	it("updates the solution of a question.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setSolutionToIndex(0);
		expect(Request.get('solution')).toBe('3');
	});

	it("updates the text for an option.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(2, '16');
		expect(JSON.parse(Request.get('options'))).toEqual(['3', '4', '16', '6']);
	});

	it("updates the option and solution when setting changing the correct option.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(1, '12');
		expect(JSON.parse(Request.get('options'))).toEqual(['3', '12', '5', '6']);
		expect(Request.get('solution')).toBe('12');
	});

	it("validates a question if an option is changed to a legal value.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(0, "17");
		expect(Request.isValid()).toBeTruthy();
	});

	it("validates a question if the solution is changed to a legal value.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setSolutionToIndex(2);
		expect(Request.isValid()).toBeTruthy();
	});

	it("invalidates a question if there are multiple options that are identical.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(0, '4');
		expect(Request.isValid()).toBeFalsy();
	});

	it("invalidates a question if there are multiple options that are identical after trimming whitespace.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(0 , '4   ');
		expect(Request.isValid()).toBeFalsy();
	});

	it("invalidates a question if setting an option to the empty string.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(1, "");
		expect(Request.isValid()).toBeFalsy();
	});

	it("invalidates a question if setting an option to only contain whitespace.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		Request.setOptionAtIndex(1, "\t\t\n   ");
		expect(Request.isValid()).toBeFalsy();
	});

	it("throws an error if trying to set the solution to an index out of bounds.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		expect(function () {
			Request.setSolutionToIndex(4);
		}).toThrow();
	});

	it("throws an error if trying to set an option to a falsy value.", function () {
		var Request = ChangeRequest.EditMultiChoice(question);
		expect(function () {
			Request.setOptionAtIndex(0, null);
		}).toThrow();
	});

});
