
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

var facebookId,
    parseAppId,
    parseJavascriptId;

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


if ('production' == app.get('env')) {
    parseAppId = "4mcPYbWGU0hIVcVCW5XKMgY5Gtr7UuPlRZkPnWj1";
    parseJavascriptId = "Bl2qeQ6LdbhLpgi8B2a7nCpeITBs8QBeDsQQlGd8";
}

if ('development' == app.get('env')) {
    parseAppId = "bqOzIc6tRKSBgQ3rxnQUqimHD0j9ltXtr1UtJNDW";
    parseJavascriptId = "TEYdxshX9sPiqLqmYOQi3pLEALRhxnhip9Cd7DAl";
}

// Routes

app.get('/', function(req, res) {
    res.render('index', { parse_app_id: parseAppId,
                          parse_javascript_id: parseJavascriptId,
                          NODE_ENV: app.get('env') });
});

app.get('/course', function(req, res) {
    res.render('course');
});

app.get("/fatal", function (req, res) {
  res.render('fatal');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
