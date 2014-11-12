/**
 * Exam.js
 *
 * File describing the format of exams.
 */


var 

    /**
     * Create a deep copy of an object.
     * Note that this method has been added
     * for a specific purpose and does not
     * work in every case.
     *
     * @method copy
     *
     * @param obj {Object} The object to make
     *  a copy of.
     *
     * @return {Object} A deep copy of the object.
     */
    _copy = function(obj) {
        var prop, copy;

        // First check if the object is
        // an Array.
        if (Array.isArray(obj)) {
            return obj.slice();
        }

        switch (typeof obj) {
        // NOTE: This method does not
        // copy functions.
        case 'object':
            // Check for null
            if (!obj) {
                return obj;
            }
            copy = {};
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    copy[prop] = _copy(obj[prop]);
                }
            }
            return copy;
        case 'boolean':
        case 'number':
        case 'string':
        case 'undefined':
            return obj;
        default:
            return obj;
        }
    },


    /**
     * A class representing a question on an exam.
     *
     * @class Question
     */
    Question = Parse.Object.extend("Question", {


        /**
         * This method is meant to be used after a new
         * question has been initialized. This method
         * should not be called after the "fetch" method
         * is called on a question. Modifies the attributes
         * of the question to better represent the particular
         * question type.
         *
         * @method encodeAttrs
         */
        encodeAttrs: function() {
            this.attributes = this.parse(this.attributes);
        },


        parse: function(data) {
            // NOTE: This is assuming that the type
            // of the question is multiple choice. Should
            // change this when adding other types of
            // questions.
            var attrs = _copy(data);
            attrs.options = JSON.parse(attrs.options);
            return attrs;
        },


        toJSON: function() {
            // NOTE: This is assuming that the type
            // of the question is multiple choice. Should
            // change this when adding other types of
            // questions.

            // This method should basically undo any changes
            // that were made in the "parse" method.
            var attrs = _copy(this.attributes);
            attrs.options = JSON.stringify(attrs.options);
            return attrs;
        },


        /**
         * Check if the submission is the correct answer
         * to the question.
         *
         * @method isCorrect
         *
         * @param submission {String} The submission the user makes
         *  for the question. Note that different types of questions take
         *  different types of submission.
         */
        isCorrect: function(submission) {
            return submission === this.get('solution');
        }


    }),


    /**
     * A class representing an exam that someone
     * can take.
     *
     * @class Exam
     */
    Exam = Parse.Object.extend("Exam");


/**
 * A mapping of the types of questions that
 * are possible.
 *
 * @module Question
 * @property Type
 * @type Object
 */
Question.Type = {
    MULTI_CHOICE: 1
};

