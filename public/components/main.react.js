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
    if (!event.pageKey) {
        throw new Error("_onLoad event must include a pageKey.");
    }
    View.render(event.pageKey);
};

ConfigStore.addListener(CAEvent.Name.DID_LOAD, View._onLoad);



