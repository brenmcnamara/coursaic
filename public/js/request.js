/**
 * changerequest.js
 */

/*global Parse */

var
	ChangeRequest,
	
	NewRequest,

	NewQuestion,

	NewMultiChoice,

	EditRequest,

	EditQuestion,

	EditMultiChoice;


/***********************************\
           	Change Request                    
\***********************************/

ObjectType = function (className, objectId) {
	var obj = new (Parse.Object.extend(className))();
	obj.id = objectId;
	return obj;
};


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
	return this._attributes[key];
};


ChangeRequest.prototype.isValid = function () {
	return true;
};


/***********************************\
           	New Request                  
\***********************************/

CreateRequest = function () { };


CreateRequest.prototype = new ChangeRequest();


CreateRequest.prototype.forEachChange = function (callback) {
	var prop;

	for (prop in this._attributes) {
		if (this._attributes.hasOwnProperty(prop)) {
			callback(prop, this._attributes[prop]);
		}
	}

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


/***********************************\
           	Edit Request
\***********************************/

EditRequest = function () { };


EditRequest.prototype = new ChangeRequest();


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
	if (!(this instanceof ChangeRequest)) {
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
	if (!(this instanceof ChangeRequest)) {
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
	CreateQuestion: CreateQuestion,
	CreateMultiChoice: CreateMultiChoice,
	EditQuestion: EditQuestion,
	EditMultiChoice: EditMultiChoice,
	ObjectType: ObjectType
};