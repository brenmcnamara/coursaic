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
            </div>
        );
    }


});