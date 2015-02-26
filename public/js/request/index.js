/**
 * index.js
 *
 * Root file for the request module.
 */

module.exports = {

	EditMultiChoice: require('./editrequest.js').MultiChoice,

	CreateMultiChoice: require('./createrequest.js').MultiChoice,

	ObjectType: require('./objecttype.js')
};