/** @jsx React.DOM */

/*
 * exam.react.js
 *
 * The components for the exam page.
 */

View.Exam_Root = React.createClass({

    render: function() {
        var cancelExamPopup;
        if (ExamStore.isShowingExamResults()) {
            return <div>Hello from results page!</div>
        }
        else {
            cancelExamPopup = (ExamStore.isCancelingExamRun()) ?
                              (<View.Popup_Cancel_Exam_Run />) :
                              (null);
            return (
                <div className="main">
                    { cancelExamPopup }
                    <View.Header isOpaque={ false } />
                    <View.Header_Fill isOpaque={ false } />
                    <View.Exam_Form />
                </div>
            );  
        }
    },

    onChange: function(event) {
        this.forceUpdate();
    },


    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_BEGIN_EDITING, this.onChange);
        ExamStore.addListener(CAEvent.Name.DID_END_EDITING, this.onChange);
        ExamStore.addListener(CAEvent.Name.DID_GRADE_EXAM_RUN, this.onChange);
    },


    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_BEGIN_EDITING, this.onChange);
        ExamStore.removeListener(CAEvent.Name.DID_END_EDITING, this.onChange);
        ExamStore.removeListener(CAEvent.Name.DID_GRADE_EXAM_RUN, this.onChange);
    }


});


View.Exam_Form = React.createClass({

    getInitialState: function() {
        return { guesses: {} };
    },


    render: function() {
        var exam = ExamStore.current();
        return (
            <div className="exam">
                <h1 className="exam__title">{ exam.get('name') }</h1>
                <View.Divide_Full />
                <View.Exam_Form_Question_List onChange={ this.onChangeQuestion } />
                <View.Exam_Form_Buttons onSubmit={ this.onSubmit } />
            </div>
        );
    },


    onChangeQuestion: function(event, index) {
        var guesses = View.Util.copy(this.state.guesses);
        guesses[index] = event.target.value;
        this.setState({ guesses: guesses });
    },


    onSubmit: function(event) {
        Action.send(Action.Name.SUBMIT_EXAM_RUN, { guesses: this.state.guesses });
    }


});


View.Exam_Form_Question_List = React.createClass({

    render: function() {
        var self = this,
            examRun = ExamStore.currentExamRun(),
            questionList;

        if (examRun) {
            questionList = examRun.questions().map(function(question, index) {
                    var key = "ExamQuestion-" + question.id;
                    return <View.Exam_Form_Question onChange={ self.onChangeQuestion }
                                                    index={ index }
                                                    question={ question }
                                                    key={ key } />
                });
            return (
                <ul className="exam__question-list">
                    { questionList }
                </ul>
            );           
        }
        return null;
    },

  
    onChange: function(event) {
        this.forceUpdate();
    },


    onChangeQuestion: function(event, index) {
        this.props.onChange(event, index);
    },


    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_CREATE_EXAM_RUN, this.onChange);
    },


    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_CREATE_EXAM_RUN, this.onChange);
    }


});


View.Exam_Form_Question = React.createClass({

    render: function() {
        var self = this,
            question = this.props.question,
            options = question.getOptions(),
            optionList = options.map(function(option, index) {
                var key = question.id + "-option-" + index.toString(),
                    name = question.id;
                return <View.Exam_Form_Question_Multi_Choice_Item onChangeItem={ self.onChangeItem }
                                                                  option={ option }
                                                                  key={ key }
                                                                  name={ name } />;
            });

        return (
            <li className="question-item--multi-choice">
                <div className="question-item__question">{ question.get('question') }</div>
                <ul className="question-item--multi-choice__options">
                    { optionList }
                </ul>
            </li>
        );
    },


    onChangeItem: function(event) {
        this.props.onChange(event, this.props.index);
    }


});


View.Exam_Form_Question_Multi_Choice_Item = React.createClass({

    render: function() {
        var option = this.props.option,
            name = this.props.name;
        return (
            <li className="question-item--multi-choice__options__item">
                <input type="radio" onChange={ this.onChange }
                                    name={ name }
                                    value={ option } />{ option }
            </li>
        );
    },


    onChange: function(event) {
        this.props.onChangeItem(event);
    }


});


View.Exam_Form_Buttons = React.createClass({

    render: function() {
        return (
            <div className="button-wrapper exam__button-wrapper">
                <button onClick={ this.props.onSubmit }
                        type="button" className="button">Submit</button>
                <button onClick={ this.onClickCancel } type="button" className="button">
                    Cancel
                </button>
            </div>
        );
    },


    onClickCancel: function() {
        Action.send(Action.Name.ENTER_CANCEL_EXAM_RUN_MODE, { examId: ExamStore.current().id });
    }


});

