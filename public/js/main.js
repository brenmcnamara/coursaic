
var WatchDog = require('./WatchDog.js').WatchDog,
    Dispatcher = require('./Dispatcher.js').Dispatcher,
    Stores = require('./Stores'),
    Action = require('./Action.js').Action,
    CAEvent = require('./Event.js').CAEvent,
    View = require('../components');

Parse.initialize("4mcPYbWGU0hIVcVCW5XKMgY5Gtr7UuPlRZkPnWj1", "Bl2qeQ6LdbhLpgi8B2a7nCpeITBs8QBeDsQQlGd8");
window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId      : Config.facebookId,
            cookie     : true, // enable cookies to allow Parse to access the session
            xfbml      : true,
            version    : 'v2.1'
    });

    View.loadOnEvent(CAEvent.Name.DID_LOAD);
    WatchDog.watch();
    Dispatcher.registerStores([ Stores.ConfigStore(), Stores.CourseStore(), Stores.ExamStore(), 
                                Stores.FieldStore(), Stores.PageStore(), Stores.UserStore() ]);
    Action.register();
    Action.send(Action.Name.PERFORM_LOAD, {pageKey: 'home'});
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));