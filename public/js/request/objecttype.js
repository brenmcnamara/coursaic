/**
 * objecttype.js
 *
 * Used to create representations of models.
 */

var ObjectType = function (className, objectId) {
	var obj = new (Parse.Object.extend(className))();
	obj.id = objectId;
	return obj;
};

module.exports = ObjectType;