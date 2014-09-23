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
      , css: obj.css || "patch"
      };
  return o
}

var apiKeys = ['7b292b6a1f515410', '37fe7aa2ad307e82', '78d24c9447514608'];

function index (req, res, next) {
  res.render('index', properties({css: "cover"}));
};

function about (req, res, next) {
  res.render('about', properties({css: "carousel"}));
};

function features (req, res, next) {
  res.render('features', properties({css: "carousel"}));
};

function contact (req, res, next) {
  o = {css: "carousel", nowrap: true};
  res.render('contact', properties(o));
};

function login (req, res, next) {
  console.log("Req: " + req.body.sign + " | " +  req.body.email + " | " + req.body.password);
  //res.render('dashboard', properties());
  if (req.body.sign == "in") {
    var authUsr = require('../lib/db').authUsr;
    authUsr(req.body.email, req.body.password, function(err, user){
      if (user) {
        console.log("Successful login " + user);
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          console.log(user);
          req.session.user = user;
          req.session.success = 'Authenticated as ' + user.name
            + ' click to <a href="/logout">logout</a>. '
            + ' You may now access <a href="/restricted">/restricted</a>.';
          console.log("Creating session for " + req.session.user);
          res.redirect('/dashboard');
        });
      } else {
        console.log("failed login");
        req.session.error = 'Authentication failed, please check your '
          + ' username and password.'
          + ' (use "tj" and "foobar")';
        res.redirect('/again');
      }
    });
  } else {
    // TODO: Check validity! (client + server side)
    var db = require("../lib/db")
    db.addUser(req.body.email, req.body.password, function() {
      console.log("Successful signup"); // TODO: error and result params???
      req.session.regenerate(function(){
        req.session.user = {email: req.body.email}
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/dashboard?ut=n'); //usertype = new
      });
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
    res.redirect('/');
  }
}

function register (req, res, next) {
  res.render('index', properties({css: "carousel"}));
};

// Need to pipe-in "restrict"
function dashboard (req, res, next) {
  console.log("Creating dashboard for " + req.session.user.email);
  res.render('dashboard', properties({username: req.session.user.email}));
};

function edit (req, res, next) {
  res.render('edit', properties());
};

function settings (req, res, next) {
  res.render('settings', properties());
};

function newAdd (req, res, next) {
  res.render('new', properties());
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
exports.login = login;
exports.logout = logout;
exports.isUserLoggedIn = isUserLoggedIn;
exports.register = register;
exports.add = newAdd;
exports.settings = settings;
exports.edit = edit;
exports.dashboard = dashboard;
