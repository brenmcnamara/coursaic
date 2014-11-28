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
                <div className="exam">
                    <h1 className="exam__title">Exam 1</h1>
                    <ul className="exam__question-list">
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
                    </ul>
                    <div className="button-wrapper exam__button-wrapper">
                        <button type="button" className="button">Submit</button>
                    </div>
                </div>
            </div>
        );
    }
/*
                
                */
});