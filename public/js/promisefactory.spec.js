/**
 * promisefactory.spec.js
 *
 * Tests for the promisefactory.js file.
 */

var Prom = require('promise'),
    PromiseFactory = require('./promisefactory.js');

describe("Promise Factory", function () {

    var originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    describe("promisify module", function () {

        it("should generate no op promises", function (done) {
            PromiseFactory.Promisify.noOp().then(
                // Success.
                function () {
                    done();
                },
                // Error.
                function (error) {
                    throw error;
                });

        });

        it("should generate event-emitting promises.", function () {
            var
                // TODO: Create a real store mock.
                storeMock = { emit: function (event) {
                    expect(event).toBe("event");
                    done();
                }};

            PromiseFactory.Promisify.emitEvent(storeMock, "event")
                          .then(
                            // Success.
                            function () {
                                didExecuteThen = true;
                            },
                            // Error.
                            function (error) {
                                throw error;
                            });
        });

    });

    describe("thenify module", function () {

        it("should generate a 'then' clause for an operation.", function (done) {
            PromiseFactory.Promisify.noOp()

                .then.apply(null,
                    PromiseFactory.Thenify.execute(function () {
                        done();
                    }));
        });

        it("should transfer parameters to a 'then' clause.", function (done) {
            var value = "value";
            (new Prom(function (resolve, reject) {
                resolve(value);
            }))

            .then.apply(null,
                PromiseFactory.Thenify.execute(function (param) {
                    expect(param).toBe(value);
                    done();
                }));
            
        });

        it("should throw an error if the preceding promise throws an error.", function (done) {
            var fail = this.fail;

            (new Prom(function (resolve) {
                throw Error("An error.");
            }))

            .then.apply(null,
                PromiseFactory.Thenify.execute(function () { }))

            .then(
                // Success.
                function () {
                    // Failed to throw the error.
                    fail(new Error("Thenify did not throw an error."));
                },
                // Error.
                function (error) {
                    done();
                });
    
        });

        it("should propogate the return value of the next 'then' clause.", function () {
            var didExecuteFirstPromise = false;
            PromiseFactory.Promisify.noOp()

                .then.apply(null,
                    PromiseFactory.Thenify.execute(function () {
                        return new Promise(function (resolve, reject) {
                            didExecuteFirstPromise = true;
                            resolve();
                        });
                    }))

                .then.apply(null,
                    PromiseFactory.Thenify.execute(function () {
                        expect(didExecuteFirstPromise).toBeTruthy();
                        done();
                    }));
        });


        it("should generate an event emitter for a 'then' clause.", function (done) {
            var 
                mockStore = {
                    emit: function (event) {
                        expect(event).toBe("event");
                        done();
                    }
                };

            PromiseFactory.Promisify.noOp()
                .then.apply(null,
                    PromiseFactory.Thenify.emitEvent(mockStore, "event"));

        });

    });


});