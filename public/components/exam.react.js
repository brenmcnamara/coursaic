/** @jsx React.DOM */

/*
 * exam.react.js
 *
 * The components for the exam page.
 */

View.Exam_Root = React.createClass({

    render: function() {
        var cancelExamPopup;
        if (PageStore.currentMode() === PageStore.Mode.VIEW_EXAM_RESULTS) {
            return (
                <div className="main">
                    <View.Header isOpaque={ false } />
                    <View.Header_Fill isOpaque={ false } />
                    <View.Back_Button />
                    <View.Exam_Results />
                </div>
            );
        }
        else {
            cancelExamPopup = (PageStore.currentMode() === PageStore.Mode.CANCEL_EXAM_RUN) ?
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
        ExamStore.addListener(CAEvent.Name.CHANGED_MODE, this.onChange);
        ExamStore.addListener(CAEvent.Name.DID_GRADE_EXAM_RUN, this.onChange);
    },


    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.CHANGED_MODE, this.onChange);        
        ExamStore.removeListener(CAEvent.Name.DID_GRADE_EXAM_RUN, this.onChange);
    }


});



View.Back_Button = React.createClass({

    render: function() {
        return (
            <button onClick={ this.onClick }
                    type="button"
                    className="exam-result-back button">
                Back to Course
            </button>
        );
    },


    onClick: function() {
        Action.send(Action.Name.PERFORM_LOAD, { pageKey: 'course',
                                                course: CourseStore.current().id,
                                                removeMode: PageStore.Mode.VIEW_EXAM_RESULTS });
    }


});


View.Exam_Results = React.createClass({

    render: function() {
        var exam = ExamStore.current();
        return (
            <div className="exam-run-results">
                <h1 className="exam__title">{ exam.get('name') }</h1>
                <View.Exam_Score />
                <View.Divide_Full />
                <View.Exam_Results_Solutions_List />
            </div>
        );
    }


});


View.Exam_Score = React.createClass({

    render: function() {
        var examRun = ExamStore.currentExamRun(),
            // TODO: Add some formatter for this.
            percentage = Math.floor(examRun.grade() * 100);

        return (
            <div className="exam-run-results__score">
                You scored <span className="exam-run-results__score__percent">{ percentage }%</span>
            </div>
        );        
    }
    
});


View.Exam_Results_Solutions_List = React.createClass({

    render: function() {
        var examRun = ExamStore.currentExamRun(),
            solutions = examRun.questions().map(function(question, index) {
                var guess = examRun.guessAtIndex(index),
                    key = question.id + "-" + index.toString();
                return <View.Exam_Results_Solutions_List_Item question={ question }
                                                              guess={ guess }
                                                              key={ key } />;
            });

        return (
            <ul className="exam-run-results__list">{ solutions }</ul>
        );
    }


});


// TODO: This item is mutli-choice specific,
// should change the name to specify that.
View.Exam_Results_Solutions_List_Item = React.createClass({

    render: function() {
        var self = this,
            question = this.props.question,
            options = question.getOptions().map(function(option, index) {
                var key = question.id + "-option-" + index.toString();
                if (question.isCorrect(option)) {
                    return <View.Exam_Results_Solutions_List_Multi_Choice_Item key={ key }
                                                                               option={ option }
                                                                               isCorrect={ true } />;
                }
                else if (option === self.props.guess) {
                    return <View.Exam_Results_Solutions_List_Multi_Choice_Item key={ key }
                                                                               isIncorrect={ true }
                                                                               option={ option } />; 
                }
                else {
                    return <View.Exam_Results_Solutions_List_Multi_Choice_Item key={ key }
                                                                               option={ option } />
                }
            });
        return (
            <li className="solution-item--multi-choice">
                <div className="solution-item__question">{ question.get('question') }</div>
                <ul className="solution-item--multi-choice__options">
                    { options }
                </ul>
                <div className="solution-item__explanation">
                    <span>Explanation:</span>
                    <span> { question.get('explanation') }</span>
                </div>
            </li>
        );
    }


});


View.Exam_Results_Solutions_List_Multi_Choice_Item = React.createClass({

    render: function() {
        var itemType;
        if (this.props.isIncorrect) {
            itemType = "solution-item--multi-choice__options__item--incorrect";
        }
        else if (this.props.isCorrect) {

            itemType = "solution-item--multi-choice__options__item--correct";
        }
        else {
            itemType = "solution-item--multi-choice__options__item";
        }
        return (
            <li className={ itemType }>{ this.props.option }</li>
        );
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
        Action.send(Action.Name.TO_MODE_CANCEL_EXAM_RUN, { examId: ExamStore.current().id });
    }


});

