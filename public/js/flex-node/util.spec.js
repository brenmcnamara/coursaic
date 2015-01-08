/**
 * util.spec.js
 *
 * Test the functionality inside util.js.
 */

var Util = require('./util.js');

describe("Utility Object", function () {

    describe("contains method", function () {

        it("should determine if an item is in an array.", function () {
            expect(Util.contains([1, 2, 3], 1)).toBeTruthy();
        });

        it("should determine if an item is not in an array.", function () {
            expect(Util.contains([1, 2, 3], 4)).toBeFalsy();
        });

    });

    describe("copy method", function () {

        it("should copy primitive types", function () {
            expect(false).toBe(Util.copy(false));
            expect(true).toBe(Util.copy(true));
            expect(undefined).toBe(Util.copy(undefined));
            expect(null).toBe(Util.copy(null));
            expect("hello").toBe(Util.copy("hello"));
            expect(10.2).toBe(Util.copy(10.2));
        });

        it("should copy shallow objects", function () {
            expect({a: "a", b: 123}).toEqual(Util.copy({a: "a", b: 123}));
        });

        it("should copy arrays", function () {
            expect([1, 2, "abc"]).toEqual(Util.copy([1, 2, "abc"]));
            expect(Array.isArray(Util.copy([1, 2, "abc"]))).toBeTruthy();
        });

        it("should copy deep objects", function () {
            var deepObj = {a: {ab: [1, 2, 3]}, b: false};
            expect(deepObj).toEqual(Util.copy(deepObj));
        });

    });

    describe("extend method", function () {

        it("should throw an error when extending non-objects", function () {
            var callExtend = function () {
                Util.extend({a: "a", b: "b"}, false);
            };
            expect(callExtend).toThrow();
        });

        it("should include all properties in the objects being extended.", function () {
            var obj = Util.extend({ a: "a", b: 123 },
                                  { c: function () { return "c"; } },
                                  { d: "d" });

            expect(obj.a).toBe("a");
            expect(obj.b).toBe(123);
            expect(obj.c()).toBe("c");
            expect(obj.d).toBe("d");
        });

        it("should extend the last object that is passed in.", function () {
            var lastObj = { c: "c" },
                obj = Util.extend({a: "a", b: "b"}, lastObj);

            expect(obj).toBe(lastObj);
        });

    });

    describe("patternToString method", function () {

        it("should generate the correct string from the list of arguments.", function () {
            var pattern = "/home/<schoolId>/course/<courseId>",
                argMap = { schoolId: "1234", courseId: "9876" };

            expect(Util.patternToString(pattern, argMap)).toBe("/home/1234/course/9876");
        });

        it("should generate the correct string when having duplicate argument names.", function () {
            var pattern = "/home/<id>/course/<id>/exam/<id>",
                argMap = { id: "abc" };
            expect(Util.patternToString(pattern, argMap)).toBe("/home/abc/course/abc/exam/abc");
        });

    });

});