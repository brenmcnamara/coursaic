
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var facebookId;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('production' == app.get('env')) {
    facebookId = '275409559335896';
}

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    facebookId = '286659964877522';
}

// Routes

app.get('/', function(req, res) {
    res.render('index', {facebook_id: facebookId});
});

app.get('/course', function(req, res) {
    res.render('course');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
