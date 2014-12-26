/**
 * models.js
 *  File containing all the models used
 *  by the application.
 */

/*global Parse */

var

    /**
     * Represents a single user.
     *
     * @module Models
     * @class User
     */
    User = Parse.User,

    /**
     * Represents a single field.
     *
     * @module Models
     * @class Field
     */
    Field = Parse.Object.extend("Field"),

    /**
     * Represents a single course.
     *
     * @module Models
     * @class Course
     */
    Course = Parse.Object.extend("Course", {

        /**
         * Check the number of people enrolled in a particular
         * course.
         *
         * @method enrollCount
         *
         * @return {Number} The enroll count of the course.
         */
        enrollCount: function() {
            return (this.get('enrolled') || []).length;        
        },


        /**
         * See if a user is enrolled in a particular
         * course.
         *
         * @method isEnrolled
         *
         * @param user {User} The user to check for
         *  enrollment.
         *
         * @return {Boolean} True if the user is enrolled in
         *  the course, false otherwise.
         */
        isEnrolled: function(user) {
            var enrolled = (this.get('enrolled') || []),
                i, n;

            for (i = 0, n = enrolled.length; i < n; ++i) {
                if (user.id === enrolled[i].id) {
                    return true;
                }
            }
            return false;
        },


        /**
         * Add a user to the course so that he/she is
         * now enrolled. This method does not perform
         * any persistence.
         *
         * @method addUser
         *
         * @param user {User} The user to add.
         *
         * @throw An error if the user is already added
         *  to this course.
         */
        addUser: function(user) {
            var enrolled;
            if (this.isEnrolled(user)) {
                throw new Error("Could not find user " + user.id + " while" +
                                "adding to course " + this.id);
            }
            enrolled = this.get('enrolled') || [];
            enrolled.push(user);
            this.set('enrolled', enrolled);
        },


        /**
         * Remove a user from the course so that he/she
         * is no longer enrolled. THis method does not
         * perform any persistence.
         *
         * @method removeUser
         *
         * @param user {User} The user to remove.
         *
         * @throw An erro if the user is not already
         *  enrolled in the course.
         */
        removeUser: function(user) {
            var enrolled = this.get('enrolled') || [],
                i, n, indexOfUser = -1;
            for (i = 0, n = enrolled.length; i < n && indexOfUser < 0; ++i) {
                if (enrolled[i].id === user.id) {
                    indexOfUser = i;
                }
            }
            if (indexOfUser < 0) {
                throw new Error("Could not find user " + user.id + " while " +
                                "removing from course " + this.id);
            }
            enrolled = enrolled.slice(0, indexOfUser)
                               .concat(enrolled.slice(indexOfUser + 1, n));
            this.set('enrolled', enrolled);
        }


    }),

    /**
     * Represents a single school.
     *
     * @module Models
     * @class School
     */
    School = Parse.Object.extend("School"),


    /**
     * A class representing a question on an exam.
     *
     * @module Models
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

        // TODO: Document this.
        getOptions: function() {
            // NOTE: This is assuming that the type
            // of the question is multiple choice. Should
            // change this when adding other types of
            // questions.  
            return JSON.parse(this.get('options'));
        },

        // TODO: Document this.
        setOptions: function(options) {
            this.set('options', JSON.stringify(options));
        },

        // TODO: Document this.
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
     * @module Models
     * @class Exam
     */
    Exam = Parse.Object.extend("Exam"),


    /**
     * A class that represents an instance of
     * an exam that someone can take.
     *
     * @module Models
     * @class ExamRun
     * @constructor
     *
     * @param questions {Array} An array of questions
     *  to be added to the current exam run.
     */
    ExamRun = function(questions) {
        this._questions = questions;
        // A psuedo-array representing the
        // guesses that the user submits. Note
        // that the user is not required to submit
        // a guess for each question, but any questions
        // without a guess will evaluate to incorrect.
        this._guesses = {length: this._questions.length};
    };


/**
 * Get the list of questions associated with the
 * exam.
 *
 * @method questions
 *
 * @return {Array} An array of question objects
 *  that are part of the ExamRun.
 */
ExamRun.prototype.questions = function() {
    return this._questions;
};


/**
 * Get the guess for a question at a particular
 * index.
 *
 * @method guessAtIndex
 *
 * @return {String} The guess for a particular question,
 *  or null if no guess was submited.
 */
ExamRun.prototype.guessAtIndex = function(index) {
    return this._guesses[index] || null;
};


/**
 * Set a guess for a particular question in the exam
 * run.
 *
 * @method setGuess
 *
 * @param questionIndex {Number} The index of the question
 *  to set a guess for. This is the index of the question
 *  inside the questions array.
 *
 * @param guess {String} The guess to the solution for the
 *  question.
 */
ExamRun.prototype.setGuess = function(questionIndex, guess) {
    this._guesses[questionIndex] = guess;
};


/**
 * Grade the submissions for the current exam run.
 *
 * @method grade
 *
 * @return {Number} A grade on the ExamRun, as a decimal
 *  number from 0 to 1. 0 indicates everything is incorrect,
 *  1 indicates everything is correct. If there are no questions
 *  in the exam run, this will always return 0.
 */
ExamRun.prototype.grade = function() {
    var questions = this.questions(),
        questionCount = questions.length,
        correctCount = [].reduce.call(this._guesses, function(memo, guess, index) {
            return (questions[index].isCorrect(guess)) ? memo + 1 : memo;
        }, 0);
    if (questionCount === 0) {
        return 0;
    }
    return correctCount / questionCount;
};


/**
 * A mapping of the types of questions that
 * are possible.
 *
 * @module Models
 * @submodule Question
 * @property Type
 * @type Object
 */
Question.Type = {
    MULTI_CHOICE: 1
};

module.exports = {

    Course: Course,
    Exam: Exam,
    ExamRun: ExamRun,
    Field: Field,
    Question: Question,
    School: School,
    User: User

};
