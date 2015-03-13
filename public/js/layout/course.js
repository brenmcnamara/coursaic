/** @jsx React.DOM */

/**
 * course.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

var React = require('react'),

    ComponentsLayout = require('./components.js'),
    FormLayout = require('./form.js'),
    HeaderLayout = require('./header.js'),
    PopupsLayout = require('./popups.js'),
    QuestionLayout = require('./questions.js'),

    // Stores
    Stores = require('../stores'),
    CourseStore = Stores.CourseStore(),
    PageStore = Stores.PageStore(),
    QuestionStore = Stores.QuestionStore(),
    TopicStore = Stores.TopicStore(),
    UserStore = Stores.UserStore(),

    Request = require('../request'),

    Formatter = require('../formatter.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),

    Util = require('shore').Util,

    widgets = require('../widgets.js'),

    Dashboard = ComponentsLayout.Dashboard,

    SectionSet = ComponentsLayout.SectionSet,

    TagSet = ComponentsLayout.TagSet,

    /**
     * The root element on the Course
     * page.
     * 
     * @module Layout
     * @submodule Course
     * @class Root
     */
    Root = React.createClass({
        
        render: function () {
            var user = UserStore.query().currentUser().getOne(),
                courseId = PageStore.courseId(),
                course = CourseStore.query().courseWithId(courseId).getOne();

            if (user.isOwner(course)) {
                return <Root_Owner course={course} />;
            }
            else {
                return <Root_User course={course} />;
            }
        },

        componentWillMount: function () {
            QuestionStore.on(Constants.Event.CHANGED_DISABLE_QUESTION_STATE,
                             this.onChangeDisableQuestionState);

            QuestionStore.on(Constants.Event.DELETED_QUESTION, this.onDeletedQuestion);
        },

        componentWillUnmount: function () {
            QuestionStore.removeListener(Constants.Event.CHANGED_DISABLE_QUESTION_STATE,
                                         this.onChangeDisableQuestionState);

            QuestionStore.removeListener(Constants.Event.DELETED_QUESTION, this.onDeletedQuestion);
        },

        onChangeDisableQuestionState: function () {
            this.forceUpdate();
        },

        onDeletedQuestion: function () {
            this.forceUpdate();
        },

    }),


    /**
     * The root of the course page for
     * owners of the course.
     */
    Root_Owner = React.createClass({

        render: function() {
            var course = this.props.course,
                menu = [
                    (<a href="#">Logout</a>)
                ];

            return (
                <div className="main">
                    <HeaderLayout.Header menu={ menu } />
                    <div className="content-wrapper">
                        <CourseDashboard course={ course } isOwner={ true } />
                        <Sections_Owner course={ course } />
                    </div>
                    
                </div>
            );
        },

        onChange: function() {
            this.forceUpdate();
        },

        componentWillMount: function() {
            Stores.CourseStore().on(Constants.Event.CHANGED_ENROLLMENT, this.onChange);
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
        },

        componentWillUnmount: function() {
            Stores.CourseStore().removeListener(Constants.Event.CHANGED_ENROLLMENT, this.onChange);
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);
        }

    }),


    /**
     * The root of the course page for
     * normal users of the course. This includes
     * anyone who is not enrolled in the course.
     */
    Root_User = React.createClass({
        
        render: function() {
            var course = this.props.course,
                menu = [
                    (<a href="#">Logout</a>)
                ];

            return (
                <div className="main">
                    <HeaderLayout.Header menu={ menu } />
                    <div className="content-wrapper">
                        <CourseDashboard course={ course } />
                        <Sections_User course={ course } />
                    </div>
                    
                </div>
            );
        },

        onChange: function() {
            this.forceUpdate();
        },

        componentWillMount: function() {
            Stores.CourseStore().on(Constants.Event.CHANGED_ENROLLMENT, this.onChange);
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.onChange);
        },

        componentWillUnmount: function() {
            Stores.CourseStore().removeListener(Constants.Event.CHANGED_ENROLLMENT, this.onChange);
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.onChange);
        }

    }),

    /**
     * The dashboard under the header element
     * containing any other aside information
     * for the course.
     *
     * @module Layout
     * @submodule Course
     * @class Dashboard
     */
    CourseDashboard = React.createClass({
        
        render: function() {
            var user = UserStore.query().currentUser().getOne(),
                course = this.props.course,

                renderEnrollButton,
                enrollCount = UserStore.query().usersForCourse(course).getAll().length;

            if (this.props.isOwner) {
                renderEnrollButton = null;
            } 
            else if (user.isEnrolled(course)) {
                renderEnrollButton = <UnenrollButton />;
            }
            else {
                renderEnrollButton = <EnrollButton />;
            }

            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>{ course.get('alias') }</Dashboard.Summary.Header>

                        <Dashboard.Summary.Subheader>{ course.get('name') }</Dashboard.Summary.Subheader>

                        <Dashboard.Summary.Details>
                            <div>
                                Created { Formatter.Date.format(course.createdAt) }
                            </div>
                            <div>{ enrollCount } enrolled</div>
                        </Dashboard.Summary.Details>
                    </Dashboard.Summary>
                    
                    <Dashboard.Buttons>
                        { renderEnrollButton }
                    </Dashboard.Buttons>

                </Dashboard>
            );
        }

    }),


    /**
     * The enroll button allowing a user to enroll in a
     * course.
     *
     * @module Layout
     * @submodule Course
     * @class EnrollButton
     */
    EnrollButton = React.createClass({

        render: function() {
            return (
                <button onClick={ this.onClick }
                        type="button" 
                        className="pure-button blue-button large-button">
                    Enroll
                </button>
            );
        },

        onClick: function() {
            Action(Constants.Action.ENROLL_CURRENT_USER, { courseId: PageStore.courseId() }).send();
        },

    }),


    /**
     * The unenroll button allowing a user to unenroll
     * from a course.
     *
     * @module Layout
     * @submodule Course
     * @class UnenrollButton
     */
    UnenrollButton = React.createClass({

        render: function() {
            return (
                <button onClick={ this.onClick }
                        type="button"
                        className="pure-button red-button large-button">
                    Unenroll
                </button>
            );
        },

        onClick: function() {
            Action(Constants.Action.UNENROLL_CURRENT_USER, { courseId: PageStore.courseId() }).send();
        }

    }),


    AllQuestionsButton = React.createClass({

        render: function () {
            return (
                <button type="button"
                        className="pure-button blue-button large-button">
                    View All Questions
                </button>
            );
        }

    }),


    Sections_Owner = React.createClass({

        render: function () {
            return (
                <SectionSet>
                    <Sections_Description course={ this.props.course }/>
                    <Sections_Overview course={ this.props.course } />
                    <Sections_MyQuestions course={ this.props.course }/>
                    <Sections_FlaggedQuestions course={ this.props.course } />
                </SectionSet>
            );
        }


    }),


    Sections_User = React.createClass({

        render: function () {
            return (
                <SectionSet>
                    <Sections_Description course={ this.props.course }/>
                    <Sections_Overview course={ this.props.course } />
                    <Sections_MyQuestions course={ this.props.course }/>
                </SectionSet>
            );
        }

    }),


    Sections_Description = React.createClass({

        render: function () {
            var course = this.props.course,
                tags = course.get('tags'),
                renderTags = (tags.length) ?
                    (
                        <div className="tag-list" style={ { marginLeft: '2em', fontSize: '1.4em' } }>
                            <TagSet>
                                {   tags.map(function (tag) {
                                        return <TagSet.Tag key={ tag.id } tag={ tag } />;
                                    })
                                }
                            </TagSet>
                        </div>
                    ) : 
                    (null);

            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>Description</SectionSet.Section.Header>
                    <div className="divide"></div>
                    <SectionSet.Section.Subsection>
                        <p className="section__paragraph">{ course.get('description') }</p>
                        { renderTags }
                    </SectionSet.Section.Subsection>
                                     
                </SectionSet.Section>
            );
        }

    }),


    Sections_Overview = React.createClass({
        
        render: function () {
            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>Overview</SectionSet.Section.Header>
                    <div className="divide" />
                    <Sections_Overview_ByTopic course={ this.props.course } />
                    <Sections_Overview_TakeExam course={ this.props.course } />
                </SectionSet.Section>
            );
        }

    }),


    Sections_Overview_ByTopic = React.createClass({

        getInitialState: function () {
            // Load the colors of the different topics.
            return { colors: ['#0001d6', '#EC0000', '#FFFF00', '#01af00', '#681eab' ] };
        },

        render: function () {
            var course = this.props.course,
                // An array of colors, each topic is assigned a color.
                colors = this.state.colors,
                topics = TopicStore.query().topicsForCourse(course).getAll(),

                renderTopicLegend = (topics.length) ? (
                        <div className="question-data__legend pure-u-1 pure-u-md-3-5 pure-u-lg-3-4">
                            {
                                topics.map(function (topic, index) {
                                    return (
                                        <Sections_Overview_ByTopic_LegendItem key={ topic.id }
                                                                              color={ colors[index] }
                                                                              topic={ topic } />
                                    );
                                })
                            }
                        </div>
                    ) : (null),

                renderTopicCount = (topics.length === 1) ?
                    (<span>There is <span className="emphasis">1 topic</span> of questions</span>) :
                    (<span>There are <span className="emphasis">{ topics.length } topics</span> of questions</span>);

            return (
                <SectionSet.Section.Subsection>
                    <SectionSet.Section.Subsection.Header>
                        { renderTopicCount }
                    </SectionSet.Section.Subsection.Header>
                    <div className="question-data pure-g">
                        <div className="question-data__pie-chart-wrapper pure-u-1 pure-u-md-2-5 pure-u-lg-1-4">
                            <canvas className="question-data__pie-chart"
                                    id="js-question-data__pie-chart">
                            </canvas>
                        </div>
                        { renderTopicLegend }
                    </div>
                </SectionSet.Section.Subsection>
            );
        },

        componentDidMount: function () {
            this.renderPieChart();
            window.addEventListener("resize", this.renderPieChart);
        },

        componentWillUnmount: function () {
            window.removeEventListener("resize", this.renderPieChart);
        },

        renderPieChart: function () {
            // TODO: If there are too many topics, should render
            // "other" section. Limiting to 5 topics max.
            var colors = this.state.colors,
                course = this.props.course,
                topics = TopicStore.query().topicsForCourse(course).getAll(),
                data = topics.map(function (topic, index) {
                    var questions = QuestionStore.query()
                                                 .questionsNotDisabled()
                                                 .questionsForTopics(topic)
                                                 .getAll();
                    return {
                        color: colors[index],
                        value: questions.length
                    };

                }),

                canvas = document.getElementById('js-question-data__pie-chart'),
                context = canvas.getContext('2d'),
                chart = new widgets.PieChart(context, data);
                
                // Set the width and height of the canvas.
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                chart.render();
        }

    }),


    Sections_Overview_ByTopic_LegendItem = React.createClass({

        render: function () {
            var topic = this.props.topic,
                color = this.props.color,
                questions = QuestionStore.query()
                                          .questionsNotDisabled()
                                          .questionsForTopics(topic)
                                          .getAll(),

                questionCount = questions.length,

                renderQuestionCount = (questionCount === 1)
                    ? "1 question" : questionCount + " questions";

            return (
                <div className="question-data__legend__item">
                    <div className="question-data__legend__item__color"
                          style= { { backgroundColor: color } } ></div>
                    <div className="question-data__legend__item__text">
                        <span className="question-data__legend__item__text__topic">
                            { topic.get('name') }
                        </span>
                        <span className="question-data__legend__item__text__question">
                            { renderQuestionCount }
                        </span>
                    </div>   
                </div>
            );
        }

    }),


    Sections_Overview_TakeExam = React.createClass({

        render: function () {
            var course = this.props.course,
                questions = QuestionStore.query()
                                         .questionsNotDisabled()
                                         .questionsForCourse(course)
                                         .getAll();

            // Note that if there are no topics, there can be
            // no questions. This also takes care of the case where
            // there are no topics.
            if (questions.length === 0) {
                return (<Sections_Overview_TakeExam_Issue issue={ "You cannot take a practice exam " +
                                                                  "because there are no questions for " +
                                                                  "this course." } />);
            }
            else {
                return (<Sections_Overview_TakeExam_Content course={ course } />);
            }
        }

    }),


    /**
     * The component that a user interacts with if they want to
     * configure the options for taking an exam and start the
     * exam taking process.
     *
     * NOTE: This component assumes that there is at least 1 question
     * for this course.
     */
    Sections_Overview_TakeExam_Content = React.createClass({

        getInitialState: function () {
            var
                user = UserStore.query().currentUser().getOne(),
                course = this.props.course,
                topics = TopicStore.query().topicsForCourse(course).getAll(),

                // "topics" is an object that maps topic id's to boolean
                // flags that are true if the topic is selected, false otherwise.
                // "otherFilters" is an object that maps the name of the filter
                // to a boolean flag indicating if the filter is selected.
                initialState = {

                    // Set the defaults of these filters to false,
                    // indicating that these questions should not be
                    // removed from the set. Note that checking the filter
                    // will cause the filter to NOT be added to the list of
                    // filters.
                    otherFilters: {
                        questionsNotFlagged: {
                            isChecked: true,
                            params: []
                        },
                        questionsNotByUser: {
                            isChecked: true,
                            params: [ user ]
                        }

                    },
        
                    // An array of selected topic ids.
                    topicIds: topics.map(function (topic) {return topic.id;})

                },

                examRunRequest = Request.CreateExamRun();

            examRunRequest.set('course', Request.ObjectType('Course', course.id));
            examRunRequest.addQuery("questionsForTopics", topics);

            initialState.examRunRequest = examRunRequest;

            return initialState;
        },

        /**
         * Get the number of questions the
         * user has selected.
         */
        getSelectedCount: function () {
            // If the user has not explicitly set the number of
            // questions they would like their exam to take, then
            // let the exam be all the questions that are available.
            return this.state.selected || this.remainingQuestions().length;
        },

        /**
         * An array of all the questions before any filters
         * are applied.
         */
        allQuestions: function () {
            return QuestionStore.query()
                                .questionsNotDisabled()
                                .questionsForCourse(this.props.course)
                                .getAll();
        },

        /**
         * An array of all the questions that are left after all
         * the filters have been applies.
         */
        remainingQuestions: function () {
            return this.state.examRunRequest.getAllQuestions(
                    QuestionStore.query()
                                 .questionsNotDisabled()
                                 .questionsForCourse(this.props.course));
        },

        /***********************************\
                      Rendering
        \***********************************/

        render: function () {
            // TODO: STATE IS VERY DELICATE HERE! NEED TO MAKE SURE THAT THE
            // EXAM RUN REQUEST ALWAYS HAS THE CORRECT BASE QUERY.
            var state = this.state,
                course = this.props.course,
                
                totalQuestionCount = this.allQuestions().length,

                remainingQuestionCount = this.remainingQuestions().length,
                selectedQuestionCount = this.getSelectedCount(),

                topics = TopicStore.query().topicsForCourse(course).getAll(),

                renderQuestionCount = (totalQuestionCount === 1) ?
                    (<span>There is only <span className="emphasis">1 question.</span></span>) :
                    (<span>There are <span className="emphasis">{ totalQuestionCount } questions</span> total.</span>),

                // Note: We can assume that there is at least 1 topic filter.
                renderTopicFilters = topics.map(function (topic) {
                    return (
                        <div key={ "topic-filter-" + topic.id } className="pure-u-1 pure-u-md-1-2">
                            <FormLayout.Checkbox name="topic-filter"
                                                 checked={ Util.contains(state.topicIds, topic.id) }
                                                 value={ topic.id }
                                                 onChange={ this.onClickTopicFilter } >
                                { topic.get('name') }
                            </FormLayout.Checkbox>
                        </div>
                    );
                }.bind(this)),

                renderRemainingQuestionCount = (remainingQuestionCount === 1) ?
                    (<span><span className="emphasis">Only 1 question</span> after applying filters.</span>) :
                    (<span><span className="emphasis">{ remainingQuestionCount } questions</span> after applying filters.</span>);

            return (
                <SectionSet.Section.Subsection>
                    <SectionSet.Section.Subsection.Header>
                        { renderQuestionCount }
                    </SectionSet.Section.Subsection.Header>
                    <div className="question-filter">
                        <div className="question-filter__section question-filter__bar-wrapper">
                            <canvas id="js-question-filter__bar"
                                    className="question-filter__bar"></canvas>
                        </div>
                        <div className="question-filter__section question-filter__description">
                            <div>{ renderRemainingQuestionCount }</div>
                            <div>
                                <strong>
                                    <span className="inline-button" onClick={ this.onClickTakeExam } >Click here</span>
                                </strong> to take a practice exam with
                                <Sections_Overview_TakeExam_Content_SelectQuestionsInput onChange={ this.onChangeSelected }
                                                                                         maxValue={ remainingQuestionCount }
                                                                                         value={ selectedQuestionCount } />questions.
                            </div>
                        </div>
                    </div>
                    <div className="question-filter__section question-filter__form pure-g">
                        <div className="pure-u-1 pure-u-md-1-2">
                            <h4>Topics</h4>
                            <div className="question-filter__form__filters pure-g">
                                { renderTopicFilters }
                            </div>
                        </div>
                        <div className="pure-u-1 pure-u-md-1-2">
                            <h4>Filters</h4>
                            <div className="question-filter__form__filters pure-g">
                                <FormLayout.Checkbox name="other-filter"
                                                     checked={ state.otherFilters.questionsNotFlagged.isChecked }
                                                     value="questionsNotFlagged"
                                                     onChange={ this.onClickOtherFilter } >
                                    Include Flagged Questions
                                </FormLayout.Checkbox>
                                <FormLayout.Checkbox name="other-filter"
                                                     checked={ state.otherFilters.questionsNotByUser.isChecked }
                                                     value="questionsNotByUser"
                                                     onChange={ this.onClickOtherFilter } >
                                    Include My Questions
                                </FormLayout.Checkbox>
                            </div>
                        </div> 
                    </div>
                </SectionSet.Section.Subsection>
            );
        },

        renderProgressBar: function () {
            var
                course = this.props.course,
                canvas = document.getElementById('js-question-filter__bar'),
                context = canvas.getContext('2d'),
                data,
                bar = this.state.bar;

            data = {
                total: this.allQuestions().length,
                current: this.remainingQuestions().length,
                selected: this.remainingQuestions().length
            };

            // Lazy instantiation of the bar.
            if (!bar) {
                bar = new widgets.ProgressBar(context, data);
            }
            else {
                // Change the data of the current bar.
                bar.reset(data);
            }
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            bar.render();

            this.setState({ bar: bar });
        },

        /***********************************\
                     Life Cycle
        \***********************************/

        componentDidMount: function () {
            this.renderProgressBar();
            window.addEventListener('resize', this.renderProgressBar);
            QuestionStore.on(Constants.Event.CHANGED_DISABLE_QUESTION_STATE, this.renderProgressBar);
            PageStore.on(Constants.Event.CHANGED_MODE, this.renderProgressBar);
            QuestionStore.on(Constants.Event.DELETED_QUESTION, this.renderProgressBar);
        },

        componentWillUnmount: function () {
            window.removeEventListener('resize', this.renderProgressBar);
            QuestionStore.removeListener(Constants.Event.CHANGED_DISABLE_QUESTION_STATE, this.renderProgressBar);
            PageStore.removeListener(Constants.Event.CHANGED_MODE, this.renderProgressBar);
            QuestionStore.removeListener(Constants.Event.DELETED_QUESTION, this.renderProgressBar);
        },

        /***********************************\
                    Event Handling
        \***********************************/
 
        onClickTakeExam: function () {
            console.log("Action handler called");
            var examRunRequest = this.state.examRunRequest,
                courseId = this.props.course.id;

            examRunRequest.set('numOfQuestions', this.state.selected);
            Action(Constants.Action.LOAD_EXAM_RUN, { examRunRequest: examRunRequest })
                .route("/course/<courseId>/exam", { courseId: courseId })
                .send();
        },


        onChangeSelected: function (event) {
            // Animate the changes to the selected bar value.
            this.setState({ selected: + (event.target.value) });
        },

        /**
         * Handles click event for if the user changes
         * which topics are selected for taking an exam.
         */
        onClickTopicFilter: function (event) {
            var topicId = event.target.value,
                state = this.state,
                topics,
                current;

            if (Util.contains(state.topicIds, topicId)) {
                // The topic id is in the array so it is included
                // in the questions. Remove it from the array.
                state.topicIds = Util.remove(state.topicIds, topicId);
            }
            else {
                // The topic id is not in the array so toggle
                // the topic on. Add it to the array.
                state.topicIds.push(topicId);
            }

            topics = TopicStore.query().topicsForIds(state.topicIds).getAll();

            this.state.examRunRequest.removeQuery("questionsForTopics");
            this.state.examRunRequest.addQuery("questionsForTopics", topics);
            this.setState(state);

            // Query the remaining questions after changing the state.
            current = this.remainingQuestions().length;

            state.bar.change({ current: current, selected: current }, { animate: true });
        },

        /**
         * Handles click event for if the user changes
         * the filters for the questions.
         */
        onClickOtherFilter: function (event) {
            var filterName = event.target.value,
                state = this.state,
                selected;

            // Toggle "isChecked".
            state.otherFilters[filterName].isChecked = !state.otherFilters[filterName].isChecked;

            if (state.otherFilters[filterName].isChecked) {
                state.examRunRequest.removeQuery(filterName);
            }
            else {
                state.examRunRequest.addQuery(filterName,
                                              state.otherFilters[filterName].params);
            }

            // Get the remaining questions after making changes to the state.
            selected = this.remainingQuestions().length;
            state.bar.change({ selected: selected, current: selected }, { animate: true });
            this.setState(state);
        },

    }),


    /**
     * A react component allowing the user to select
     * the number of questions for their exam.
     */
    Sections_Overview_TakeExam_Content_SelectQuestionsInput = React.createClass({

        getInitialState: function () {
            return { };
        },

        getValue: function () {
            // If there is a value in the state, then use
            // that value. Otherwise, use the value that was
            // passed from the parent.
            if (+this.state.value !== +this.state.value) {
                return this.props.value || 0;
            }
            return this.state.value;            
        },

        /**
         * Check if the value entered in the input are
         * valid.
         */
        isValid: function (value) {
            var maxValue = this.props.maxValue;

            // Check if the value is an integer
            if (+value !== +value) {
                return false;
            }

            if (value > this.props.maxValue) {
                return false;
            }

            return value > 0;
        },

        render: function () {
            var value = this.getValue(),

                style = (this.isValid(value)) ?
                    ({ border: 'solid #CCC 1px'}) :
                    ({ border: 'solid #EC0000 1px', outlineColor: '#EC0000' });

            return (
                <input className="pure-input-1 inline-input--small"
                       style={ style }
                       onChange={ this.onChangeSelected }
                       type="text"
                       value={ value.toString() } />
            );
        },

        /***********************************\
                    Event Handling
        \***********************************/

        /**
         * An event that listens for when the value in the input field
         * is changed.
         */
        onChangeSelected: function (event) {
            this.setState({ value: event.target.value });
            if (this.isValid(event.target.value) && this.props.onChange) {
                // Notify the parent of input changing to a
                // valid value.
                this.props.onChange(event);
            }
        }

    }),


    /**
     * This component is rendered instea of the
     * Sections_Overview_TakeExam_Issue.
     */
    Sections_Overview_TakeExam_Issue = React.createClass({

        render: function () {
            return (
                <SectionSet.Section.Subsection>
                    <SectionSet.Section.Error>
                        { this.props.issue }
                    </SectionSet.Section.Error>
                </SectionSet.Section.Subsection>
            );
        }

    }),


    /**
     * A section containing all the questions that the
     * current user has written. This will allow the user
     * to modify their own questions.
     */
    Sections_MyQuestions = React.createClass({

        render: function () {
            var user = UserStore.query().currentUser().getOne(),
                course = this.props.course,
                questions = QuestionStore.query()
                                         .questionsForCourse(course)
                                         .questionsByUser(user)
                                         .sortByDescendingCreationDate()
                                         .getAll();

            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>My Questions</SectionSet.Section.Header>
                    <div className="divide" />
                    <SectionSet.Section.Subsection>
                        <h3>
                            <span className="inline-button"
                                  onClick={ this.onClickCreateQuestion }>Click here</span> to create a new question.
                        </h3>
                        <QuestionLayout.UserQuestionList questions={ questions } />
                    </SectionSet.Section.Subsection>
                </SectionSet.Section>
            );
        },

        onClickCreateQuestion: function () {
            Action(Constants.Action.TO_MODE_CREATE_QUESTION).send();
        },


    }),


    Sections_FlaggedQuestions = React.createClass({

        render: function () {
            var questions = QuestionStore.query().questionsFlagged().sortByDescendingFlagCount().getAll();
            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>Flagged Questions</SectionSet.Section.Header>
                    <div className="divide" />
                    <SectionSet.Section.Subsection>
                        <QuestionLayout.OwnerQuestionList questions={ questions } />
                    </SectionSet.Section.Subsection>
                </SectionSet.Section>
            );
        }

    });

module.exports = {
    Root: Root
};

