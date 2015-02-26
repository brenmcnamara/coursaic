/**
 * createrequest.js
 */

var
	CreateMultiChoice,

	CreateExamRun,
	
	CreateQuestion,

	CreateRequest;

/***********************************\
           	New Request                  
\***********************************/

CreateRequest = function () { 
	// this._attribute should be a property of
	// the subclass.
};


CreateRequest.prototype.forEachChange = function (callback) {
	var prop;

	for (prop in this._attributes) {
		if (this._attributes.hasOwnProperty(prop)) {
			callback(prop, this._attributes[prop]);
		}
	}

};


CreateRequest.prototype.set = function (key, val) {
	if (typeof val === 'string') {
		val = val.trim();
	}
	this._attributes[key] = val;
	return this;
};


CreateRequest.prototype.get = function (key) {
	return this._attributes[key];
};


CreateRequest.prototype.isValid = function () {
	return true;
};


/***********************************\
           	New Question
\***********************************/

CreateQuestion = function () { 
	if (!(this instanceof CreateQuestion)) {
		return new CreateQuestion();
	}

	this._attributes = { };
};


CreateQuestion.prototype = new CreateRequest();


/***********************************\
           New Multi Choice
\***********************************/

CreateMultiChoice = function () { 
	if (!(this instanceof CreateMultiChoice)) {
		return new CreateMultiChoice();
	}

	this._attributes = { type: 1 };
};


CreateMultiChoice.prototype = new CreateQuestion();


CreateMultiChoice.prototype.forEachChange = function (callback) {

	CreateQuestion.prototype.forEachChange.call(this, callback);
	// The solution is not cached in the attributes of
	// object since it is a dynamic property. Must
	// add the solution to the callback.
	if (this.get('solution')) {
		callback('solution', this.get('solution'));
	}
};


CreateMultiChoice.prototype.isValid = function () {
	var options = this.getOptions(),
		i, j;

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

	if (!this.get('ask') || !this.get('explanation') || !this.get('solution')) {
		return false;
	}

	if (!this.get('topic')) {
		return false;
	}

	return true;
};


CreateMultiChoice.prototype.get = function (key) {
	if (key === 'solution') {
		// Customize getting the solution to avoid
		// certain bugs.
		return this.getOptions()[this._solutionIndex];
	}
	else {
		// Call the super class' implementation.
		return CreateQuestion.prototype.get.call(this, key);
	}
};


CreateMultiChoice.prototype.getOptions = function (index, option) {
	return (this.get('options')) ? (JSON.parse(this.get('options'))) : (["", "", "", ""]);
};


CreateMultiChoice.prototype.setOptionAtIndex = function (index, option) {
	var options = this.getOptions();
	options[index] = option;
	this.set('options', JSON.stringify(options));
};


CreateMultiChoice.prototype.setSolutionToIndex = function (index) {
	this._solutionIndex = index;
};


module.exports = {

	MultiChoice: CreateMultiChoice,

	Question: CreateQuestion

};
