
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');

// New application
var app = express();
app["pkg"] = require('./package.json');

// all environments | middleware
app.set('port', process.env.PORT || 2046);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// before router
app.use(express.responseTime());
app.use(app.router);

var routes = require('./routes/routes')(app);

/*
 * ## Content ##
 * Currently, all views are  static html pages (production-served via nginx)
 * utilizing ajax-based API through node
 */
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
//app.use('/static', express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/public/css'));


// development only
if ('development' == app.get('env')) {
  app.locals.pretty = true;
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log(app["pkg"].name + ' server listening on port ' + app.get('port'));
});
