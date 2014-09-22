function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

var apiKeys = ['7b292b6a1f515410', '37fe7aa2ad307e82', '78d24c9447514608'];

function index (req, res) {
  res.render('index', {
    title: "EJS example",
    header: "Some users"
  });
};

function login (req, res) {
  res.render('index', {
    title: "EJS example",
    header: "Some users"
  });
};

function register (req, res) {
  res.render('index', {
    title: "EJS example",
    header: "Some users"
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
exports.login = login;
exports.register = register;
