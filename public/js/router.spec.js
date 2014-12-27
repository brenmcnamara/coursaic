/**
 * router.spec.js
 */

var Router = require('./router.js');

describe("Router", function () {

    it("should have simple criteria for valid paths.", function () {
        var matcher;

        expect(Router.isValidPath("/hello/world")).toBeTruthy();
        expect(Router.isValidPath("blah/blah")).toBeFalsy();
    });

    it("should retrict valid paths to paths without these chars: (,),<,>,[,],_.", function () {
        var matcher;

        expect(Router.isValidPath("/hello/(")).toBeFalsy();
        expect(Router.isValidPath("/hello/)")).toBeFalsy();
        expect(Router.isValidPath("/hello/<")).toBeFalsy();
        expect(Router.isValidPath("/hello/>")).toBeFalsy();
        expect(Router.isValidPath("/hello/[")).toBeFalsy();
        expect(Router.isValidPath("/hello/]")).toBeFalsy();
        expect(Router.isValidPath("/hello/_")).toBeFalsy();
    });

    describe("Pattern Matcher", function () {

        it("should call the correct case statement.", function () {
            var matcher, didMatchCase = false;
            Router.setPath("/path/to/page");
            matcher = Router.createPatternMatcher();

            matcher.forCase('/not/path/to/page', function (argMap) { });

            matcher.forCase('/path/to/page', function (argMap) {
                didMatchCase = true;
            });

            matcher.resolve();

            expect(didMatchCase).toBeTruthy();

        });

        it("should return the return value of the successful case statement.", function () {
            var matcher, didReturnCase = false;
            Router.setPath("/path/to/page");

            matcher = Router.createPatternMatcher();

            matcher.forCase('/path/to/page', function (argMap) {
                return true;
            });

            didReturnCase = matcher.resolve();

            expect(didReturnCase).toBeTruthy();
        });

        it("should match object id arguments in the path.", function () {

            var matcher, didMatchSchoolId = false;
            Router.setPath("/home/e4F3G679Dj");

            matcher = Router.createPatternMatcher();

            matcher.forCase('/home/<schoolId>', function (argMap) {
                didMatchSchoolId = (argMap.schoolId === "e4F3G679Dj");
            });

            matcher.resolve();
            expect(didMatchSchoolId).toBeTruthy();
        });

        it("should match custom argument patterns.", function () {

            var matcher,
                didMatchInvalidCase = false,
                didMatchValidCase = false;

            Router.setPath("/home");

            matcher = Router.createPatternMatcher();

            matcher.forCase("/<pageKey:(\\d+)>", function (argMap) {
                didMatchInvalidCase = true;
            });

            matcher.forCase("/<pageKey:([A-Za-z]+)>", function (argMap) {
                didMatchValidCase = (argMap.pageKey === 'home');
            });

            matcher.resolve();
            expect(didMatchInvalidCase).toBeFalsy();
            expect(didMatchValidCase).toBeTruthy();
        });

        it("should match multiple patterns", function () {
            var matcher, didMatchAllPatterns = false;

            Router.setPath("/home/e4F3G679Dj/course/Lkf6h6G93J");

            matcher = Router.createPatternMatcher();

            matcher.forCase("/home/<schoolId>/course/<courseId>", function (argMap) {
                didMatchAllPatterns = (argMap.schoolId === "e4F3G679Dj" &&
                                       argMap.courseId === "Lkf6h6G93J");
            });

            matcher.resolve();
            expect(didMatchAllPatterns).toBeTruthy();

        });

        it("should pattern match against underscore argument", function () {
            var matcher, didResolveUnderscore = false;

            Router.setPath('/home/1234567890');

            matcher = Router.createPatternMatcher();

            matcher.forCase('/home/<_>', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeTruthy();
        });

        it("should fail to pattern match against invalid argument.", function () {
            var matcher, didResolveUnderscore = false;

            Router.setPath('/home/123');

            matcher = Router.createPatternMatcher();

            matcher.forCase("/home/<_>", function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeFalsy();
        });


        it("should pattern match against underscore argument with custom argument.", function () {
            var matcher, didResolveUnderscore = false;

            Router.setPath('/home/e4F3G679Dj');

            matcher = Router.createPatternMatcher();

            matcher.forCase('/<_:([A-Za-z]+)>/e4F3G679Dj', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeTruthy();
        });

        it("should fail pattern match when underscore argument does not match", function () {
            var matcher, didResolveUnderscore = false;

            Router.setPath('/home');

            matcher = Router.createPatternMatcher();

            matcher.forCase('/<_:(course)', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeFalsy();
        });

        it("should quit after first match", function () {

            var matcher, didMakeFirstMatch = false, didMakeSecondMatch = false;

            Router.setPath('/home/path/to/blah');

            matcher = Router.createPatternMatcher();

            matcher.forCase('/home/path/to/blah', function (argMap) {
                didMakeFirstMatch = true;
            });

            matcher.forCase('/home/path/to/blah', function (argMap) {
                didMakeSecondMatch = true;
            });

            matcher.resolve();

            expect(didMakeFirstMatch).toBeTruthy();
            expect(didMakeSecondMatch).toBeFalsy();

        });

        it("should not allow matches on partially correct paths by default.", function () {
            var matcher, didPartialMatch = false;

            Router.setPath('/home/path/to/blah');
            matcher = Router.createPatternMatcher();

            matcher.forCase('/home/path', function () {
                didPartialMatch = true;
            });

            matcher.resolve();
            expect(didPartialMatch).toBeFalsy();

        });

        it("should support configuration to allow partial matches.", function () {
            var matcher, didPartialMatch = false;

            Router.setPath('/home/path/to/blah');
            matcher = Router.createPatternMatcher();

            matcher.config({ allowPartialMatch: true });
            matcher.forCase('/home/path', function () {
                didPartialMatch = true;
            });

            matcher.resolve();
            expect(didPartialMatch).toBeTruthy();

        });

        it("should support configuration to allow partial matching with arguments", function () {
            var matcher, didPartialMatchWithArgs = false;

            Router.setPath('/home/path/to/blah');
            matcher = Router.createPatternMatcher();

            matcher.config({ allowPartialMatch: true });
            matcher.forCase('/home/path/<word:([a-z]+)>', function (argMap) {
                didPartialMatchWithArgs = (argMap.word === 'to');
            });

            matcher.resolve();
            expect(didPartialMatchWithArgs).toBeTruthy();
        });

        it("should resolve to null if all cases fail.", function () {
            var matcher;
            Router.setPath('/home');
            matcher = Router.createPatternMatcher();
            expect(matcher.resolve()).toBe(null);
        });

        it("should permit custom resolve values if cases fail.", function () {
            var matcher;

            Router.setPath("/home");

            matcher = Router.createPatternMatcher();
            matcher.config({ defaultResolveValue: [] });

            expect(matcher.resolve()).toEqual([]);
        });

    });

});