/**
 * Formatter.js
 */

var Formatter = require('./formatter.js');

describe("Number Formatter", function () {

    "use strict";

    it("removes extra digits after the decimal.", function () {
        expect(Formatter.Number.format(12.1223, { placesAfterDecimal: 2 })).toBe("12.12");
    });

    it("removes all digits after the decimal with 0 places after decimal.", function () {
        expect(Formatter.Number.format(12.2, { placesAfterDecimal: 0 })).toBe("12");
    });

    it("should not add a decimal to an integer with 0 places after decimal", function () {
        expect(Formatter.Number.format(12, { placesAfterDecimal: 0 })).toBe("12");
    });

    it("should add zeros with decimal point to integers.", function () {
        expect(Formatter.Number.format(12, { placesAfterDecimal: 3 })).toBe("12.000");
    });

});

describe("Time Formatter", function () {

    "use strict";

    it("should format the time correctly when seconds is less than 10.", function () {
        expect(Formatter.Time.format(8)).toBe("00:08");
    });


    it("should format the time correctly when seconds is between 10 and 60.", function () {
        expect(Formatter.Time.format(43)).toBe("00:43");
    });

    it("should format the time correctly when seconds is between 60 and 600.", function () {
        // This case is when minutes are between 1 and 10.
        expect(Formatter.Time.format(134)).toBe("02:14");
    });

    it("should format the time correctly when seconds is greater than 600.", function () {
        expect(Formatter.Time.format(721)).toBe("12:01");
    });

    it("should do a text format correctly when there are 0 seconds.", function () {
        expect(Formatter.Time.format(0, { textFormat: true })).toBe("0 seconds");
    });

    it("should do a text format correctly when the seconds are less than 60.", function () {
        expect(Formatter.Time.format(54, { textFormat: true })).toBe("54 seconds");
    });

    it("should do a text format correctly when the seconds modulo 60 is 1", function () {
        // Singular second.
        expect(Formatter.Time.format(121, { textFormat: true })).toBe("2 minutes, 1 second");
    });

    it("should do a text format correctly when the seconds are in between 60 and 120", function () {
        // Singular minute.
        expect(Formatter.Time.format(110, { textFormat: true})).toBe("1 minute, 50 seconds");
    });

    it("should do a text format correctly when the seconds are greater than 120.", function () {
        // Plural minute.
        expect(Formatter.Time.format(592, { textFormat: true })).toBe("9 minutes, 52 seconds");
    });

    it("should omit seconds when seconds modulo 60 is 0", function () {
        expect(Formatter.Time.format(120, { textFormat: true })).toBe("2 minutes");
    });


});


describe("Date Formatter", function() {

    "use strict";
    
    it("should format the current date correctly.", function() {
        var date = new Date();

        expect(Formatter.Date.format(date)).toBe("just now");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("just now");
    });


    it("should round down the minutes before half for dates within the minute.", function() {
        var currentDate = new Date(),
            // Date is .4 minutes ago.
            date = new Date(currentDate.getTime() - (1000 * 60 * 0.4));

        expect(Formatter.Date.format(date)).toBe("just now");
        expect(Formatter.Date.format(date), {preposition: true}).toBe("just now");
    });


    it("should format dates by minutes when formatting a date within the hour.", function() {
        var currentDate = new Date(),
            // Date is 30 minutes before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 30));

        expect(Formatter.Date.format(date)).toBe("30 minutes ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("30 minutes ago");
    });


    it("should round up the minute passed half when formatting dates within the hour.", function() {
        var currentDate = new Date(),
            // Date is 29.5 minutes before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 29.6));

        expect(Formatter.Date.format(date)).toBe("30 minutes ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("30 minutes ago");
    });

    
    it("should round down the minute before half for dates within the hour.", function() {
        var currentDate = new Date(),
            // Date is 29.4 minutes before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 29.4));

        expect(Formatter.Date.format(date)).toBe("29 minutes ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("29 minutes ago");        
    });


    it("should format dates by hours when formatting a date within the day.", function() {
        var currentDate = new Date(),
            // Date is 14 hours before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 14));

        expect(Formatter.Date.format(date)).toBe("14 hours ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("14 hours ago");        
    });


    it("should round up the hour passed half when formatting a date within the day.", function() {
        var currentDate = new Date(),
            // Date is 13.6 hours before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 13.6));

        expect(Formatter.Date.format(date)).toBe("14 hours ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("14 hours ago");        
    });


    it("should round down the hours before half for a date within the day.", function() {
        var currentDate = new Date(),
            // Date is 13.4 hours before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 13.4));

        expect(Formatter.Date.format(date)).toBe("13 hours ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("13 hours ago");        

    });


    it("should format dates by days when formatting a date within the week.", function() {
        var currentDate = new Date(),
            // Date is 5 days before current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24 * 5));

        expect(Formatter.Date.format(date)).toBe("5 days ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("5 days ago");        
    });


    it("should round up the day passed half for a date within the week.", function() {
        var currentDate = new Date(),
            // Date is 4.6 days before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24 * 4.6));

        expect(Formatter.Date.format(date)).toBe("5 days ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("5 days ago");        
    });


    it("should round down the day before half for a date within the week.", function() {
        var currentDate = new Date(),
            // Date is 4.4 days before current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24 * 4.4));

        expect(Formatter.Date.format(date)).toBe("4 days ago");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("4 days ago");        
    });


    it("should not present the days for a date more than a week ago after rounding.", function() {
        var currentDate = new Date(),
            // Date is 6.6 days before the current date.
            date = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24 * 6.6));

        expect(Formatter.Date.format(date)).not.toBe("7 days ago");
    });


    it("should have the absolute date for any date more than a week ago", function() {
        var date = new Date(2013, 2, 2);

        expect(Formatter.Date.format(date)).toBe("March 2, 2013");
        expect(Formatter.Date.format(date, {preposition: true})).toBe("on March 2, 2013");
    });


    it("should have the correct month abbreviations for an absolute date.", function() {
        var january = new Date(2013, 0, 1),
            february = new Date(2013, 1, 1),
            march = new Date(2013, 2, 1),
            april = new Date(2013, 3, 1),
            may = new Date(2013, 4, 1),
            june = new Date(2013, 5, 1),
            july = new Date(2013, 6, 1),
            august = new Date(2013, 7, 1),
            september = new Date(2013, 8, 1),
            october = new Date(2013, 9, 1),
            november = new Date(2013, 10, 1),
            december = new Date(2013, 11, 1);

        expect(Formatter.Date.format(january)).toMatch(/^Jan\./);
        expect(Formatter.Date.format(february)).toMatch(/^Feb\./);
        expect(Formatter.Date.format(march)).toMatch(/^March/);
        expect(Formatter.Date.format(april)).toMatch(/^April/);
        expect(Formatter.Date.format(may)).toMatch(/^May/);
        expect(Formatter.Date.format(june)).toMatch(/^June/);
        expect(Formatter.Date.format(july)).toMatch(/^July/);
        expect(Formatter.Date.format(august)).toMatch(/^Aug\./);
        expect(Formatter.Date.format(september)).toMatch(/^Sept\./);
        expect(Formatter.Date.format(october)).toMatch(/^Oct\./);
        expect(Formatter.Date.format(november)).toMatch(/^Nov\./);
        expect(Formatter.Date.format(december)).toMatch(/^Dec\./);
    });


});


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