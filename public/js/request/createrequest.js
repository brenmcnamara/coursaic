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
	if (!(this instanceof CreateRequest)) {
		return new CreateRequest();
	} 
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

CreateExamRun = function () {
	if (!(this instanceof CreateExamRun)) {
		return new CreateExamRun();
	}
	this._propogators = [];
};


CreateExamRun.prototype = CreateRequest();


/**
 * Set the query for the exam run. This query should contain
 * all possible questions to query from. This is the base query
 * that other queries are added on to.
 *
 * @method setBaseQuery
 *
 * @param query { Query } The query object to filter out
 *  questions.
 */
CreateExamRun.prototype.setBaseQuery = function (query) {
	this._query = query;
};


/**
 * Get the base query for the request.
 *
 * @method getBaseQuery
 *
 * @return { Query } The base query or null if
 * no base query was set.
 */
CreateExamRun.prototype.getBaseQuery = function () {
	return this._query || null;
};


/**
 * Add a query operation to use for filtering
 * questions on an exam.
 *
 * @method addQuery
 *
 * @param queryPropogator { Function } A propogator operation
 *  to execute that represents the query.
 *
 * @param params { Array } An array of parameters to call
 *  for the propogator operation.
 *
 * @param context { Object } The context to call the
 *  propogator in.
 */
CreateExamRun.prototype.addQuery = function (queryPropogator, params) {
	console.log("type of Propogator: " + typeof queryPropogator);

	if (typeof queryPropogator === 'string') {
		// Passing in the name of a query propogator.
		// Resolve this recursively.
		this.addQuery(this._query[queryPropogator], params);
	}
	else {
		this._propogators.push({
			propogator: queryPropogator,
			params: params
		});
	}
};


/**
 * Remove a query to use for filtering questions on an
 * exam. If the query being removed was never added, this
 * method does nothing.
 *
 * @method removeQuery 
 *
 * @param queryPropogator { Function } A query propogator to
 *  remove from the exam run request.
 */
CreateExamRun.prototype.removeQuery = function (queryPropogator) {
	var i, n, foundIndex = -1;
	if (typeof queryPropogator === 'string') {
		this.removeQuery(this._query[queryPropogator]);
	}
	else {
		for (i = 0, n = this._propogators.length; i < n && foundIndex < 0; ++i) {
			if (queryPropogator === this._propogators[i].propogator) {
				foundIndex = i;
			}
		}
		// Found the index, so remove the item.
		if (foundIndex >= 0) {
			this._propogators.splice(foundIndex, 1);
		}
	}
	
};


/**
 * Get the total number of questions that are available
 * to the exam run.
 *
 * @return { Array } An array of all the questions that are to
 *  be included.
 */
CreateExamRun.prototype.getAllQuestions = function () {
	// Collapse the query.
	return this._propogators.reduce(function (query, propMap) {
		return propMap.propogator.apply(query, propMap.params);

	}, this._query).getAll();
};


/**
 * Iterate through the properties of the exam run that should be
 * persisted to the server. These properties include: 
 */
CreateExamRun.prototype.forEachChange = function (callback) {
	// TODO: Implement me!
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

	Question: CreateQuestion,

	ExamRun: CreateExamRun

};
