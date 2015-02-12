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

    Stores = require('../stores'),
    CourseStore = Stores.CourseStore(),
    PageStore = Stores.PageStore(),
    QuestionStore = Stores.QuestionStore(),
    TopicStore = Stores.TopicStore(),
    UserStore = Stores.UserStore(),

    Formatter = require('../formatter.js'),

    Action = require('shore').Action,
    Constants = require('../constants.js'),
    Router = require('shore').Router,

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
            var user = UserStore.getOne(UserStore.query.current()),
                courseId = PageStore.courseId(),
                course = CourseStore.getOne(CourseStore.query.filter.courseWithId(courseId));

            if (user.isOwner(course)) {
                return <Root_Owner course={course} />;
            }
            else {
                return <Root_User course={course} />;
            }
        }

    }),


    /**
     * The root of the course page for
     * owners of the course.
     */
    Root_Owner = React.createClass({

        render: function() {
            var course = this.props.course
                menu = [
                    (<a href="#">Logout</a>)
                ];

            return (
                <div className="main">
                    <HeaderLayout.Header menu={ menu } />
                    <div className="content-wrapper">
                        <CourseDashboard course={ course } />
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
            var user = UserStore.getOne(UserStore.query.current()),
                course = this.props.course,

                renderEnrollButton = (user.isEnrolled(course)) ? 
                    (<UnenrollButton />) : (<EnrollButton />);

            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>{ course.get('alias') }</Dashboard.Summary.Header>

                        <Dashboard.Summary.Subheader>{ course.get('name') }</Dashboard.Summary.Subheader>

                        <Dashboard.Summary.Details>
                            <div>Created 2 weeks ago</div>
                            <div>27 enrolled</div>
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
            Action.send(Constants.Action.ENROLL_CURRENT_USER, { courseId: PageStore.courseId() });
        }

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
            Action.send(Constants.Action.UNENROLL_CURRENT_USER, { courseId: PageStore.courseId() });
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
                topics = TopicStore.getAll(TopicStore.query.filter.topicsForCourse(course)),

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
                topics = TopicStore.getAll(TopicStore.query.filter.topicsForCourse(course)),
                data = topics.map(function (topic, index) {
                    var questions =
                            QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                 QuestionStore.query.filter.questionsForTopics(topic));

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
                questions = QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                 QuestionStore.query.filter.questionsForTopics(topic)),
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
                questions = QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                 QuestionStore.query.filter.questionsForCourse(course));

            // Note that if there are no topics, there can be
            // no questions. This also takes care of the case where
            // there are no topics.
            if (questions.length === 0) {
                return (<Sections_Overview_TakeExam_Issue issue="You cannot take a practice exam because there are no questions for this course." />);
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
                user = UserStore.getOne(UserStore.query.current()),
                course = this.props.course,
                topics = TopicStore.getAll(TopicStore.query.filter.topicsForCourse(course)),

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
                            filter: QuestionStore.query.filter.questionsNotFlagged()
                        },
                        questionsNotByUser: {
                            isChecked: true,
                            filter: QuestionStore.query.filter.questionsNotByUser(user)
                        }

                    },
        
                    // Add all the topics to the initial state, default as true.
                    topics: topics.reduce(function (topicHash, topic) {
                        topicHash[topic.id] = true;
                        return topicHash;
                    }, {})

                };

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
         * An array of all the questions that are left after all
         * the filters have been applies.
         */
        remainingQuestions: function () {
            var course = this.props.course,
                allQuestions = QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                    QuestionStore.query.filter.questionsForCourse(course)),
                otherFiltersHash = this.state.otherFilters,
                topicsHash = this.state.topics,
                // Start with a filter of non-disabled questions.
                questionFilters = [ QuestionStore.query.filter.questionsNotDisabled() ],
                topicIds = [],
                selectedTopics = [],
                prop;

            for (prop in this.state.topics) {
                if (topicsHash.hasOwnProperty(prop)) {
                    // If the topic is selected, then add it to the array.
                    if (topicsHash[prop]) {
                        topicIds.push(prop);
                    }
                }
            }

            // Filter out the selected topic ids.
            selectedTopics = TopicStore.getAll(TopicStore.query.filter.topicsForCourse(course),
                                               TopicStore.query.filter.topicsForIds.apply(null, topicIds));

            // Add the selected topics to the question filters.
            questionFilters.push(
                QuestionStore.query.filter.questionsForTopics.apply(null, selectedTopics));

            for (prop in otherFiltersHash) {

                if (otherFiltersHash.hasOwnProperty(prop)) {
                    // Perform these filters only if they are not checked.
                    if (!otherFiltersHash[prop].isChecked) {
                        questionFilters.push(otherFiltersHash[prop].filter);
                    }
                }
            }

            // Apply all the filters and get out any relevant questions.
            return QuestionStore.getAll.apply(QuestionStore, questionFilters);
        },

        /***********************************\
                      Rendering
        \***********************************/

        render: function () {
            var state = this.state,
                course = this.props.course,
                
                totalQuestionCount = QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                          QuestionStore.query.filter.questionsForCourse(course)).length,
                remainingQuestionCount = this.remainingQuestions().length,
                selectedQuestionCount = this.getSelectedCount(),

                topics = TopicStore.getAll(TopicStore.query.filter.topicsForCourse(course)),

                renderQuestionCount = (totalQuestionCount === 1) ?
                    (<span>There is only <span className="emphasis">1 question.</span></span>) :
                    (<span>There are <span className="emphasis">{ totalQuestionCount } questions</span> total.</span>),

                // Note: We can assume that there is at least 1 topic filter.
                renderTopicFilters = topics.map(function (topic) {
                    return (
                        <div className="pure-u-1 pure-u-md-1-2">
                            <FormLayout.Checkbox name="topic-filter"
                                                 checked={ state.topics[topic.id] }
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
                                    <span className="inline-button">Click here</span>
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
                questions = QuestionStore.getAll(QuestionStore.query.filter.questionsNotDisabled(),
                                                 QuestionStore.query.filter.questionsForCourse(course)),

                canvas = document.getElementById('js-question-filter__bar'),
                context = canvas.getContext('2d'),
                data = {
                    total: questions.length,
                    current: this.remainingQuestions().length,
                    selected: this.remainingQuestions().length
                },

                bar = this.state.bar;

            console.log("DATA: " + JSON.stringify(data));
            // Lazy instantiation of the bar.
            if (!this.state.bar) {
                bar = new widgets.ProgressBar(context, data);
            }

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            bar.render();

            this.setState({ bar: bar });
        },

        /***********************************\
                    Event Handling
        \***********************************/
 
        onChangeSelected: function (event) {
            // Animate the changes to the selected bar value.
            this.setState({ selected: +(event.target.value) });
        },


        /**
         * Handles click event for if the user changes
         * which topics are selected for taking an exam.
         */
        onClickTopicFilter: function (event) {
            var topicId = event.target.value,
                state = this.state,
                current;

            // Toggle topic flag.
            state.topics[topicId] = !state.topics[topicId];
            // Query the remaining questions after changing the state.
            current = this.remainingQuestions().length
            // The current value is less than the number
            // of questions the user has selected. Need to decrement the
            // questions the user has selected.
            this.setState(state);

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
            // Get the remaining questions after making changes to the state.
            selected = this.remainingQuestions().length;
            state.bar.change({ selected: selected, current: selected }, { animate: true });
            this.setState(state);
        },

        /***********************************\
                     Life Cycle
        \***********************************/

        componentDidMount: function () {
            this.renderProgressBar();
            window.addEventListener('resize', this.renderProgressBar);
        },

        componentWillUnmount: function () {
            window.removeEventListener('resize', this.renderProgressBar);
        }

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

            console.log("IsValid " + this.isValid(value));
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
                console.log("Calling parent!");
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
            var user = UserStore.getOne(UserStore.query.current()),
                questions = QuestionStore.getAll(QuestionStore.query.filter.questionsByUser(user));


            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>My Questions</SectionSet.Section.Header>
                    <div className="divide" />
                    <SectionSet.Section.Subsection>
                        <h3><span className="inline-button">Click here</span> to create a new question.</h3>
                        <QuestionList questions={ questions } />
                    </SectionSet.Section.Subsection>
                </SectionSet.Section>
            );
        }

    }),


    Sections_FlaggedQuestions = React.createClass({

        render: function () {
            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>Flagged Questions</SectionSet.Section.Header>
                    <div className="divide" />
                    <SectionSet.Section.Subsection>
                        <ul className="question-info-list">
                            <FlaggedQuestionItem key="needs key 1" />
                            <FlaggedQuestionItem key="needs key 2" />
                            <FlaggedQuestionItem key="needs key 3" />
                            <FlaggedQuestionItem key="needs key 4" />
                        </ul>
                    </SectionSet.Section.Subsection>
                </SectionSet.Section>
            );
        }

    }),


    QuestionList = React.createClass({

        render: function () {
            return (
                <ul className="question-info-list">
                    {
                        this.props.questions.map(function (question) {
                            return (<QuestionItem key={ question.id } question={ question } />);
                        })

                    }
                </ul>
            );
        }

    }),

    QuestionItem = React.createClass({

        render: function () {
            var question = this.props.question;

            return (
                <li className="pure-g">
                    <div className="pure-u-1">
                        <ul className="question-item__issue-list">
                            <li className="question-item__issue-list__item--error">
                                <i className="fa fa-exclamation-circle"></i>
                                <div className="question-item__issue-list__item--error__message">
                                    This question has been disabled by the owner of the course.
                                </div>
                            </li>
                            <li className="question-item__issue-list__item--warning">
                                <i className="fa fa-exclamation-triangle"></i>
                                <div className="question-item__issue-list__item--warning__message">
                                    This question has been flagged by <strong>3 people</strong>.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="question-topic pure-u-1">
                        <span className="question-topic__content">{ question.get('topic').get('name') }</span>
                    </div>
                    <div className="pure-u-1">
                        <div className="question-item__icon-set--2 pure-g">
                            <div className="pure-u-1-2 question-item__icon-set__item--bad clickable"><i className="fa fa-trash"></i></div>
                            <div className="pure-u-1-2 question-item__icon-set__item--good clickable"><i className="fa fa-pencil-square-o"></i></div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo question={ question } />
                        </div>
                    </div>
                </li>
            );
        }

    }),


    QuestionItem_Edit = React.createClass({

        render: function () {
            return (
                <li className="pure-g">
                    <div className="pure-u-1">
                        <ul className="question-item__issue-list">
                            <li className="question-item__issue-list__item--error">
                                <i className="fa fa-exclamation-circle"></i>
                                <div className="question-item__issue-list__item--error__message">
                                    This question has been disabled by the owner of the course.
                                </div>
                            </li>
                            <li className="question-item__issue-list__item--warning">
                                <i className="fa fa-exclamation-triangle"></i>
                                <div className="question-item__issue-list__item--warning__message">
                                    This question has been flagged by <strong>3 people</strong>.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="question-topic pure-u-1">
                        <span className="question-topic__content">
                            <FormLayout.Select options={ ["Algorithms",
                                                          "Java Syntax",
                                                          "Compilter/Runtime Errors",
                                                          "Looping Constructs" ] } />
                        </span>
                    </div>
                    <div className="pure-u-1">
                        <div className="question-item__icon-set--2 pure-g">
                            <div className="pure-u-1-2 question-item__icon-set__item--bad clickable"><i className="fa fa-minus-circle"></i></div>
                            <div className="pure-u-1-2 question-item__icon-set__item--good clickable"><i className="fa fa-floppy-o"></i></div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo_Edit />
                        </div>
                    </div>
                </li>
            );
        }

    }),


    FlaggedQuestionItem = React.createClass({

        render: function () {
            return (
                <li>
                    <div className="pure-g">
                        <div className="pure-u-1">
                            <ul className="question-item__issue-list">
                                <li className="question-item__issue-list__item--warning">
                                    <i className="fa fa-exclamation-triangle"></i>
                                    <div className="question-item__issue-list__item--warning__message">
                                        This question has been flagged by <strong>4 people</strong>.
                                    </div>
                                </li>
                            </ul>
                        </div>
                            <div className="pure-u-1">
                            <div className="question-item__icon-set--1 pure-g">
                                <div className="pure-u-1 question-item__icon-set__item--bad clickable"><i className="fa fa-ban"></i></div>
                            </div>
                            <div className="question-item__content"><QuestionInfo /></div>
                        </div>
                    </div>
                </li>
            );
        }

    }),


    QuestionDivide = React.createClass({

        render: function () {
            return (
                <li className="divide gray-divide"></li>
            );
        }

    }),


    QuestionInfo = React.createClass({

        render: function () {
            var 
                dummyQuestion = {
                    
                    get: function () {
                        return "Here is a question";
                    },

                    isCorrect: function () {
                        return false;
                    },

                    getOptions: function () {
                        return ["Option 1", "Option 2", "Option 3", "Option 4"];
                    }
                },
                question = this.props.question || dummyQuestion,
                options = question.getOptions();

            return (
                <div className="question-info">
                    <div className="question-info__ask">{ question.get('ask') }</div>
                    <ul className="multi-choice-info__options-list--lettered">
                        {
                            options.map(function (option, index) {
                                var
                                    className = (question.isCorrect(option)) ?
                                        ("multi-choice-info__options-list__item--correct") :
                                        ("multi-choice-info__options-list__item");

                                return (<li className={ className }
                                            key={ question.id + "-" + index.toString() }>
                                            { option }
                                        </li>);
                            })
                        }
                    </ul>
                    <div className="question-info__explanation">
                        Just because!
                    </div>
                </div>
            );
        }

    }),


    QuestionInfo_Edit = React.createClass({

        render: function () {
            return (
                <form className="question-info">
                    <div className="question-info__ask">
                        <FormLayout.TextInput placeholder="Enter Text here">
                            What is 2 + 2?
                        </FormLayout.TextInput>
                    </div>
                    <ul className="multi-choice-info__options-list">
                        <li className="multi-choice-info__options-list__item">
                            <FormLayout.RadioOption name="question-here" value="17">
                                <FormLayout.TextInput placeholder="Option 1">
                                    17
                                </FormLayout.TextInput>
                            </FormLayout.RadioOption>
                        </li>
                        <li className="multi-choice-info__options-list__item">
                            <FormLayout.RadioOption name="question-here" value="4">
                                <FormLayout.TextInput placeholder="Option 1">
                                    4
                                </FormLayout.TextInput>
                            </FormLayout.RadioOption>
                        </li>
                        <li className="multi-choice-info__options-list__item">
                            <FormLayout.RadioOption name="question-here" value="643">
                                <FormLayout.TextInput placeholder="Option 1">
                                    643
                                </FormLayout.TextInput>
                            </FormLayout.RadioOption>
                        </li>
                        <li className="multi-choice-info__options-list__item">
                            <FormLayout.RadioOption name="question-here" value="22">
                                <FormLayout.TextInput placeholder="Option 1">
                                    22
                                </FormLayout.TextInput>
                            </FormLayout.RadioOption>
                        </li>
                    </ul>
                    <div className="question-info__explanation--edit">
                        <FormLayout.TextAreaInput placeholder="Explanation" value="Just because!" />
                    </div>
                </form>
            );
        }

    }),


    /* OLD STYLING, KEEPING TO REUSE SOME FUNCTIONALITY IN HERE */

    /**
     * The list of questions that the user created, displayed inside
     * the Body_Exam element.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList
     */
    Body_Exam_QuestionList = React.createClass({

        render: function() {
            var questions = Stores.ExamStore().questionsForExam(Stores.ExamStore().current(),
                                                                Stores.UserStore().current()),
                listItems;

            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_QUESTION) {
                // In create question mode, set the first element
                // as a new question form..
                listItems = [<Body_Exam_QuestionList_MultiChoiceEditing key="new" />];
            }
            else {
                listItems = [];
            }

            questions.forEach(function(question) {
                // Check if we are editing this question.
                if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION &&
                    Stores.PageStore().currentPayload().questionId === question.id) {

                    listItems.push(<Body_Exam_QuestionList_MultiChoiceEditing
                                                                key="new"
                                                                question={ question } />);
                }
                else {
                    listItems.push(<Body_Exam_QuestionList_MultiChoice
                                                                key={ question.id }
                                                                question={ question } />);
                }
            });

            return (
                <div className="exam-info__my-questions">
                    <span className="exam-info__my-questions__title">My Questions</span>
                    <Body_Exam_QuestionList_AddButton />
                    <ul className="exam-info__my-questions__question-list question-list">
                         { listItems }
                    </ul>
                </div> 
            );
        },


        didFetchExams: function() {
            this.forceUpdate();
        },


        didCreateQuestion: function(event) {
            this.forceUpdate();
        },


        changedMode: function(event) {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.ExamStore().on(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().on(Constants.Event.DID_CREATE_QUESTION, this.didCreateQuestion);
        },


        componentWillUnmount: function() {
            Stores.ExamStore().removeListener(Constants.Event.DID_FETCH_EXAMS, this.didFetchExams);
            Stores.ExamStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
            Stores.ExamStore().removeListener(Constants.Event.DID_CREATE_QUESTION, this.didCreateQuestion);
        }


    }),


    /**
     * The add button in the question list, allowing users to create
     * new questions.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_AddButton
     */
    Body_Exam_QuestionList_AddButton = React.createClass({

        render: function() {

            if (Stores.PageStore().currentMode()) {
                return (
                    <button type="button"
                            className="button small-button--positive exam-info__my-questions__add-button">
                        New
                    </button>
                );
            }
            else {
                return (
                    <button onClick={ this.onClick }
                            type="button"
                            className="button small-button--positive exam-info__my-questions__add-button">
                        New
                    </button>
                );
            }
        },

        changedMode: function(event) {
            this.forceUpdate();
        },

        onClick: function() {
            Action.send(Constants.Action.TO_MODE_CREATE_QUESTION, { examId: Stores.ExamStore().current().id });
        },

        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
        },

        componentWillUnmount: function() {
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
        }

    }),


    /**
     * A list item in the question list of an exam. This represents
     * a question that is a multiple choice question.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice.
     * @private
     */
    Body_Exam_QuestionList_MultiChoice = React.createClass({

        render: function() {
            // NOTE: This is hard-coded for multiple-choice questions.
            // Change this if adding other types of questions.
            var question = this.props.question,
                explanationStyle= {
                    textDecoration: 'underline',
                    marginRight: '3px'
                };

            if (Stores.PageStore().currentMode()) {
                return (
                    <li className="question">
                        <img className="question__icon--edit" src="/img/icons/edit.png" />
                        <img className="question__icon--delete" src="/img/icons/delete.png" />
                        <div className="question__content">
                            <div className="question__ask">{ question.get('question') }</div>
                            <Body_Exam_QuestionList_MultiChoice_Option question={ question } />
                        </div>
                        <div className="question__explain">
                            <span style= { explanationStyle }>Explanation:</span>
                            <span>{ question.get('explanation') }</span>
                        </div>
                    </li>
                );
            }
            else {
                return (
                    <li className="question">
                        <img onClick={ this.onEdit }
                             className="question__icon--edit"
                             src="/img/icons/edit.png" />
                        <img onClick={ this.onDelete }
                             className="question__icon--delete" src="/img/icons/delete.png" />
                        <div className="question__content">
                            <div className="question__ask">{ question.get('question') }</div>
                            <Body_Exam_QuestionList_MultiChoice_Option question={ question } />
                        </div>
                        <div className="question__explain">
                            <span style= { explanationStyle }>Explanation:</span>
                            <span>{ question.get('explanation') }</span>
                        </div>
                    </li>
                );
            }
        },

        
        onEdit: function(event) {
            Action.send(Constants.Action.TO_MODE_EDIT_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        },


        onDelete: function(event) {
            Action.send(Constants.Action.TO_MODE_DELETE_QUESTION,
                        {
                            examId: Stores.ExamStore().current().id,
                            questionId: this.props.question.id
                        });
        }


    }),


    /**
     * A multiple choice item in an exam's question list. This is for
     * multiple choice questions that are being edited.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing = React.createClass({

        getInitialState: function() {
            // Find the index of the solution.
            // If there is no question passed in, then this
            // form is for creating a new question.
            var question = this.props.question,
                isNewQuestion = !question,
                options = (!isNewQuestion) ? question.getOptions() : ["","","",""],
                solutionIndex = -1, i, n;

            // Find the index of the current solution.
            for (i = 0, n = options.length; (i < n && !isNewQuestion); ++i) {
                if (question.isCorrect(options[i])) {
                    solutionIndex = i;
                }
            }

            if (solutionIndex === -1 && !isNewQuestion) {
                throw new Error("Solution could not be found for the question.");
            }

            if (isNewQuestion) {
                return {
                        solutionIndex: 3,
                        questionMap: {
                                        options: ["","","",""],
                                        question: "",
                                        explanation: "",
                                        solution: "",
                                        type: 1 
                                    }
                        };
            }
            // Not a new question, so the initial state depends on the question's
            // current fields.
            return { solutionIndex: solutionIndex,
                     questionMap: { options: this.props.question.getOptions() } };
        }, 


        render: function() {
            // Rendering a new question form if there was no question
            // passed in to edit.
            var question = this.props.question,
                isNewQuestion = !question,
                questionId = (!isNewQuestion) ? question.id : null,
                // This contains any updates to the state
                // of the current question while the user is
                // changing it.
                updatedQuestionMap = this.state.questionMap,

                // If the updated question map contains a field any of
                // the properties of a question, that means it is in the
                // process of being edited. Otherwise, just get the
                // property from the question object itself.
                // Note that if the question object is not passed
                // in as a parameter, this will always get the field
                // from the updatedQuestionMap due to how the initial
                // state was set.
                questionText = (updatedQuestionMap.question || updatedQuestionMap.question === "") ?
                                 updatedQuestionMap.question: question.get('question'),

                solution = (updatedQuestionMap.solution || updatedQuestionMap.solution === "") ?
                                 updatedQuestionMap.solution: question.get('solution'),

                explanation = (updatedQuestionMap.explanation || updatedQuestionMap.explanation === "") ?
                                 updatedQuestionMap.explanation: question.get('explanation'),
                // The updated question map will always contain
                // the set of options available, so no
                // need for a conditional check.
                options = updatedQuestionMap.options,
                explanationStyle= {
                    textDecoration: 'underline',
                    marginRight: '3px'
                },
                saveView = (this.isQuestionValid()) ?
                           <img onClick = { this.onSave }
                                className="question__icon--save"
                                src="/img/icons/save.png" /> :
                            // TODO: Modify styling to fade out
                            // save button.
                            <img className="question__icon--save"
                                 src="/img/icons/save.png" />,

                cancelView = <img onClick={ this.onClickCancel }
                                    className="question__icon--cancel"
                                    src="/img/icons/cancel.png" />;
            return (
                <li className="question">
                    <div> { saveView } </div>
                    <div> { cancelView } </div>
                    <div className="question__content">
                        <input onChange={ this.onChangeQuestion }
                               type="text"
                               placeholder="Ask a question (i.e. Why is the sky blue?)."
                               defaultValue={ questionText }
                               className="question__ask" />
                        <Body_Exam_QuestionList_MultiChoiceEditing_Option
                                                        onChangeText={ this.onChangeTextForOption }
                                                        onChangeRadio={ this.onChangeRadioForOption }
                                                        questionId={ questionId }
                                                        solution={ solution }
                                                        explanation={ explanation }
                                                        question={ questionText }
                                                        options={ options } />
                    </div>
                    <div className="question__explain">
                        <span style={ explanationStyle }>Explanation:</span>
                        <textarea onChange={ this.onChangeExplanation }
                                  rows="4"
                                  cols="50" 
                                  placeholder="Give an explanation to your solution."
                                  defaultValue={ explanation }>
                        </textarea>
                    </div>
                </li>
            );
        },


        onSave: function(event) {
            var map;
            if (!this.isQuestionValid()) {
                throw new Error("Trying to save an invalid question.");
            }
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.CREATE_QUESTION) {
                // Add the current exam to the question.
                map = Util.copy(this.state.questionMap);
                map.examId = Stores.ExamStore().current().id;
                Action.send(Constants.Action.CREATE_QUESTION,
                        {
                            questionMap: map
                        });
            }
            // Assume the current mode is the QUESTION_EDIT
            // mode.
            else {
                // TODO: Modify so that examId is
                // inside the questionMap.
                Action.send(Constants.Action.EDIT_QUESTION,
                        {
                            questionMap: this.state.questionMap
                        });
            }
            
        },


        onClickCancel: function() {
            if (Stores.PageStore().currentMode() === Stores.PageStore().Mode.EDIT_QUESTION) {
                Action.send(Constants.Action.FROM_MODE_EDIT_QUESTION);
            }
            else {
                Action.send(Constants.Action.FROM_MODE_CREATE_QUESTION);
            }
        },


        /**
         * Make sure that the question is in the correct form
         * for saving. A question is valid if: (1) there are no
         * repeating option values (every option is unique),
         * (2) the question has a question text that is not
         * empty, (3) the question has an explanation that is
         * non-empty, and (4) the question has a solution that is
         * non-empty.
         *
         * @method validateQuesion
         *
         * @return {Boolean} True if the question is ready
         *  to be saved, false otherwise.
         */
        isQuestionValid: function() {
            var questionMap = this.state.questionMap,
                question = this.props.question,
                // Since empty strings are falsey values we 
                // need to explicitly check if questionMap
                // properties are empty strings before we
                // set them to their default values
                questionText = (questionMap.question || questionMap.question === "") ? 
                                questionMap.question: question.get('question'),

                solution = (questionMap.solution || questionMap.solution === "") ?
                                questionMap.solution: question.get('solution'),

                explanation = (questionMap.explanation || questionMap.explanation === "") ?
                                questionMap.explanation: question.get('explanation'),
                // The updated question map will always contain
                // the set of options available, so no
                // need for a conditional check.
                options = questionMap.options,
                // A map containing the options. This is in
                // map form to make validation easier.
                optionsMap = {},
                value,
                i, n;

            // Check if there are any repeating options.
            for(i = 0, n = options.length; i < n; ++i) {
                // Create a hash containing a
                // particular option and check if
                // that value appears anywhere
                // else in the options list.
                value = options[i];
                // Make sure the option value is
                // not an empty string.
                if (value === "") {
                    return false;
                }
                if (optionsMap[value]) {
                    // The option already exists in the
                    // map, so an option is repeated,
                    // which means there are multiple
                    // options with the value.
                    return false;
                }
                optionsMap[value] = true;
            }
            // Check that the question, explanation, and solution are non-empty
            return ((questionText !== "") &&
                   (explanation !== "") &&
                   (solution !== ""));
        },


        onChangeQuestion: function(event) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.question = event.target.value.trim();
            this.setState({ questionMap: questionMap });
        },


        onChangeTextForOption: function(event, questionIndex) {
            var questionMap = Util.copy(this.state.questionMap),
                value = event.target.value.trim();

            // If the questionIndex is the index of the current
            // solution, then update the solution to
            // reflect the change in the text.
            if (questionIndex === this.state.solutionIndex) {
                questionMap.solution = value;
            }

            questionMap.options[questionIndex] = value;
            this.setState({questionMap: questionMap});
        },


        onChangeRadioForOption: function(event, questionIndex) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.solution = event.target.value.trim();
            this.setState({ solutionIndex: questionIndex, questionMap: questionMap });
        },


        onChangeExplanation: function(event) {
            var questionMap = Util.copy(this.state.questionMap);
            questionMap.explanation = event.target.value.trim();
            this.setState({ questionMap: questionMap });
        }

        
    }),


    /**
     * A multiple choice option for a question in an exam.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice_Option
     * @private
     */
    Body_Exam_QuestionList_MultiChoice_Option = React.createClass({

        render: function() {
            var question = this.props.question,
                listItems = question.getOptions().map(function(option, index) {
                    var isCorrect = question.isCorrect(option);
                    return <Body_Exam_QuestionList_MultiChoice_Option_Item
                                                        key={ index }
                                                        option={ option }
                                                        isCorrect={ isCorrect } />;
                });

            return (
                <ul className="question__multi-choice multi-choice">
                    { listItems }
                </ul>
            );
        }

    }),


    /**
     * A multiple choice item in the list of questions that a
     * user has created. This element will allow the user to
     * edit the multiple choice option.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing_Option
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing_Option = React.createClass({

        render: function() {
            var self = this,
                name = 'multichoice-' + this.props.questionId,
                listItems = this.props.options.map(function(option, index) {
                    var isCorrect = self.isCorrect(option),
                        key = self.props.questionId + '-' + index.toString();
                    // TODO: Shorten this line.
                    return <Body_Exam_QuestionList_MultiChoiceEditing_Option_Item
                                                                onChangeText={ self.onChangeText }
                                                                onChangeRadio={ self.onChangeRadio}
                                                                name={ name }
                                                                key={ key }
                                                                option={ option }
                                                                index={ index }
                                                                isCorrect={ isCorrect } />;
                });

            return (
                <ul className="question__multi-choice multi-choice--editing">
                    { listItems }
                </ul>
            );
        },


        /**
         * Check if the submission is the correct solution to
         * the question.
         *
         * @method isCorrect
         *
         * @param submission {String} The submission to check
         *  against the solution.
         *
         * @return {Boolean} True if the submission is the
         *  correct answer to the question, false otherwise.
         */
        isCorrect: function(submission) {
            return this.props.solution === submission;
        },


        onChangeText: function(event, questionIndex) {
            this.props.onChangeText(event, questionIndex);
        },


        onChangeRadio: function(event, questionIndex) {
            this.props.onChangeRadio(event, questionIndex);
        }


    }),


    /**
     *  A single multiple choice option for a question.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoice_Option_Item
     * @private
     */
    Body_Exam_QuestionList_MultiChoice_Option_Item = React.createClass({

        render: function() {
            var questionClass = (this.props.isCorrect) ?
                                "multi-choice__item--correct" :
                                "multi-choice__item",
                option = this.props.option;

            return <li className={ questionClass }>{ option }</li>;
        }

    }),


    /**
     *  A single multiple choice option for a question. This sets the
     *  mutliple choice option so that it can be edited.
     *
     * @module Layout
     * @submodule Course
     * @class Body_Exam_QuestionList_MultiChoiceEditing_Option_Item
     * @private
     */
    Body_Exam_QuestionList_MultiChoiceEditing_Option_Item = React.createClass({

        getInitialState: function() {
            return {option: this.props.option, isCorrect: this.props.isCorrect};
        },


        render: function() {
            var questionClass = (this.props.isCorrect) ?
                                "multi-choice__item--correct" :
                                "multi-choice__item",
                option = this.props.option;
            if (this.props.isCorrect) {
                return (
                    <li className={ questionClass }>
                        <input onChange={ this.onChangeRadio }
                               type="radio"
                               name={ this.props.name }
                               value={ option }
                               defaultChecked />
                        <span>
                            <input onChange={ this.onChangeText }
                                   type="text"
                                   defaultValue={ option }
                                   placeholder="Give a multiple choice option." />
                        </span>
                    </li>
                );         
            }
            // Not the correct answer.
            return (
                <li className={ questionClass }>
                    <input onChange={ this.onChangeRadio }
                           type="radio"

                           name={ this.props.name }
                           value={ option } />
                    <span>
                        <input onChange={ this.onChangeText }
                               type="text"
                               placeholder="Give a multiple choice option."
                               defaultValue={ option } />
                    </span>
                </li>
            ); 

        },


        onChangeText: function(event) {
            this.props.onChangeText(event, this.props.index);
        },


        onChangeRadio: function(event) {
            this.props.onChangeRadio(event, this.props.index);
        }


    });


module.exports = {
    Root: Root
};

