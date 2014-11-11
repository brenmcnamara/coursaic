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
    switch (key) {
        case 'home':
            View._unmountRoot();
            React.renderComponent(View.Home_Root(params),
                                  document.getElementsByTagName('body')[0]);
            break;
        case 'course':  
            View._unmountRoot();
            React.renderComponent(View.Course_Root(params),
                                  document.getElementsByTagName('body')[0]);
            break;
        default:
            console.error("Unrecognized page key " + key);
            throw new Error("Trying to render page with unrecognized key " + key);
    }
};

/**
 * Unmount the root element
 *
 * @method _unmountRoot
 * @private
 *
 * @return {Boolean} true if an element was
 * unmounted, false otherwise.
 */
View._unmountRoot = function() {
    return React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
};


/**
 * @static
 * @private
 * @method _onLoad
 *
 * Called when the page is first loaded.
 */
View._onLoad = function(event) {
    switch (ConfigStore.pageKey()) {
    case 'course':
        View.render('course', {courseId: ConfigStore.courseId()});
        break;
    default:
        View.render(ConfigStore.pageKey());
    }
};


UserStore.addListener(CAEvent.Name.DID_LOAD, View._onLoad);



