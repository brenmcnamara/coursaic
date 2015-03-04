/**
 * editrequest.js
 *
 * Request for editing a model.
 */


var EditRequest,

	EditQuestion,

	EditMultiChoice;

/***********************************\
           	Edit Request
\***********************************/

EditRequest = function () { };


EditRequest.prototype.set = function (key, val) {
	if (typeof val === 'string') {
		val = val.trim();
	}
	this._attributes[key] = val;
	return this;
};


EditRequest.prototype.id = function () {
	return this._object.id;
};


EditRequest.prototype.set = function (key, val) {
	this._attributes[key] = val;
};


EditRequest.prototype.get = function (key) {
	if (this._attributes[key] === undefined || this._attributes[key] === null) {
		return this._object.get(key);
	}
	else {
		return this._attributes[key];
	}
	return value;
};


EditRequest.prototype.getOriginalObject = function () {
	return this._object;
};


EditRequest.prototype.getChangeMap = function () {
	return this._attributes;
};


EditRequest.prototype.forEachChange = function (callback) {
	var prop, changeMap = this.getChangeMap();

	for (prop in this.getChangeMap()) {
		if (changeMap.hasOwnProperty(prop)) {
			callback(prop, changeMap[prop]);
		}
	}
};


/***********************************\
           	Edit Question
\***********************************/

EditQuestion = function (question) {
	if (!(this instanceof EditQuestion)) {
		return new EditQuestion(question);
	}

	this._attributes = {};
	this._object = question;
};


EditQuestion.prototype = new EditRequest();


/***********************************\
          Edit Multi Choice
\***********************************/

EditMultiChoice = function (question) {
	if (!(this instanceof EditMultiChoice)) {
		return new EditMultiChoice(question);
	}
	this._attributes = {};
	this._object = question;


	// Find the correct option and set the solution index
	// to reflect this option.
	this._parseOptions().forEach(function (option, index) {
		if (question.isCorrect(option)) {
			this._solutionIndex = index;
		}
	}.bind(this));
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


EditMultiChoice.prototype.get = function (key) {
	if (key === 'solution') {
		return this._parseOptions()[this._solutionIndex];
	}
	else {
		return EditQuestion.prototype.get.call(this, key);
	}
};


EditMultiChoice.prototype.forEachChange = function (callback) {
	// Override this method to include the solution value.
	// Need to do this because the callback checks the change map
	// for any changes and the solution is a dynamic property that
	// is not cached in the change map.
	EditQuestion.prototype.forEachChange.call(this, callback);

	if (this.get('solution') !== this._object.get('solution')) {
		callback('solution', this.get('solution'));
	}
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
		if (!options[i]) {
			return false;
		}

		for (j = i + 1; j < options.length; ++j) {
			if (options[i] === options[j]) {
				return false;
			}
		}
	}

	if (this.get('ask').trim().length === 0) {
		return false;
	}

	if (this.get('explanation').trim().length === 0) {
		return false;
	}

	return true;
};


EditMultiChoice.prototype.setSolutionToIndex = function (index) {
	this._solutionIndex = index;
};


EditMultiChoice.prototype.setOptionAtIndex = function (index, option) {
	var options = this._parseOptions();

	option = option.trim();
	options[index] = option;
	this.set('options', JSON.stringify(options));
	return this;
};


module.exports = {
	Question: EditQuestion,
	MultiChoice: EditMultiChoice
};
