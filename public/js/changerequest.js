/**
 * changerequest.js
 */

/*global Parse */

var
	ChangeRequest,
	
	EditQuestion;

/***********************************\
           	Change Request                    
\***********************************/

ObjectType = function (className, objectId) {
	var obj = new Parse.Object.extend(className);
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
	if (this._attributes[key] === undefined || this._attributes[key] === null) {
		return this._object.get(key);
	}
	else {
		return this._attributes[key];
	}
	return value;
};


ChangeRequest.prototype.isValid = function () {
	return true;
};

/***********************************\
           	Change Request                    
\***********************************/

EditRequest = function () { };

EditRequest.prototype = new ChangeRequest();


EditRequest.prototype.getOriginalObject = function () {
	return this._object;
};


EditRequest.prototype.getChangeMap = function () {
	return this._attributes;
};

/***********************************\
           	Edit Question
\***********************************/

EditQuestion = function (question) {
	if (!(this instanceof ChangeRequest)) {
		return new EditQuestion(question);
	}
};


EditQuestion.prototype = new EditRequest();


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

	if (this.get('ask').trim().length === 0) {
		return false;
	}

	if (this.get('explanation').trim().length === 0) {
		return false;
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
	EditMultiChoice: EditMultiChoice,
	ObjectType: ObjectType
};
