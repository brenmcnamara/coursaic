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
        return (
            <div className="exam">
                <h1 className="exam__title">Exam 1</h1>
                <View.Exam_Form_Question_List />
                <View.Exam_Form_Buttons />
            </div>
        );
    }


});


View.Exam_Form_Question_List = React.createClass({

    render: function() {
        return (
            <ul className="exam__question-list">
                <View.Exam_Form_Question />
                <View.Exam_Form_Question />
                <View.Exam_Form_Question />
                <View.Exam_Form_Question />
            </ul>
        );
    }


});


View.Exam_Form_Question = React.createClass({

    render: function() {
        return (
            <li className="question-item--multi-choice">
                <div className="question-item__question">Why is the sky so blue?</div>
                <ul className="question-item--multi-choice__options">
                    <li className="question-item--multi-choice__options__item">
                        <input type="radio" />Option 1
                    </li>
                    <li className="question-item--multi-choice__options__item">
                        <input type="radio" />Option 1
                    </li>
                    <li className="question-item--multi-choice__options__item">
                        <input type="radio" />Option 1
                    </li>
                    <li className="question-item--multi-choice__options__item">
                        <input type="radio" />Option 1
                    </li>
                </ul>
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

