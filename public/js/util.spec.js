/**
 * util.spec.js
 *
 * Test the functionality inside util.js.
 */

var Util = require('./util.js');

describe("Utility Object", function () {

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
});