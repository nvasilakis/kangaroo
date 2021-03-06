// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var redis = require("redis"),
    client = redis.createClient();
var bodyParser = require('body-parser');
var session = require('express-session');

// New application
var app = express();
app["pkg"] = require('./package.json');

// Static Content (sequencing first, served by prod from ngingx)
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));

// all environments | middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

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
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');


// development only
if ('development' == app.get('env')) {
  app.locals.pretty = true;
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log(app["pkg"].name + ' server listening on port ' + app.get('port'));
});
