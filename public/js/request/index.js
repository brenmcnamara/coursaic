/**
 * index.js
 *
 * Root file for the request module.
 */

module.exports = {

	CreateExamRun: require('./createrequest.js').ExamRun,

	CreateExamSubmission: require('./createrequest.js').ExamSubmission,

	CreateMultiChoice: require('./createrequest.js').MultiChoice,

	EditMultiChoice: require('./editrequest.js').MultiChoice,

	EditQuestion: require('./editrequest.js').Question,
	
	ObjectType: require('./objecttype.js')

};