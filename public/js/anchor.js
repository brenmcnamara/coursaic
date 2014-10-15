/**
 * anchor.js
 *
 * A file that reads and interprets the
 * uri for the page.
 */

/*jslint browser:true, continue:false, devel:true,
         indent:4, maxerr:50, newcap:true,
         nomen:true, plusplus:true, regexp:true,
         sloppy:true, vars:true, white:true,
         maxlen:100
*/

var Anchor = (function() {

    /* DECLARATION */

    
    /**
     * Get the link for the current page
     * and decode the url components.
     *
     * @method href
     */
    var href,

    /**
     * @method path
     * @return An array of strings, representing
     *  that url path navigated. (i.e. coursaic.com/home/default
     *  will give the result ["home", "default"])
     */
        path,

    /**
     * Read the parameters of the
     * uri into a javascript object.
     * This method automatically converts
     * any parameters that are numbers into
     * number from.
     *
     * @method params
     */
        params,

    /**
     * The state for the Anchor module.
     *
     * @private
     * @method stateMap
     * @type Object
     */
        stateMap = {};

    /* Implementation */

    href = function() {
        // TODO: Make sure this is available
        // in all browsers.
        return decodeURIComponent(window.location.href);
    };


    path = function() {
        var pathname = window.location.pathname;
        if (pathname[0] === '/') {
            pathname = pathname.substr(1, pathname.length - 1);
        }
        return pathname.split('/');
    };


    params = function() {
        // Match the parameters for the url.
        // Use "?" as equalivalent to having
        // no parameters for simplified
        // implementation.
        var paramString =  (/\?.+$/.exec(href()) || ["?"])[0];
        return paramString.substr(1, paramString.length - 1)
                          .split('&')
                          .reduce(function(memo, pair) {
                            var keyValue = pair.split('=');
                            if (+keyValue[1] === +keyValue[1]) {
                                // If the value is a number, convert
                                // it to a number.
                                keyValue[1] = +keyValue[1];
                            }
                            memo[keyValue[0]] = keyValue[1];
                            return memo;
                        }, {});
    };
    

    return {href: href, path: path, params: params};

}());

if (typeof require === 'function' && exports) {
    exports.Anchor = Anchor;
}


