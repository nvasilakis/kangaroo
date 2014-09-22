
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
 * ## Views ##
 * Currently, all views are  static html pages (production-served via nginx)
 * utilizing ajax-based API through node
 */
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// development only
if ('development' == app.get('env')) {
  app.locals.pretty = true;
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log(app["pkg"].name + ' server listening on port ' + app.get('port'));
});
