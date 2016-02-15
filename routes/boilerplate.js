var db = require('../lib/db');
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// Need to make this actually concatenate wanted properties
function properties(obj) {
  usr = undefined;
  pkg = require('../package.json');
  obj = obj || {};
  o = { name: obj.name || pkg.name
      , tagline: obj.tagline || pkg.description
      , year: obj.year || pkg.year
      , username: obj.username || "Guest"
      , navfix: obj.navfix || "static"
      , nowrap: obj.nowrap || false  // reversed because of "falsy"
      , header: obj.header || "example"
      , stype: obj.stype || "profile"
      , messages: obj.messages || [] // an array of messages
      , data: obj.data || {}
      , redirect: obj.redirect || ""
      , css: obj.css || "patch"
      };
  return o
}

var apiKeys = ['7b292b6a1f515410', '37fe7aa2ad307e82', '78d24c9447514608'];

function index (req, res, next) {
  o = {css: "cover", messages: req.session.messages, redirect: req.query.o}
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
  console.log("REDIRECT: " + req.query.o)
  //res.render('dashboard', properties());
  if (req.body.sign == "in") {
    db.authUsr(req.body.email, req.body.password, function(err, user){
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

          console.log("Creating session for " + req.session.user); // TODO: Add name

          console.log("o = " + req.body.redirect);
          if (req.body.redirect) {
            res.redirect(decodeURIComponent(req.body.redirect));
          } else {
            res.redirect('/dashboard');
          }
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
             req.session.user = {email: req.body.email} //TODO: Add usename!
             req.session.messages =  [{role: "alert", type: "info",
               content: ("Pssst! Since it's your first time around, you might want to follow <a href=#>the tutorial</a> or <a href=#>import your contacts</a>!") }]
             req.session.messages = req.session.messages.concat([{role: "alert", type: "warning",
               content: "Your email address (" + req.body.email + ") is not verified! Check your inbox (or <a href='#'>resend email</a>)."}])
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
  console.log("=> 1");
  db.getProfile(req.session.user.email, function(e, r) {
    if (e) {
      msg = [{role: "alert", type: "danger", content: "There was an error with the request: (" + e +")" }]
      o = { css: "carousel", nowrap: true, messages: msg
          , username: req.session.user.email, stype: "profile"
          , data: {pemail: "", name: "", locn: "", social: "", url: ""}};
    }
    if (r) {
      console.log(r);
      o = { css: "carousel", nowrap: true, messages: req.session.messages
          , username: req.session.user.email, stype: "profile"
          , data: JSON.parse(r)};
    } else {
      console.log(e)
      msg = [{role: "alert", type: "danger", content: "There was an error with the request: (" + e +")" }]
      o = { css: "carousel", nowrap: true, messages: msg
          , username: req.session.user.email, stype: "profile"
          , data: {pemail: "", name: "", locn: "", social: "", url: ""}};
    }
    res.render('settings', properties(o));
  });
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

function pprofile (req, res, next) {
  data = { name: req.body.name || ""
         , pemail: req.body.email || ""
         , url: req.body.url || ""
         , social: req.body.social || ""
         , locn: req.body.locn || "" }
  db.setProfile(req.session.user.email, data, function (e) {
    console.log("data: "+JSON.stringify(data));
    if (e) {
      msg = [{role: "alert", type: "danger", content: "There was an error with the request: (" + e +")" }]
    } else {
      msg = [{role: "alert", type: "info", content: "Your profile settings have been saved"}]
    }
    o = { css: "carousel", nowrap: true, messages: msg
      , username: req.session.user.email, stype: "profile", data: data};
    res.render('settings', properties(o));
  });
};

function paccount (req, res, next) {
  console.log("Account post: " + req.body.submit)
  switch (req.body.submit) {
  case "password":
    if (req.body.newpassword1 == req.body.newpassword2) {
      console.log("--> " + req.body.newpassword1);
      db.setPswd(req.session.user.email, req.body.oldpassword, req.body.newpassword1, function(e) {
        if (e) {
            msg = [{role: "alert", type: "danger", content: e}]
        } else {
          msg = [{role: "alert", type: "info", content: "Your profile settings have been saved"}]
        }
          o = { css: "carousel", nowrap: true, messages: msg
              , username: req.session.user.email, stype: "account" };
          res.render('settings', properties(o));
      });
    } else {
      msg = [{role: "alert", type: "danger", content: "Passwords do not match!"}]
      o = { css: "carousel", nowrap: true, messages: msg
          , username: req.session.user.email, stype: "account" };
      res.render('settings', properties(o));
    }
    break;
  case "delete":
    if (req.body.verif == "DELETE") {
      db.delUser(req.session.user.email, function(e) {
        //msg = [{role: "alert", type: "info", content: "We are still going to miss you " + req.session.user.email + ", and hope to see you back again!"}]
        //o = {css: "cover", messages: msg}
        req.session.destroy(function(){
          res.redirect('/');
        });
      });
    } else {
      msg = []
      o = { css: "carousel", nowrap: true, messages: msg
          , username: req.session.user.email, stype: "notifications"};
      res.render('/settings/account', properties(o));
    }
    break;
  case "login":
    res.render('settings', properties(o));
    break;
  }
    
};

// This is going to be Ajax-based
function sendverify (req, res, next) {
  var nm = req.user.name
  var em = req.user.email
  var email = require('../lib/email')
  email.sendVerification(nm, em, function(e, i){
    if (e) {
      console.log("Error sending email to " + nm + "<" + em + ">");
      res.json({result: "error", details: e})
    } else {
      console.log('Message sent: ' + i.response);
      res.json({result: "success", details: i.response})
    }
  });
};

function verify (req, res, next) {
  msg = [{role: "alert", type: "info", content: "Your notification settings are saved"}]
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "notifications"};
  res.render('settings', properties(o));
};

function pnotifications (req, res, next) {
  msg = [{role: "alert", type: "info", content: "Your notification settings are saved"}]
  o = { css: "carousel", nowrap: true, messages: req.session.messages
      , username: req.session.user.email, stype: "notifications"};
  res.render('settings', properties(o));
};


function psecurity (req, res, next) {
  msg = [{role: "alert", type: "info", content: "Your profile settings are saved"}]
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
exports.pprofile = pprofile;
exports.paccount = paccount;
exports.pnotifications = pnotifications;
exports.psecurity = psecurity;

exports.verify = verify
exports.sendverify = sendverify
