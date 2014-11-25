/**
 * Exam.js
 *
 * File describing the format of exams.
 */


var

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
         * question type. THIS METHOD MUST BE CALLED ONCE
         * AFTER THE QUESTION IS FETCHED FROM A QUERY.
         *
         * @method encodeAttrs
         */
        encodeAttrs: function() {
            this.attributes = this.parse(this.attributes);
        },

        // TODO (brendan): Document this.
        getOptions: function() {
            // NOTE: This is assuming that the type
            // of the question is multiple choice. Should
            // change this when adding other types of
            // questions.  
            return JSON.parse(this.get('options'));
        },

        // TODO (brendan): Document this.
        setOptions: function(options) {
            this.set('options', JSON.stringify(options));
        },

        // TODO (brendan): Document this.
        isEditing: function(val) {
            // This is a getter
            if (arguments.length === 0) {
                return this._isEditing;
            }

            // This is a setter.
            this._isEditing = val;
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

