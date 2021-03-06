/**
 * models.js
 *  File containing all the models used
 *  by the application.
 */

/*global Parse */

var

    Constants = require('../constants.js'),

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
            var enrolled = (this.get('enrolled') || []).slice(),
                courseIndex;

            if (this.isOwner(course)) {
                throw Error("A user cannot unenroll from a course for which they are the owner.");
            }
            if (!this.isEnrolled(course)) {
                throw Error("The user cannot be unenrolled from the course " + course.id +
                            " because they are not enrolled.");
            }

            enrolled.forEach(function (enrolledCourse, index) {
                if (enrolledCourse.id === course.id) {
                    courseIndex = index;
                }
            });

            enrolled.splice(courseIndex, 1);

            this.set('enrolled', enrolled);

         }

    }),

    /**
     * Represents a flag object.
     *
     * @module Models
     * @class Flag
     * @constructor
     */
    Flag = Parse.Object.extend("Flag", {

        getType: function () {
            switch (this.get('type')) {

            case 1:
                return Constants.FlagType.NONSENSE;
            case 2:
                return Constants.FlagType.NOT_RELEVANT;
            case 3:
                return Constants.FlagType.OUTDATED;
            case 4:
                return Constants.FlagType.REPEATED_QUESTION;
            case 5:
                return Constants.FlagType.AMBIGUOUS_QUESTION;
            default:
                throw Error("Flag " + flag.id + " has unrecognized flag type.");
            }
        },

        setType: function (type) {
            var flagValue;
            switch (type) {

            case Constants.FlagType.NONSENSE:
                this.set('type', 1);
                return;
            case Constants.FlagType.NOT_RELEVANT:
                this.set('type', 2);
                return;
            case Constants.FlagType.OUTDATED:
                this.set('type', 3);
                return;
            case Constants.FlagType.REPEATED_QUESTION:
                this.set('type', 4);
                return;
            case Constants.FlagType.AMBIGUOUS_QUESTION:
                this.set('type', 5);
                return;
            default:
                throw Error("Trying to set flag type to unrecognized type: " + type);
            }

            
        },

    }),

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
     * A class representing a specific exam run that someone
     * has taken or is taking.
     *
     * @module Models
     * @class ExamRun
     */
    ExamRun = Parse.Object.extend("ExamRun", {

        /**
         * Check if the exam run is being taken by someone at the moment.
         *
         * @method isInProgress
         *
         * @return { Boolean } True if the exam run is being taken, false
         *  if the exam run has already been completed.
         */
        isInProgress: function () {
            return this.isNew();
        },


        /**
         * An array of questions that are part of the
         * exam run. This will be null if the exam run is
         * not in progress.
         *
         * @method getQuestions
         *
         * @return { Array } A list of questions.
         */
        getQuestions: function () {
            return this._questions;
        },


        /**
         * Set an array of questions to be the questions for
         * the exam run.
         *
         * @method setQuestions
         *
         * @param questions { Array } The questions to set for
         *  the exam run.
         */
        setQuestions: function (questions) {
            this._questions = questions;
            this.set('numOfQuestions', questions.length);
        },

        /**
         * Remove the question at the given index from
         * the exam run. Undefined behavior if the index
         * is out-of-bounds from the exam run.
         *
         * @method removeQuestionAtIndex
         *
         * @param index { Number } The index of the
         *  question in the exam run. 
         *
         */
        removeQuestionAtIndex: function (index) {
            this._questions.splice(index, 1);
        },

        /**
         * Add a question at a particular index of the
         * exam run.
         *
         * @method insertQuestionAtIndex
         *
         * @param question { Question } The question to add
         *  to the exam run.
         *
         * @param index { Number } The index of the exam run
         *  to add it to.
         */
        insertQuestionAtIndex: function (question, index) {
            this._questions.splice(index, 0, question);
        },

        /**
         * Set an exam submission for this particular exam run.
         *
         * @method setSubmission
         *
         * @param submission { ExamRunSubmission } A submission for
         *  the exam run.
         */
        setSubmission: function (submission) {
            this._guesses = [];

            var numCorrect = this._questions.reduce(function (count, question, index) {
                var solution = submission.getSolutionAtIndex(index);
                this._guesses.push(solution);
                return (question.isCorrect(solution)) ? (count + 1) : (count);

            }.bind(this), 0);


            this.set('numCorrect', numCorrect);
            this.set('timeCompleted', submission.getTime());
        },

        /**
         * Get a list of guesses that the user submitted for the exam run.
         *
         * @method getGuesses
         *
         * @return { Array } An array of guesses for the exam or null if no
         *  submission was made.
         */
        getGuesses: function () {
            return this._guesses || null;
        },

    });


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
    ExamRun: ExamRun,
    Field: Field,
    Question: Question,
    Topic: Topic,
    User: User,
    Flag: Flag
};
