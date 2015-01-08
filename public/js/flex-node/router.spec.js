/**
 * router.spec.js
 *
 * Tests the functionality in router.js.
 */

var Router = require('./router.js');

describe("Router", function () {

    // Note: These tests assume that the unwatch
    // operation for the Router works correctly.
    afterEach(function () {
        Router.unwatch();
    });

});