/**
 * index.js
 *
 * Root file for the request module.
 */

module.exports = {

	CreateExamRun: require('./createrequest.js').ExamRun,

	CreateMultiChoice: require('./createrequest.js').MultiChoice,

	EditMultiChoice: require('./editrequest.js').MultiChoice,

	ObjectType: require('./objecttype.js')

};