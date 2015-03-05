/**
 * examrunstore.js
 *
 * A store that manages all the course questions.
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
     * exam runs.
     *
     * @module Store
     * @class ExamRunStore
     */
    ExamRunStore = StoreBuilder.createStore({

        /***********************************\
                   PRIVATE METHODS
        \***********************************/

        _Query: Query.queryBuilder({
        
            currentExamRun: function () {
                return new Query.Pipe({
                    data: this.pipe.data.filter(function (examRun) {
                            if (!store._currentExamRun) {
                                return false;
                            }
                            return examRun.cid === store._currentExamRun.cid;
                        })
                });
            }

        }),


        /**
         * Get a list of all exam runs currently
         * in the store.
         *
         * @method _examRunList
         * @private
         *
         * @return { Array } An array of exam runs.
         */
        _examRunList: function () {
            var list = [], prop;
            for (prop in this._examRunHash) {
                if (this._examRunHash.hasOwnProperty(prop)) {
                    list.push(this._examRunHash[prop]);
                }
            }

            // The current exam run is never part of the hash.
            // This may change in future updates.
            if (this._currentExamRun) {
                list.push(this._currentExamRun);
            }
            return list;
        },


        /***********************************\
                       PUBLIC
        \***********************************/

        initialize: function () {
            this._examRunHash = {};
            this._currentExamRun = null;
            // The id of the exam run that is being presented,
            // if any.
        },
        

        query: function () {
            return new this._Query(this._examRunList());
        },


        /***********************************\
                     NAMESPACES
        \***********************************/
 
        actionHandler: {

            LOAD_EXAM_RUN: function (payload) {
                var self = this;
                return Dispatcher.waitFor([ Stores.UserStore().dispatcherIndex ])

                    // Finished with question store. Get the questions from the
                    // question store.
                    .then(function () {
                        var examRunRequest = payload.examRunRequest,
                            course = new Course(),
                            examRun = new ExamRun(),
                            numOfQuestions = examRunRequest.get('numOfQuestions'),
                            questions;

                        course.id = payload.courseId;
                        questions = examRunRequest.getAllQuestions(
                                        Stores.QuestionStore()
                                              .query()
                                              .questionsNotDisabled()
                                              .questionsForCourse(course));

                        examRun.set('numOfQuestions', numOfQuestions);
                        examRun.set('author', Stores.UserStore().query().currentUser().getOne());

                        examRun.setQuestions(Util.randomSubset(questions, numOfQuestions));
                        self._currentExamRun = examRun;
                    });
            }

        }


    }),

    store = new ExamRunStore();


module.exports = store;
