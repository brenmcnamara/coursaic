/*
 * Formatter.Text.spec.js
 *
 * Tests for functionality in Formatter.Text.js
 */

/*jshint asi: false, bitwise: false, boss: false, curly: true, debug: false, eqeqeq: true,
  eqnull: false, evil: false, forin: false, immed: true, laxbreak: true, maxlen: 100, 
  newcap: true, noarg: true, noempty: false, node: true, nonew: false, nomen: false, onevar: true,
  passfail: false, plusplus: false, regexp: false, undef: true, sub: true, strict: true,
  white: false, browser: true, devel: true */

/*global describe, it, expect */

var Formatter = require('./Formatter.Text.js').Formatter;

describe("Text Formatter", function() {

    "use strict";

    it("should truncate any text that is passed the truncation character.", function() {
        var text = "Here is some text to truncate";
        expect(Formatter.Text.truncate(text, {maxlen: 10})).toBe("Here is so...");
    });

    it("should not truncate anything if the text length equals maxlen.", function() {
        var text = "Should not truncate this";
        expect(Formatter.Text.truncate(text, {maxlen: text.length})).toBe(text);
    });

    it("should trim any whitespace before truncating.", function() {
        var text = "   Whitespace all around    ";
        expect(Formatter.Text.truncate(text, {maxlen: 22})).toBe("Whitespace all around");
    });

    it("should remove any periods at the end when truncating.", function() {
        var text = "Periods at end...";
        expect(Formatter.Text.truncate(text, {maxlen: 16})).toBe("Periods at end...");
    });

});