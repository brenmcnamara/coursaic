/**
 * flagstore.js
 *
 * A store that manages flags for questions.
 */


var Stores = require('../stores'),
    Dispatcher = require('shore').Dispatcher,
    Constants = require('../constants.js'),
    StoreBuilder = require('shore').StoreBuilder,

    Course = require('./models.js').Course,
    ExamRun = require('./models.js').ExamRun,
    Flag = require('./models.js').Flag,

    Query = require('./query.js'),

    Util = require('shore').Util,

    /**
     * A Store containing all data related to
     * flags.
     *
     * @module Store
     * @class FlagStore
     */
    FlagStore = StoreBuilder.createStore({

    	_Query: Query.queryBuilder({

    		flagsForQuestion: function (question) {
    			return new Query.Pipe({
    				data: this.pipe.data.filter(function (flag) {
    					return flag.get('question').id === question.id;
    				})
    			});
    		},

            flagsForUser: function (user) {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (flag) {
                        return flag.get('author').id === user.id;
                    })
                });
            }

    	}),


        /**
         * Get a list of all flags currently
         * in the store.
         *
         * @method _flagList
         * @private
         *
         * @return { Array } An array of flags.
         */
        _flagList: function () {
            var list = [], prop;
            for (prop in this._flagHash) {
                if (this._flagHash.hasOwnProperty(prop)) {
                    list.push(this._flagHash[prop]);
                }
            }
            return list;
        },


        /**
         * Perform a network call to get all the flags for
         * a particular question.
         *
         * @method _fetchFlagsForQuestions
         * @private
         *
         * @param questions { Array } An array of questions.
         *
         * @return { Promise } A promise that is executed when the fetching is
         * complete.
         */
        _fetchFlagsForQuestions: function (questions) {
        	var self = this;
        	return Promise.all(questions.map(function (question) {
        		var networkQuery = new Parse.Query(Flag);

        		networkQuery.equalTo("question", question);

        		return networkQuery.find().then(
        			function (flags) {
						flags.forEach(function (flag) {
							self._flagHash[flag.id] = flag;
						});
					});
        	}));
        },


        /***********************************\
                       PUBLIC
        \***********************************/

        initialize: function () {
            this._flagHash = {};
            // The id of the exam run that is being presented,
            // if any.
        },
        

        query: function () {
            return new this._Query(this._flagList());
        },


        /***********************************\
                      NAMESPACES
        \***********************************/

        actionHandler: {

            FLAG_QUESTION: function (payload) {
                // Need to perform some sort of checks to see if the user has
                // already flagged this question.
                var self = this,
                    flag = new Flag(),

                    user = Stores.UserStore()
                                 .query()
                                 .currentUser()
                                 .getOne(),

                    question = Stores.QuestionStore()
                                     .query()
                                     .questionWithId(payload.questionId)
                                     .getOne();

                flag.setType(payload.flagType);
                flag.set('question', question);
                flag.set('author', user);

                return flag.save().then(function (flag) {
                    // Successfully saved the question.
                    self._flagHash[flag.id] = flag;
                    self.emit(Constants.Event.FLAGGED_QUESTION);
                });
            },

        	LOAD_COURSE: function (payload) {
        		var self = this;
        		return Dispatcher.waitFor([ Stores.QuestionStore().dispatcherIndex ])

        			// Question Store is done loading.
        			.then(function () {
        				var courseId = payload.courseId,
        					course = new Course(),
        					questions;

        				course.id = courseId;
        				questions = Stores.QuestionStore().query().questionsForCourse(course).getAll();

        				return self._fetchFlagsForQuestions(questions);

        			});
        	}

        }


    });


module.exports = new FlagStore();

