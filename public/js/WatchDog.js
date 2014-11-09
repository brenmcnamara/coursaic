/**
 * WatchDog.js
 */

var WatchDog = (function() {

    /* DECLARATION */

    var

    /**
     *
     */
        watch;

    /* IMPLEMENTATION */

    watch = function() {
        Anchor.onChange(function(hash) {
            switch (hash.key) {
            case 'course':
                Action.send(Action.Name.PERFORM_LOAD,
                            {updateHash: false, pageKey: 'course', course: hash.course});
                break;
            default:
                Action.send(Action.Name.PERFORM_LOAD,
                            {updateHash: false, pageKey: hash.key});
            }
        });
    };

    return { watch: watch };

}());