/**
 * main.js
 *
 * The file that sets up the View namespace
 * and module.
 */

/**
 * Dependencies
 *  - React framework
 */
View = {};

View.render = function(key, params) {
    if (key === 'home') {
        React.renderComponent(View.Home_Root(params),
                              document.getElementsByTagName('body')[0]);
    }
};