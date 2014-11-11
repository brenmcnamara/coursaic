/*jshint asi: false, bitwise: false, boss: false, curly: true, debug: false, eqeqeq: true,
  eqnull: false, evil: false, forin: false, immed: true, laxbreak: true, maxlen: 100, 
  newcap: true, noarg: true, noempty: false, node: true, nonew: false, nomen: false, onevar: true,
  passfail: false, plusplus: false, regexp: false, undef: true, sub: true, strict: true,
  white: false, browser: true, devel: true */

  /*global describe, it, expect */

var Formatter = require('./Formatter.Date.js').Formatter;

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