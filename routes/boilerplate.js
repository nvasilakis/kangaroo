function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

var apiKeys = ['7b292b6a1f515410', '37fe7aa2ad307e82', '78d24c9447514608'];

function index (req, res, next) {
  res.render('index', {
    title: "EJS example",
    header: "Some users",
    css: "cover"
  });
};

function about (req, res, next) {
  res.render('about', {
    title: "EJS example",
    header: "Some users",
    css: "carousel"
  });
};

function features (req, res, next) {
  res.render('features', {
    title: "EJS example",
    header: "Some users",
    css: "carousel"
  });
};

function contact (req, res, next) {
  res.render('contact', {
    title: "EJS example",
    header: "Some users",
    css: "carousel"
  });
};

function login (req, res, next) {
  res.render('index', {
    title: "EJS example",
    header: "Some users",
    css: "carousel"
  });
};

function register (req, res, next) {
  res.render('index', {
    title: "EJS example",
    header: "Some users",
    css: "carousel"
  });
};

function dashboard (req, res, next) {
  res.render('dashboard', {
    title: "EJS example",
    header: "Some users",
    css: "patch"
  });
};

function edit (req, res, next) {
  res.render('edit', {
    title: "EJS example",
    header: "Some users",
    css: "patch"
  });
};

function settings (req, res, next) {
  res.render('settings', {
    title: "EJS example",
    header: "Some users",
    css: "patch"
  });
};


function newAdd (req, res, next) {
  res.render('new', {
    title: "EJS example",
    header: "Some users",
    css: "patch"
  });
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
exports.register = register;
exports.add = newAdd;
exports.settings = settings;
exports.edit = edit;
exports.dashboard = dashboard;
