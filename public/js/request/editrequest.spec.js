/**
 * editrequest.spec.js
 */

var EditMultiChoice = require('./editrequest.js').MultiChoice;

describe("Edit MultiChoice request", function () {

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
			},

			isCorrect: function (option) {
				return option === this.get('solution');
			}

		};
	});

	it("updates the solution of a question.", function () {
		var request = EditMultiChoice(question);
		request.setSolutionToIndex(0);
		expect(request.get('solution')).toBe('3');
	});

	it("updates the text for an option.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(2, '16');
		expect(JSON.parse(request.get('options'))).toEqual(['3', '4', '16', '6']);
	});

	it("updates the option and solution when changing the correct option.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(1, '12');
		expect(JSON.parse(request.get('options'))).toEqual(['3', '12', '5', '6']);
		expect(request.get('solution')).toBe('12');
	});

	it("validates a question if an option is changed to a legal value.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(0, "17");
		expect(request.isValid()).toBeTruthy();
	});

	it("validates a question if the solution is changed to a legal value.", function () {
		var request = EditMultiChoice(question);
		request.setSolutionToIndex(2);
		expect(request.isValid()).toBeTruthy();
	});

	it("invalidates a question if the ask value is an empty string.", function () {
		var request = EditMultiChoice(question);
		request.set('ask', "");
		expect(request.isValid()).toBeFalsy();
	});

	it("invalidates a question if the explanation values is an empty string.", function () {
		var request = EditMultiChoice(question);
		request.set("explanation", "");
		expect(request.isValid()).toBeFalsy();
	});

	it("invalidates a question if there are multiple options that are identical.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(0, '4');
		expect(request.isValid()).toBeFalsy();
	});

	it("invalidates a question if there are multiple options that are identical after trimming whitespace.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(0 , '4   ');
		expect(request.isValid()).toBeFalsy();
	});

	it("invalidates a question if setting an option to the empty string.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(1, "");
		expect(request.isValid()).toBeFalsy();
	});

	it("invalidates a question if setting an option to only contain whitespace.", function () {
		var request = EditMultiChoice(question);
		request.setOptionAtIndex(1, "\t\t\n   ");
		expect(request.isValid()).toBeFalsy();
	});

	it("throws an error if trying to set an option to a falsy value.", function () {
		var request = EditMultiChoice(question);
		expect(function () {
			request.setOptionAtIndex(0, null);
		}).toThrow();
	});

});
