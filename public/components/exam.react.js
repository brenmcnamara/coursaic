/** @jsx React.DOM */

/*
 * exam.react.js
 *
 * The components for the exam page.
 */

View.Exam_Root = React.createClass({

    render: function() {
        return (
            <div className="main">
                <View.Header isOpaque={ false } />
                <View.Header_Fill isOpaque={ false } />
                <View.Exam_Form />
            </div>
        );
    }


});


View.Exam_Form = React.createClass({

    render: function() {
        var exam = ExamStore.current();
        return (
            <div className="exam">
                <h1 className="exam__title">{ exam.get('name') }</h1>
                <View.Divide_Full />
                <View.Exam_Form_Question_List />
                <View.Exam_Form_Buttons />
            </div>
        );
    }


});


View.Exam_Form_Question_List = React.createClass({

    render: function() {
        var examRun = ExamStore.currentExamRun(),
            questionList;

        if (examRun) {
            questionList = examRun.questions().map(function(question) {
                    var key = "ExamQuestion-" + question.id;
                    return <View.Exam_Form_Question question={ question } key={ key } />
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

    componentWillMount: function() {
        ExamStore.addListener(CAEvent.Name.DID_CREATE_EXAM_RUN, this.onChange);
    },


    componentWillUnmount: function() {
        ExamStore.removeListener(CAEvent.Name.DID_CREATE_EXAM_RUN, this.onChange);
    }


});


View.Exam_Form_Question = React.createClass({

    render: function() {
        var question = this.props.question,
            options = question.getOptions(),
            optionList = options.map(function(option, index) {
                var key = question.id + "-option-" + index.toString(),
                    name = question.id;
                return <View.Exam_Form_Question_Multi_Choice_Item option={ option }
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
    }


});


View.Exam_Form_Question_Multi_Choice_Item = React.createClass({

    render: function() {
        var option = this.props.option,
            name = this.props.name;
        return (
            <li className="question-item--multi-choice__options__item">
                <input type="radio" name={ name } />{ option }
            </li>
        );
    }


});


View.Exam_Form_Buttons = React.createClass({

    render: function() {
        return (
            <div className="button-wrapper exam__button-wrapper">
                <button type="button" className="button">Submit</button>
                <button type="button" className="button">Cancel</button>
            </div>
        );
    }


});

