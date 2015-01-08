/**
 * storebuilder.spec.js
 *
 * Tests interface supplied by storebuilder.js
 */

var StoreBuilder = require('./storebuilder.js'),
    EventEmitter = require('events').EventEmitter;

describe("Store Builder", function () {

    it("should create stores containing EventEmitter methods.", function () {
        var store = new (StoreBuilder.createStore({ }))();

        expect(typeof store.on).toBe('function');
        expect(typeof store.removeListener).toBe('function');
        expect(typeof store.emit).toBe('function');
    });

    it("should create stores with augmented state", function () {
        var store = new (StoreBuilder.createStore({ 
            foo: function () { return "foo"; },
            bar: "bar"
        }))();

        expect(store.foo()).toBe("foo");
        expect(store.bar).toBe("bar");
    });

    it("should call the initialize method of a Store when the constructor is called", function () {
        var store = new (StoreBuilder.createStore({
            initialize: function () {
                this.isInitialized = true;
            }
        }))();

        expect(store.isInitialized).toBeTruthy();
    });

});