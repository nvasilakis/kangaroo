function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

function properties(obj) {
  usr = undefined;
  pkg = require('../package.json');
  obj = obj || {};
  o = { name: obj.name || pkg.name
      , tagline: obj.tagline || pkg.tagline
      , year: obj.year || pkg.year
      , username: obj.username || "Guest"
      , navfix: obj.navfix || "static"
      , nowrap: obj.nowrap || false  // reversed because of "falsy"
      , header: obj.header || "example"
      , stype: obj.stype || "profile"
      , messages: obj.messages || [] // an array of messages
      , css: obj.css || "patch"
      };
  return o
}

var apiKeys = ['7b292b6a1f515410', '37fe7aa2ad307e82', '78d24c9447514608'];

function index (req, res, next) {
  o = {css: "cover", messages: req.session.messages}
  res.render('index', properties(o));
};

function about (req, res, next) {
  o = {css: "carousel", messages: req.session.messages}
  res.render('about', properties(o));
};

function features (req, res, next) {
  o = {css: "carousel", messages: req.session.messages}
  res.render('features', properties(o));
};

function contact (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages};
  res.render('contact', properties(o));
};

function glogin (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages};
  res.render('login', properties(o));
};

function reset (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages};
  res.render('reset', properties(o));
};

function plogin (req, res, next) {
  console.log("Req: " + req.body.sign + " | " +  req.body.email + " | " + req.body.password);
  //res.render('dashboard', properties());
  if (req.body.sign == "in") {
    var authUsr = require('../lib/db').authUsr;
    authUsr(req.body.email, req.body.password, function(err, user){
      if (user) {
        console.log("Successful login " + user.email);
        console.log("is user verified? " + user.verified);
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user; 
          if (! user.verified) {
            req.session.messages = [{role: "alert", type: "warning", 
              content: "Your email address is not verified! <a href='#'>Resend email</a>"}]
          }
          console.log("Creating session for " + req.session.user);
          console.log("o = " + req.query.o);
          res.redirect('/dashboard');
        });
      } else {
        console.log("failed login");
        req.session.messages = [{role: "alert", type: "danger", 
          content: "Incorrect user name or password"}]
        res.redirect('/login');
      }
    });
  } else {
    // TODO: Check validity! (client + server side)
    var db = require("../lib/db")
    db.usrExists(req.body.email, function(err, user) {
      if (user) {
        console.log("user exists");
        req.session.messages = [{role: "alert", type: "danger", 
          content: "The username you selected already exists in the databse"}]
        res.redirect('/'); // TODO: Utilize messaging 
      } else {
        db.addUser(req.body.email, req.body.password, function() {
          console.log("Successful signup"); // TODO: error and result params???
          req.session.regenerate(function(){
            req.session.user = {email: req.body.email}
            req.session.messages = [{role: "alert", type: "warning", 
              content: "Your email address (" + req.body.email + ") is not verified! Check your inbox (or <a href='#'>resend email</a>)."}]
            req.session.messages = req.session.messages.concat( [{role: "alert", type: "info", 
              content: ("Pssst! Since it's your first time around, you might want to follow <a href=#>the tutorial</a> or <a href=#>import your contacts</a>!") }])
            res.redirect('/dashboard');
          });
        });
      }
    });
  };
};

function logout (req, res, next) {
  req.session.destroy(function(){
    res.redirect('/');
  });
};

// Send user to login
function isUserLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!'; // TODO: Utilize session messaging!
    //for (var k in req) { if (req.hasOwnProperty(k)) console.log(k + " => " + req[k])}
    console.log("original URL" + req.originalUrl)
    var rslt = ((req.originalUrl == "/" || req.originalUrl == "/index")? "" : ("?o=" + encodeURIComponent(req.originalUrl)));
    console.log("res" + rslt);
    res.redirect('/' + rslt);
  }
}

function register (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages};
  res.render('index', properties(o));
};

// Need to pipe-in "restrict"
function dashboard (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages, username: req.session.user.email};
  res.render('dashboard', properties(o));
};

function edit (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages, username: req.session.user.email};
  res.render('edit', properties(o));
};

function profile (req, res, next) {
  // issue DB Request
  console.log("Trying to go for profile")
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "profile"};
  res.render('settings', properties(o));
};

function account (req, res, next) {
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "account"};
  res.render('settings', properties(o));
};

function notifications (req, res, next) {
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "notifications"};
  res.render('settings', properties(o));
};

function security (req, res, next) {
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "security"};
  res.render('settings', properties(o));
};

function newAdd (req, res, next) {
  o = {css: "carousel", nowrap: true, messages: req.session.messages, username: req.session.user.email};
  res.render('new', properties(o));
};


function apiPre(req, res, next){
  var token = req.query['token'];
  if (!token) return next(error(400, 'api key required')); // key not present or..
  if (!~apiKeys.indexOf(token)) return next(error(401, 'invalid api key')); // invalid
  // all good, store req.key for route access
  req.token = token;
  //next();
  console.log('api-pre complete!!');
  res.set('Access-Control-Allow-Origin', '*');
  res.json({status:"OK"})
};

/**
 * Sends a subscription email (later to be used by forms)
 * Current API:
 * /sendMail/subscribe?token=123&address='whah@wawa.ca'
 */
function sendMail(req, res, next){
  var token = req.query['token'];
  if (!token) return next(error(400, 'api key required')); // key not present or..
  if (!~apiKeys.indexOf(token)) return next(error(401, 'invalid api key')); // invalid
  // all good, store req.key for route access
  req.token = token;
  console.log('token complete!');
  next();
}

function subscribe(req, res, next) {
  var email = req.params.email;
  if (!email) {res.json(400, {error: 'No Valid email'})}
  writeEmail("\n"+email);
  res.set('Access-Control-Allow-Origin', '*');
  res.json({status:"OK"});
}

function writeEmail(email) {
  var fs = require('fs');
  fs.appendFile('subscribed.txt', email, function (err) {
    if (err) console.log('Could not append to file!');
    console.log(email + ' saved!');
  });
}

exports.subscribe = subscribe;
exports.sendMail = sendMail;
exports.apiPre = apiPre;
exports.index = index;
exports.about = about;
exports.features = features;
exports.contact = contact;
exports.plogin = plogin;
exports.glogin = glogin;
exports.reset = reset;
exports.logout = logout;
exports.isUserLoggedIn = isUserLoggedIn;
exports.register = register;
exports.add = newAdd;
exports.edit = edit;
exports.dashboard = dashboard;

exports.profile = profile;
exports.account = account;
exports.notifications = notifications;
exports.security = security;
