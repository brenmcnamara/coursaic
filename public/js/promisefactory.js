/**
 * promisefactory.js
 *
 * Generates promises and then parameters
 * that can be used to simplify boilerplate
 * code.
 */

/*global Promise */
var

    Prom = require('promise'),

    /**
     * Module containing promise generators.
     *
     * @module PromiseFactory
     * @submodule Promisify
     */
    Promisify = {

        /**
         * Generates a promise that resolves
         * without doing anything. This execution
         * is synchronous.
         *
         * @module PromiseFactory
         * @submodule Promisify
         * @method noOp
         *
         * @return {Promise} A promise that resolves
         *  without doing anything.
         */
        noOp: function () {
            return new Prom(function (resolve, reject) {
                resolve();
            });
        },


        /**
         * Generates a promise that emits
         * an event. This execution is synchronous.
         *
         * @module PromiseFactory
         * @submodule Promisify
         *
         * @method emitEvent
         *
         * @param store {Store} The store to emit the
         *  event from.
         *
         * @param event {String} The event to emit.
         *
         * @return {Promise} A promise that emits the event
         *  and resolves.
         */
        emitEvent: function (store, event) {
            return new Prom(function (resolve, reject) {
                store.emit(event);
                resolve();
            });
        }

    },


    /**
     * A module for generating callbacks that go into the
     * then clause after a promise.
     *
     * @module PromiseFactory
     * @submodule Thenify
     */
    Thenify = {

        /**
         * Generates a set of callbacks used
         * to execute custom logic.
         *
         * @module PromiseFactory
         * @submodule Thenify
         *
         * @method execute
         *
         * @param callback {Function} The function
         *  to call when the then clause is executed
         *  successfully.
         *
         * @return {Array} An array of 2 elements. The first
         *  element is a callback that executes the custom logic.
         *  The second element is a callback that takes an error
         *  and throws it.
         */
        execute: function (callback) {
            return [
                // Success.
                callback,
                // Failure.
                function (error) {
                    throw error;
                }
            ];
        },


        /**
         * Generates a set of callbacks used
         * to emit an event. This execution is
         * synchronous.
         *
         * @module PromiseFactory
         * @submodule Thenify
         *
         * @method emitEvent
         *
         * @param store {Store} The store to emit
         *  the event from.
         *
         * @param event {String} The event to
         *  emit from the store.
         *
         * @return {Array} An array of callbacks.
         *  The first callback will execute the logic to
         *  emit the event, and the second callback will
         *  take a parameter of an error and throw the error.
         */
        emitEvent: function (store, event) {

        }

    };


module.exports = {
    Promisify: Promisify,
    Thenify: Thenify

};
