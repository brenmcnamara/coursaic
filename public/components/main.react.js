/**
 * main.react.js
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

/**
 * @static
 * @private
 * @method _onLoad
 *
 * Called when the page is first loaded.
 */
View._onLoad = function(event) {
    // Bind events here.
};

