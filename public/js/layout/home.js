/** @jsx React.DOM */

/**
 * home.react.js
 *
 * All React Components targeted
 * specifically for the home page.
 */

var React = require('react'),
    
    ComponentsLayout = require('./components.js'),
    PopupsLayout = require('./popups.js'),
    HeaderLayout = require('./header.js'),

    Stores = require('../stores'),
    UserStore = Stores.UserStore(),
    CourseStore = Stores.CourseStore(),

    Router = require('shore').Router,
    Action = require('shore').Action,
    Constants = require('../constants.js'),

    Formatter = require('../formatter.js'),

    Dashboard = ComponentsLayout.Dashboard,

    SectionSet = ComponentsLayout.SectionSet,
    TagSet = ComponentsLayout.TagSet,

    Logger = require('shore').logger,

    /**
     * The root element for the home page. All other
     * elements on the home page will exist inside
     * this element.
     *
     * @module Layout
     * @submodule Home
     * @class Root
     */
    Root = React.createClass({

        render: function() {
            var menu = [
                (<a onClick={ this.onClickLogout } >Logout</a>)
            ];

            return (
                <div className="main">
                    <HeaderLayout.Header menu={ menu } />
                    <div className="content-wrapper">
                        <HomeDashboard />
                        <Content />
                    </div>

                </div>
            );
        },


        changedMode: function() {
            this.forceUpdate();
        },


        componentWillMount: function() {
            Stores.PageStore().on(Constants.Event.CHANGED_MODE, this.changedMode);
        },


        componentWillUnmount: function() {
            Stores.PageStore().removeListener(Constants.Event.CHANGED_MODE, this.changedMode);
        },


        onClickLogout: function () {
            Router.setPath("/", 
                           {}, // No Arg map.
                           {
                             action: Constants.Action.LOGOUT
                           });
        }


    }),


    HomeDashboard = React.createClass({

        render: function () {
            var user = UserStore.query().currentUser().getOne();
            return (
                <Dashboard>
                    <Dashboard.Summary>
                        <Dashboard.Summary.Header>Welcome, { user.get('firstName') }!</Dashboard.Summary.Header>
                    </Dashboard.Summary>
                </Dashboard>
            );
        }


    }),


    /**
     * All the major content on the
     * home page, including side navigation
     * and courses to lookup.
     *
     * @module Layout
     * @submodule Home
     * @class Content
     */
    Content = React.createClass({

        render: function() {

            return (
                <SectionSet>
                    <MyCourses />
                    <PopularCourses />
                </SectionSet>

            );
        }


    }),


    MyCourses = React.createClass({

        render: function () {
            var user = UserStore.query().currentUser().getOne(),
                courses = CourseStore.query().coursesForUser(user).getAll();

                courseBoxes = courses.map(function (course) {
                    return <CourseBox key={ course.id } course={ course } />
                }),

                // If there are no courses, then render a message saying there
                // are no courses in this section.
                renderContent = (courseBoxes.length === 0) ?
                             (<SectionSet.Section.Empty>
                                There are no courses here yet.
                             </SectionSet.Section.Empty>) :

                             (<div className="pure-g course-grid">
                                { courseBoxes }
                              </div>);
            
            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>My Courses</SectionSet.Section.Header>
                    <div className="divide"></div>
                    
                    { renderContent }

                </SectionSet.Section>
            );
        }

    }),


    /**
     * A section containing the popular courses to present
     * to the user.
     */
    PopularCourses = React.createClass({

        render: function () {
            var user = UserStore.query().currentUser().getOne(),
                courses = CourseStore.query().coursesNotForUser(user).getAll();

                courseBoxes = courses.map(function (course) {
                    return <CourseBox key={ course.id } course={ course } />
                }),

                // If there are no courses, then render a message saying there
                // are no courses in this section.
                renderContent = (courseBoxes.length === 0) ?
                             (<SectionSet.Section.Empty>
                                There are no courses here yet.
                             </SectionSet.Section.Empty>) :

                             (<div className="pure-g course-grid">
                                { courseBoxes }
                              </div>);
            
            return (
                <SectionSet.Section>
                    <SectionSet.Section.Header>Popular Courses</SectionSet.Section.Header>
                    <div className="divide"></div>
                    
                    { renderContent }

                </SectionSet.Section>
            );
        }

    }),


    /**
     * A box containing basic information of a course.
     * The box is clickable, transition to a page with all
     * data relevant to the course.
     *
     * @module Layout
     * @submodule Home
     * @class CourseBox
     * @private
     */
    CourseBox = React.createClass({
        
        render: function() {
            var course = this.props.course,
                tags = course.get('tags'),

                // The list of tags for the course. 
                tagListEl = (tags.length === 0) ?
                            (null) :
                            (<TagSet>
                                { tags.map(function (tag) {
                                    return (<TagSet.Tag key={ tag.id } tag={ tag } />);
                                  })
                                }
                             </TagSet>);


            return (
                <div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 course-box"
                     onClick={ this.onClick }>
                    <div className="course-box__content">
                        <header className="course-box__content__header">{ course.get('alias') }</header>
                        <div className="course-box__content__body">
                            <div>{ course.get('description') }</div>
                            { tagListEl }
                        </div>
                    </div>
                </div>
            );
        },

        onClick: function(event) {
            Logger.log(Logger.Level.INFO, "Course selected: " + this.props.course.id);
            Router.setPath("/course/<courseId>", { courseId: this.props.course.id });
        }

    });


module.exports = {
    Root: Root
};
