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

View.Util = {
    /**
     * Make a deep copy of the object.
     *
     * @method copy
     * 
     * @param obj {Object} The object to be copied.
     *
     * @return {Object} A deep copy of the object.
     */
    copy: function(obj) {
        var prop, objCopy;
        switch (typeof obj) {
        case 'string':
        case 'number':
            return obj;
        case 'function':
            // Just leave functions by reference
            return obj;
        case 'object':
            if (!obj) {
                // it is null
                return null;
            }
            else if (Array.isArray(obj)) {
                return obj.slice();
            }
            objCopy = {};
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    objCopy[prop] = View.Util.copy(obj[prop]);
                }
            }
            return objCopy;
        default:
            return obj;
        }
    }
};

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
    var result;
    try {
        result = React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
    return result;
};


/**
 * Called when the page is first loaded.
 *
 * @static
 * @private
 * @method _onLoad
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



