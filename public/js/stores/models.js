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
    User = Parse.User.extend({

        /**
         * Check if a user is enrolled in a course.
         *
         * @method isEnrolled
         *
         * @param course {Course} The course to check if the
         *  user is enrolled in.
         *
         * @return {Boolean} True if the user is enrolled in the
         *  course, false otherwise.
         */
        isEnrolled: function (course) {
            var enrolled = this.get('enrolled') || [];

            return enrolled.reduce(function (isEnrolled, enrolledCourse) {
                return isEnrolled || enrolledCourse.id === course.id;
            }, false);
        },

        /**
         * Check if a user is the owner of a particular course.
         *
         * @method isOwner
         *
         * @param course {Course} The course to check for ownership.
         *
         * @return {Boolean} True if the user is an owner, false otherwise.
         */
        isOwner: function (course) {
            return course.get('owner') && course.get('owner').id === this.id;
        },

        /**
         * Enroll a user in a particular course.
         *
         * @method enroll
         *
         * @param course { Course } The course to enroll the
         *  user in.
         */
        enroll: function (course) {
            var enrolled = this.get('enrolled') || [];

            if (this.isEnrolled(course)) {
                throw Error("The User is already enrolled in the course " + course.id);
            }

            enrolled.push(course);

            // Reset the enrolled property. If the enrolled property is null,
            // it won't get updated just by pushing the course to the array.
            this.set('enrolled', enrolled);
        },

        /**
         * Unenroll a user from a particular course.
         *
         * @method unenroll
         *
         * @param course { Course } The course to unenroll the
         *  user from.
         */
         unenroll: function (course) {
            var enrolled = this.get('enrolled') || [],
                courseIndex;

            if (!this.isEnrolled(course)) {
                throw Error("The user cannot be unenrolled from the course " + course.id);
            }

            enrolled.forEach(function (enrolledCourse, index) {
                if (enrolledCourse.id === course.id) {
                    courseIndex = index;
                }
            });

            enrolled = enrolled.slice(0, courseIndex)
                               .concat(enrolled.slice(courseIndex + 1,
                                                      enrolled.length - courseIndex - 1));

            this.set('enrolled', enrolled);

         }

    }),

    /**
     * Represents a flag object.
     */
    Flag = Parse.Object.extend("Flag"),

    /**
     * Represents a Topic within a course.
     *
     * @module Models
     * @class 
     */
    Topic = Parse.Object.extend("Topic"),

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
    Course = Parse.Object.extend("Course"),


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
            var parsed;
            // NOTE: This is assuming that the type
            // of the question is multiple choice. Should
            // change this when adding other types of
            // questions.  
            try {
                parsed = JSON.parse(this.get('options'));
            }
            catch (e) {
                throw Error("Error while parsing question options from backend: " + this.get('option') + " .");
            }
            return parsed;

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
    // TODO: Delete me!
    School: Parse.Object.extend("School"),
    Topic: Topic,
    User: User,
    Flag: Flag
};
