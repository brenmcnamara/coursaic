/**
 * path.spec.js
 */

var Path = require('./path.js');

describe("Path", function () {

    it("should have simple criteria for valid paths.", function () {
        var matcher;

        expect(Path.isValidPath("/")).toBeTruthy();
        expect(Path.isValidPath("/hello/world")).toBeTruthy();
        expect(Path.isValidPath("blah/blah")).toBeFalsy();
        expect(Path.isValidPath("/blah/blah/")).toBeFalsy();
        expect(Path.isValidPath("//")).toBeFalsy();
    });

    it("should retrict valid paths to paths without these chars: (,),<,>,[,],_.", function () {
        var matcher;

        expect(Path.isValidPath("/hello/(")).toBeFalsy();
        expect(Path.isValidPath("/hello/)")).toBeFalsy();
        expect(Path.isValidPath("/hello/<")).toBeFalsy();
        expect(Path.isValidPath("/hello/>")).toBeFalsy();
        expect(Path.isValidPath("/hello/[")).toBeFalsy();
        expect(Path.isValidPath("/hello/]")).toBeFalsy();
        expect(Path.isValidPath("/hello/_")).toBeFalsy();
    });

    it("should perform quick pattern matching on current path.", function () {
        var path = "/home/1234567890";
        expect(Path.matchArguments("/home/<schoolId>", path)).toEqual({ schoolId: "1234567890"});
        expect(Path.matchArguments("/home/<_>/<somethingElse>", path)).toEqual({});
    });

    it("should perform quick partial matching on current path.", function () {
        var path = "/home/1234567890/course/2345678901";
        expect(Path.matchArguments("/home/<schoolId>", path)).toEqual({ schoolId: "1234567890"});
    });

    describe("Pattern Matcher", function () {

        it("should call the correct case statement.", function () {
            var matcher, didMatchCase = false,
                path = "/path/to/page";

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/not/path/to/page', function (argMap) { });

            matcher.forCase('/path/to/page', function (argMap) {
                didMatchCase = true;
            });

            matcher.resolve();

            expect(didMatchCase).toBeTruthy();

        });

        it("should return the return value of the successful case statement.", function () {
            var matcher, didReturnCase = false,
                path = "/path/to/page";

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/path/to/page', function (argMap) {
                return true;
            });

            didReturnCase = matcher.resolve();

            expect(didReturnCase).toBeTruthy();
        });

        it("should match object id arguments in the path.", function () {

            var matcher, didMatchSchoolId = false,
                path = "/home/e4F3G679Dj";

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/home/<schoolId>', function (argMap) {
                didMatchSchoolId = (argMap.schoolId === "e4F3G679Dj");
            });

            matcher.resolve();
            expect(didMatchSchoolId).toBeTruthy();
        });

        it("should match custom argument patterns.", function () {

            var matcher,
                didMatchInvalidCase = false,
                didMatchValidCase = false,
                path = "/home";

            matcher = Path.createPatternMatcher(path);

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
            var matcher, didMatchAllPatterns = false,
                path = "/home/e4F3G679Dj/course/Lkf6h6G93J";

            matcher = Path.createPatternMatcher(path);

            matcher.forCase("/home/<schoolId>/course/<courseId>", function (argMap) {
                didMatchAllPatterns = (argMap.schoolId === "e4F3G679Dj" &&
                                       argMap.courseId === "Lkf6h6G93J");
            });

            matcher.resolve();
            expect(didMatchAllPatterns).toBeTruthy();

        });

        it("should pattern match against underscore argument", function () {
            var matcher, didResolveUnderscore = false,
                path = '/home/1234567890';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/home/<_>', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeTruthy();
        });

        it("should fail to pattern match against invalid argument.", function () {
            var matcher, didResolveUnderscore = false,
                path = '/home/123';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase("/home/<_>", function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeFalsy();
        });


        it("should pattern match against underscore argument with custom argument.", function () {
            var matcher, didResolveUnderscore = false,
                path = '/home/e4F3G679Dj';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/<_:([A-Za-z]+)>/e4F3G679Dj', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeTruthy();
        });

        it("should fail pattern match when underscore argument does not match", function () {
            var matcher, didResolveUnderscore = false,
                path = '/home';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/<_:(course)', function (argMap) {
                didResolveUnderscore = true;
            });

            matcher.resolve();

            expect(didResolveUnderscore).toBeFalsy();
        });

        it("should quit after first match", function () {

            var matcher, didMakeFirstMatch = false, didMakeSecondMatch = false,
                path = '/home/path/to/blah';

            matcher = Path.createPatternMatcher(path);

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

        it("should partial matching by default.", function () {
            var matcher, didPartialMatch = false,
                path = '/home/path/to/blah';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/home/path', function () {
                didPartialMatch = true;
            });

            matcher.resolve();
            expect(didPartialMatch).toBeTruthy();

        });

        it("should support partial matching with arguments.", function () {
            var matcher, didPartialMatchWithArgs = false,
                path = '/home/path/to/blah';

            matcher = Path.createPatternMatcher(path);

            matcher.forCase('/home/path/<word:([a-z]+)>', function (argMap) {
                didPartialMatchWithArgs = (argMap.word === 'to');
            });

            matcher.resolve();
            expect(didPartialMatchWithArgs).toBeTruthy();
        });

        it("should be configurable to disallow partial matching.", function () {
            var matcher, didPartialMatch = false,
                path = '/home/path/to/blah';

            matcher = Path.createPatternMatcher(path);
            matcher.config({ allowPartialMatch: false });

            matcher.forCase('/home/path', function () {
                didPartialMatch = true;
            });

            matcher.resolve();
            expect(didPartialMatch).toBeFalsy();

        });

        it("should resolve to null if all cases fail.", function () {
            var matcher,
                path = '/home';
            matcher = Path.createPatternMatcher(path);
            expect(matcher.resolve()).toBe(null);
        });

        it("should permit custom resolve values if cases fail.", function () {
            var matcher,
                path = "/home";

            matcher = Path.createPatternMatcher(path);
            matcher.config({ defaultResolveValue: [] });

            expect(matcher.resolve()).toEqual([]);
        });

        it("should perform short-circuit pattern matching by default.", function () {
            var matcher, didMakeFirstMatch = false, didMakeSecondMatch = false,
                path = "/home/1234567890/course/2345678910";

            matcher = Path.createPatternMatcher(path);

            // Both cases match the path, but only the first case
            // should be run because this is getting short-circuited.
            matcher.forCase("/home/<schoolId>", function (argMap) {
                didMakeFirstMatch = true;
            });

            matcher.forCase("/home/<_>/course/<courseId>", function (argMap) {
                didMakeSecondMatch = true;
            });
            matcher.resolve();

            expect(didMakeFirstMatch).toBeTruthy();
            expect(didMakeSecondMatch).toBeFalsy();
        });

        it("should provide the option to override short-circuit when matching.", function () {
            var matcher, didMakeFirstMatch = false, didMakeSecondMatch = false,
                path = "/home/1234567890/course/2345678910";

            matcher = Path.createPatternMatcher(path);
            matcher.config({ shortCircuit: false });

            matcher.forCase("/home/<schoolId>", function (argMap) {
                didMakeFirstMatch = true;
            });

            matcher.forCase("/home/<_>/course/<courseId>", function (argMap) {
                didMakeSecondMatch = true;
            });
            matcher.resolve();

            expect(didMakeFirstMatch).toBeTruthy();
            expect(didMakeSecondMatch).toBeTruthy();
        });

        it("should give an array of return values when overriding short-circuit.", function () {
            var matcher, didMakeFirstMatch = false, didMakeSecondMatch = false,
                path = "/home/1234567890/course/2345678910";

            matcher = Path.createPatternMatcher(path);
            matcher.config({ shortCircuit: false });

            matcher.forCase("/home/<schoolId>", function (argMap) {
                return 1;
            });

            matcher.forCase("/home/<_>/course/<courseId>", function (argMap) {
                return 2;
            });

            // Note the return values are in the order of the case statements.
            expect(matcher.resolve()).toEqual([1, 2]);
        });

        it("should allow the path of the pattern matcher to change.", function () {
            var matcher = Path.createPatternMatcher("/home"),
                didMatchHome = false, didMatchSplash = false;
            matcher.forCase("/home", function() {
                didMatchHome = true;
            });

            matcher.forCase("/splash", function () {
                didMatchSplash = true;
            });

            matcher.path("/splash");

            matcher.resolve();

            expect(didMatchHome).toBeFalsy();
            expect(didMatchSplash).toBeTruthy();
        });

    });

});