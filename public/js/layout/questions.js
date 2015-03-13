/**
 * question.js
 *
 * Components for listing questions, to be used
 * by other react elements.
 */

var

	Action = require('shore').Action,
	Constants = require('../constants.js'),

	Request = require('../request'),

	Stores = require('../stores'),
	CourseStore = Stores.CourseStore(),
	PageStore = Stores.PageStore(),
	QuestionStore = Stores.QuestionStore(),
	TopicStore = Stores.TopicStore(),

	FormLayout = require('./form.js'),
	HeaderLayout = require('./header.js'),


	/**
	 * Meant for a list of questions that are all by the
	 * current user, providing editing options for these
	 * questions. This will automatically detect if the app
	 * is in new question mode and will add a form for creating a new question.
	 */
	UserQuestionList = React.createClass({

        render: function () {
            var newQuestion = (PageStore.currentMode() === PageStore.Mode.CREATE_QUESTION) ?
                (<QuestionItem_New />) :
                (null);

            return (
                <ul className="question-info-list">
                    { newQuestion }
                    {
                        this.props.questions.map(function (question) {
                            if (PageStore.currentMode() === PageStore.Mode.EDIT_QUESTION &&
                                PageStore.currentPayload().questionId === question.id) {
                                // Render the question in edit mode.
                                return (<QuestionItem_Edit key={ question.id } question={ question} />);
                            }
                            // Not in edit mode for this question.
                            return (<QuestionItem key={ question.id } question={ question } />);
                        })

                    }
                </ul>
            );
        },

        onChangedMode: function () {
            this.forceUpdate();
        },

        onDeleteQuestion: function () {
            this.forceUpdate();
        },

        componentWillMount: function () {
            PageStore.on(Constants.Event.CHANGED_MODE, this.onChangedMode);
        },

        componentWillUnmount: function () {
            PageStore.removeListener(Constants.Event.CHANGED_MODE, this.onChangedMode);
        }

    }),


	/**
	 * A list of questions for the owner of the course
	 * that the questions were made for. This will have
	 * options of editing questions that are available to
	 * the owner of the course.
	 */
	OwnerQuestionList = React.createClass({

		render: function () {
			var questions = this.props.questions;
			return (
				<ul className="question-info-list">
	                {
	                    questions.map(function (question) {
	                        return (<FlaggedQuestionItem key={ question.id } question={ question } />);
	                    })
	                }
	            </ul>
			);
		}
	}),


    QuestionItem = React.createClass({

        render: function () {
            var question = this.props.question,
                topic = TopicStore.query().topicForQuestion(question).getOne(),

                isFlagged = QuestionStore.query().questionsFlagged().contains(question),
                isDisabled = QuestionStore.query().questionsDisabled().contains(question),

                renderDisabledIssue = (isDisabled) ?
                    (<QuestionItem_Issues_Error>This question has been disabled by the owner of the course.</QuestionItem_Issues_Error>) :
                    (null),

                renderFlaggedIssue = (isFlagged) ?
                    (<QuestionItem_Issues_Warning>This question has been flagged.</QuestionItem_Issues_Warning>) :
                    (null),

                renderIssueList = (isFlagged || isDisabled) ?
                    (<QuestionItem_Issues>
                        { renderDisabledIssue }
                        { renderFlaggedIssue }   
                     </QuestionItem_Issues>) :
                    (null);


            return (
                <li className="pure-g">
                    <div className="pure-u-1">
                        { renderIssueList }
                    </div>
                    <div className="question-topic pure-u-1">
                        <span className="question-topic__content">{ topic.get('name') }</span>
                    </div>
                    <div className="pure-u-1">
                        <div className="question-item__icon-set--2 pure-g">
                            <div className="pure-u-1-2 question-item__icon-set__item--bad clickable"
                                 onClick={ this.onClickDelete }><i className="fa fa-trash"></i></div>
                            <div className="pure-u-1-2 question-item__icon-set__item--good clickable"
                                 onClick={ this.onClickEdit }><i className="fa fa-pencil-square-o"></i></div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo question={ question } />
                        </div>
                    </div>
                </li>
            );
        },

        onClickDelete: function (event) {
            if (confirm("Are you sure you would like to delete this question?")) {
                Action(Constants.Action.DELETE_QUESTION, { questionId: this.props.question.id }).send();
            }
        },

        onClickEdit: function () {
            Action(Constants.Action.TO_MODE_EDIT_QUESTION, { questionId: this.props.question.id }).send();
        }

    }),


    QuestionItem_Issues = React.createClass({

        render: function () {
            return (
                <ul className="question-item__issue-list">
                    { this.props.children }
                </ul>
            );
        }

    }),


    QuestionItem_Issues_Error = React.createClass({

        render: function () {
            return (
                <li className="question-item__issue-list__item--error">
                    <i className="fa fa-exclamation-circle"></i>
                    <div className="question-item__issue-list__item--error__message">
                        { this.props.children }
                    </div>
                </li>
            );
        }

    }),


    QuestionItem_Issues_Warning = React.createClass({

        render: function () {
            return (
                <li className="question-item__issue-list__item--warning">
                    <i className="fa fa-exclamation-triangle"></i>
                    <div className="question-item__issue-list__item--warning__message">
                        { this.props.children }
                    </div>
                </li>
            );
        }

    }),


    QuestionItem_New = React.createClass({

        getInitialState: function () {
            return { request: Request.CreateMultiChoice() };
        },

        render: function () {
            var 
                courseId = PageStore.courseId(),
                course = CourseStore.query().courseWithId(courseId).getOne(),

                allTopics = TopicStore.query().topicsForCourse(course).getAll(),
                selectedTopic = allTopics[0],

                saveIconClassName = (this.state.request.isValid()) ?
                    ("pure-u-1-2 question-item__icon-set__item--good clickable") :
                    ("pure-u-1-2 question-item__icon-set__item--good clickable disabled");

            return (
                <li className="pure-g">
                    <div className="question-topic pure-u-1">
                        <span className="question-topic__content">
                            <FormLayout.Select value={ selectedTopic.get('name') }
                                               options={ allTopics.map(function (topic) {return topic.get('name'); }) }
                                               onChange={ this.onChangeTopic } />
                        </span>
                    </div>
                    <div className="pure-u-1">
                        <div className="question-item__icon-set--2 pure-g">
                            <div className="pure-u-1-2 question-item__icon-set__item--bad clickable"
                                 onClick={ this.onClickCancel } ><i className="fa fa-minus-circle"></i></div>
                            <div className={ saveIconClassName }
                                 onClick={ this.onClickSave }><i className="fa fa-floppy-o"></i></div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo_New  onChangeOption={ this.onChangeOption }
                                               onChangeCorrect={ this.onChangeCorrect }
                                               onChangeAsk={ this.onChangeAsk }
                                               onChangeExplain={ this.onChangeExplain } />
                        </div>
                    </div>
                </li>
            );
        },

        componentDidMount: function () {
            var 
                courseId = PageStore.courseId(),
                course = CourseStore.query().courseWithId(courseId).getOne(),

                allTopics = TopicStore.query().topicsForCourse(course).getAll(),
                selectedTopic = allTopics[0];

            // Set the currently selected topic on the change request.
            // request.
            this.state.request.set('topic',
                                   Request.ObjectType('Topic', selectedTopic.id));
            this.state.request.set('course',
                                   Request.ObjectType('Course', courseId));
        },

        onClickCancel: function (event) {
            Action(Constants.Action.QUIT_MODE_CREATE_QUESTION).send();
        },

        onClickSave: function (event) {
            if (this.state.request.isValid()) {
                Action(Constants.Action.RESOLVE_MODE_CREATE_QUESTION,
                       { request: this.state.request }).send();
            }

        },

        onChangeTopic: function (event) {
            var topic = TopicStore.query().topicForName(event.target.value).getOne();
            this.state.request.set('topic', Request.ObjectType('Topic', topic.id));

            this.forceUpdate();
        },

        onChangeCorrect: function (event) {
            var correctIndex = +(event.target.value);
            this.state.request.setSolutionToIndex(correctIndex);
            this.forceUpdate();
        },

        onChangeAsk: function (event) {
            this.state.request.set('ask', event.target.value);
            this.forceUpdate();
        },

        onChangeExplain: function (event) {
            this.state.request.set("explanation", event.target.value);
            this.forceUpdate();
        },

        onChangeOption: function (event) {
            this.state.request.setOptionAtIndex(event.index, event.target.value);
            this.forceUpdate();
        }

    }),


    QuestionItem_Edit = React.createClass({

        getInitialState: function () {
            return { request: Request.EditMultiChoice(this.props.question) };
        },

        render: function () {
            var 
                courseId = PageStore.courseId(),
                course = CourseStore.query().courseWithId(courseId).getOne(),

                question = this.props.question,

                allTopicNames = TopicStore.query().topicsForCourse(course)
                                                  .getAll()
                                                  .map(function (topic) { return topic.get('name'); }),

                selectedTopicName = TopicStore.query().topicForQuestion(question).getOne().get('name'),

                isFlagged = QuestionStore.query().questionsFlagged().contains(question),
                isDisabled = QuestionStore.query().questionsDisabled().contains(question),

                renderDisabledIssue = (isDisabled) ?
                    (<QuestionItem_Issues_Error>This question is currently disabled.</QuestionItem_Issues_Error>) :
                    (null),

                renderFlaggedIssue = (isFlagged) ?
                    (<QuestionItem_Issues_Warning>This question has been flagged.</QuestionItem_Issues_Warning>) :
                    (null),

                renderIssueList = (isFlagged || isDisabled) ?
                    (<QuestionItem_Issues>
                        { renderDisabledIssue }
                        { renderFlaggedIssue }   
                     </QuestionItem_Issues>) :
                    (null),

                saveIconClassName = (this.state.request.isValid()) ?
                    ("pure-u-1-2 question-item__icon-set__item--good clickable") :
                    ("pure-u-1-2 question-item__icon-set__item--good clickable disabled");

            return (
                <li className="pure-g">
                    <div className="pure-u-1">
                        { renderIssueList }
                    </div>
                    <div className="question-topic pure-u-1">
                        <span className="question-topic__content">
                            <FormLayout.Select value={ selectedTopicName }
                                               options={ allTopicNames }
                                               onChange={ this.onChangeTopic } />
                        </span>
                    </div>
                    <div className="pure-u-1">
                        <div className="question-item__icon-set--2 pure-g">
                            <div className="pure-u-1-2 question-item__icon-set__item--bad clickable"
                                 onClick={ this.onClickCancel } ><i className="fa fa-minus-circle"></i></div>
                            <div className={ saveIconClassName }
                                 onClick={ this.onClickSave }><i className="fa fa-floppy-o"></i></div>
                        </div>
                        <div className="question-item__content">
                            <QuestionInfo_Edit question={ question }
                                               onChangeOption={ this.onChangeOption }
                                               onChangeCorrect={ this.onChangeCorrect }
                                               onChangeAsk={ this.onChangeAsk }
                                               onChangeExplain={ this.onChangeExplain } />
                        </div>
                    </div>
                </li>
            );
        },

        onClickCancel: function (event) {
            Action(Constants.Action.QUIT_MODE_EDIT_QUESTION).send();
        },

        onClickSave: function (event) {
            if (this.state.request.isValid()) {
                Action(Constants.Action.RESOLVE_MODE_EDIT_QUESTION,
                       { request: this.state.request }).send();
            }

        },

        onChangeTopic: function (event) {
            var topic = TopicStore.query().topicForName(event.target.value).getOne();
            this.state.request.set('topic', Request.ObjectType('Topic', topic.id));
            this.forceUpdate();
        },

        onChangeCorrect: function (event) {
            var correctIndex = +(event.target.value);
            this.state.request.setSolutionToIndex(correctIndex);
            this.forceUpdate();
        },

        onChangeAsk: function (event) {
            this.state.request.set('ask', event.target.value);
            this.forceUpdate();
        },

        onChangeExplain: function (event) {
            this.state.request.set("explanation", event.target.value);
            this.forceUpdate();
        },

        onChangeOption: function (event) {
            this.state.request.setOptionAtIndex(event.index, event.target.value);
            this.forceUpdate();
        }

    }),


    FlaggedQuestionItem = React.createClass({

        render: function () {
            var question = this.props.question,
                topic = TopicStore.query().topicForQuestion(question).getOne(),

                isFlagged = QuestionStore.query().questionsFlagged().contains(question),
                isDisabled = QuestionStore.query().questionsDisabled().contains(question),

                renderDisabledIssue = (isDisabled) ?
                    (<QuestionItem_Issues_Error>This question is currently disabled.</QuestionItem_Issues_Error>) :
                    (null),

                renderFlaggedIssue = (isFlagged) ?
                    (<QuestionItem_Issues_Warning>This question has been flagged.</QuestionItem_Issues_Warning>) :
                    (null),

                renderIssueList = (isFlagged || isDisabled) ?
                    (<QuestionItem_Issues>
                        { renderDisabledIssue }
                        { renderFlaggedIssue }   
                     </QuestionItem_Issues>) :
                    (null),

                renderIcon = (isDisabled) ?
                    (<div className="pure-u-1 question-item__icon-set__item--good clickable"
                          onClick={ this.onClickUnDisable }><i className="fa fa-check-square-o"></i></div>) :
                    (<div className="pure-u-1 question-item__icon-set__item--bad clickable"
                          onClick={ this.onClickDisable }><i className="fa fa-ban"></i></div>);

            return (
                <li>
                    <div className="pure-g">
                        <div className="pure-u-1">
                            { renderIssueList }
                        </div>
                        <div className="question-topic pure-u-1">
                            <span className="question-topic__content">{ topic.get('name') }</span>
                        </div>
                        <div className="pure-u-1">
                            <div className="question-item__icon-set--1 pure-g">
                                { renderIcon }
                            </div>
                            <div className="question-item__content"><QuestionInfo question={ question } /></div>
                        </div>
                    </div>
                </li>
            );
        },

        onClickDisable: function (event) {
            var request = Request.EditQuestion(this.props.question);
            request.set('disabled', true);
            Action(Constants.Action.DISABLE_QUESTION, { request: request }).send();
        },

        onClickUnDisable: function (event) {
            var request = Request.EditQuestion(this.props.question);
            request.set('disabled', false);
            Action(Constants.Action.UNDISABLE_QUESTION, { request: request }).send();
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
                question = this.props.question,
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
                        { question.get('explanation') }
                    </div>
                </div>
            );
        }

    }),


    QuestionInfo_New = React.createClass({

        render: function () {
            return (
                <form className="question-info">
                    <div className="question-info__ask">
                        <FormLayout.TextInput placeholder="Enter a question"
                                              onChange={ this.onChangeAsk }
                                              isValid={ this.isValidText } />
                    </div>
                    <MultiChoice_New_Options  onChangeCorrect={ this.onChangeCorrect }
                                              onChangeOption={ this.onChangeOption } />
                    <div className="question-info__explanation--edit">
                        <FormLayout.TextAreaInput placeholder="Explanation"
                                                  onChange={ this.onChangeExplain }
                                                  isValid={ this.isValidText } />
                    </div>
                </form>
            );
        },

        isValidText: function (text) {
            return text && text.trim().length > 0;
        },

        onChangeAsk: function (event) {
            this.props.onChangeAsk(event);
        },

        onChangeExplain: function (event) {
            this.props.onChangeExplain(event);
        },

        onChangeOption: function (event) {
            this.props.onChangeOption(event);
        },

        onChangeCorrect: function (event) {
            this.props.onChangeCorrect(event);
        }

    }),


    QuestionInfo_Edit = React.createClass({

        render: function () {
            var question = this.props.question;

            return (
                <form className="question-info">
                    <div className="question-info__ask">
                        <FormLayout.TextInput placeholder="Enter a question"
                                              onChange={ this.onChangeAsk }
                                              isValid={ this.isValidText }
                                              value={ question.get('ask') } />
                    </div>
                    <MultiChoice_Edit_Options question={ question }
                                              onChangeCorrect={ this.onChangeCorrect }
                                              onChangeOption={ this.onChangeOption } />
                    <div className="question-info__explanation--edit">
                        <FormLayout.TextAreaInput placeholder="Explanation"
                                                  value={ question.get('explanation') }
                                                  onChange={ this.onChangeExplain }
                                                  isValid={ this.isValidText } />
                    </div>
                </form>
            );
        },

        isValidText: function (text) {
            return text && text.trim().length > 0;
        },

        onChangeAsk: function (event) {
            this.props.onChangeAsk(event);
        },

        onChangeExplain: function (event) {
            this.props.onChangeExplain(event);
        },

        onChangeOption: function (event) {
            this.props.onChangeOption(event);
        },

        onChangeCorrect: function (event) {
            this.props.onChangeCorrect(event);
        }

    }),


    MultiChoice_New_Options = React.createClass({

        render: function () {
            return (
                <ul className="multi-choice-info__options-list">
                    {
                        [1, 2, 3, 4].map(function (val, index) {
                            return (
                                <li key={ index.toString() } className="multi-choice-info__options-list__item">
                                    <FormLayout.RadioOption name={ "edit-new" }
                                                            value={ index }
                                                            onChange={ this.onChangeRadio } >

                                        <FormLayout.TextInput placeholder={ "Option " + (val) }
                                                              onChange={ this.onChangeTextGenerator(index) }
                                                              isValid={ this.isValidText } />
                                    </FormLayout.RadioOption>
                                </li>
                            );
                        }.bind(this))
                    }
                </ul>
            );
        },

        isValidText: function (text) {
            return text && text.trim().length > 0;
        },

        onChangeRadio: function (event) {
            this.props.onChangeCorrect(event);
        },

        onChangeTextGenerator: function (index) {
            return function (event) {
                event.index = index;
                this.props.onChangeOption(event);
            }.bind(this)
        }

    }),


    MultiChoice_Edit_Options = React.createClass({

        render: function () {
            var question = this.props.question,
                options = question.getOptions();
            return (
                <ul className="multi-choice-info__options-list">
                    {
                        options.map(function (option, index) {
                            return (
                                <li key={ index.toString() } className="multi-choice-info__options-list__item">
                                    <FormLayout.RadioOption name={ "edit-" + question.id }
                                                            value={ index }
                                                            checked={ question.isCorrect(option) }
                                                            onChange={ this.onChangeRadio } >

                                        <FormLayout.TextInput placeholder={ "Option " + (index + 1) }
                                                              onChange={ this.onChangeTextGenerator(index) }
                                                              isValid={ this.isValidText }
                                                              value={ option } />
                                    </FormLayout.RadioOption>
                                </li>
                            );
                        }.bind(this))
                    }
                </ul>
            );
        },

        isValidText: function (text) {
            return text && text.trim().length > 0;
        },

        onChangeRadio: function (event) {
            this.props.onChangeCorrect(event);
        },

        onChangeTextGenerator: function (index) {
            return function (event) {
                event.index = index;
                this.props.onChangeOption(event);
            }.bind(this)
        }

    });


module.exports = {
	OwnerQuestionList: OwnerQuestionList,
	UserQuestionList: UserQuestionList,
};
