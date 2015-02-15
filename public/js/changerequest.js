/**
 * changerequest.js
 */

var
	ChangeRequest,
	
	EditQuestion;


/***********************************\
           	Change Request                    
\***********************************/

ChangeRequest = function () { };


ChangeRequest.prototype.id = function (key, val) {
	return this._object.id;
};


ChangeRequest.prototype.set = function (key, val) {
	if (typeof val === 'string') {
		val = val.trim();
	}
	this._attributes[key] = val;
	return this;
};


ChangeRequest.prototype.get = function (key) {
	var value = this._attributes[key] || this._object.get(key);
	return value;
};


ChangeRequest.prototype.isValid = function () {
	return true;
};


/***********************************\
           	Edit Question
\***********************************/

EditQuestion = function (question) {
	if (!(this instanceof ChangeRequest)) {
		return new EditQuestion(question);
	}

	this._object = question;
};


EditQuestion.prototype = new ChangeRequest();


/***********************************\
             Multi Choice
\***********************************/

EditMultiChoice = function (question) {
	if (!(this instanceof ChangeRequest)) {
		return new EditMultiChoice(question);
	}
	this._attributes = {};
	this._object = question;
};


EditMultiChoice.prototype = new EditQuestion();


EditMultiChoice.prototype._parseOptions = function () {
	var options;
	try {
		options = JSON.parse(this.get('options'));
	}
	catch (e) {
		throw Error("Error while parsing multichoice options in Change Request.");
	}
	return options;
};


EditMultiChoice.prototype.isValid = function () {
	var options = this._parseOptions(),
		i, j;

	if (!this.get('solution')) {
		return false;
	}

	// Check if any 2 options are identical or if any option
	// is set to the empty string.
	for (i = 0; i < options.length; ++i) {
		if (options[i].length === 0) {
			return false;
		}

		for (j = i + 1; j < options.length; ++j) {
			if (options[i] === options[j]) {
				return false;
			}
		}
	}

	return true;
};

EditMultiChoice.prototype.setSolutionToIndex = function (index) {
	var options = this._parseOptions();
	if (!options[index]) {
		throw Error("Setting the solution to an invalid value.");
	}
	this.set('solution', options[index]);
	return this;
};


EditMultiChoice.prototype.setOptionAtIndex = function (index, option) {
	var options = this._parseOptions();

	option = option.trim();

	if (this.get('solution') === options[index]) {
		// Changing the text of the solution. Must modify the
		// solution to reflect the new option as well.
		this.set('solution', option);
	}
	options[index] = option;
	this.set('options', JSON.stringify(options));
	return this;
};


module.exports = {
	EditQuestion: EditQuestion,
	EditMultiChoice: EditMultiChoice
};
