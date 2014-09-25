var pkg = require('../package.json');
var redis = require("redis"),
    client = redis.createClient();
var crypto = require("crypto");

var len = 128;
var iterations = 12000;
var NS = pkg.name + "DEV:";

/**
 * hash password using salt
 */
function hash (pwd, salt, fn) {
  log("Calculating hash " + pwd + "\n" + salt)
  crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
    //log("Calculating hash " + pwd + "\n" + salt)
    fn(err, hash.toString('base64'));
  });
};

function generateLogger() {
  console.log("Generating logger");
  if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase.lastIndexOf("prod", 0)) {
    return function (msg) { }; //suppress
  } else {
    return function (msg) { console.log("[DB][" + NS + "] " + msg)}; 
  }
}

var log = generateLogger();

/* Database ATM has basically this form
 * <Namespace>users: list of user login credentials (email addresses)
 * <Namespace><uid>: credentials => {salt: <salt>,  password: <password>,  verified: T/F}
 */

function addUser (email, password, callback) {
  log("Adding " + email);
  client.SADD(NS+"users", email);
  var salt = crypto.randomBytes(128).toString('base64');
  hash(password, salt, function(err, hashedPassword){
    if (err) throw err;
    credentials = {"salt": salt, "password": hashedPassword, "verified": false}
    log("Inserting credentials " + JSON.stringify(credentials));
    client.HSET(NS+email, "credentials", JSON.stringify(credentials), redis.print);
    callback()
  });
}

function delUser (email, callback) {
  log("Deleting " + email);
  client.SREM(NS+"users", email);
  client.HDEL(NS+email, callback);
}

// TODO: How to handle JSON.parse() in here?
function getPswd (email, callback) {
  log("Fetching " + email);
  client.HGET(NS+email, "credentials", callback);
}

function usrExists (email, callback) {
  log("Exists? " + email);
  return client.SISMEMBER(NS+"users", email, callback);
}

function authUsr (id, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', id, pass);
  usrExists(id, function(err, res) {
    if (err) return fn(err);
    if (res) {
      getPswd(id, function(err, res) {
        if (err) return fn(err);
        if (res) {
          var user = JSON.parse(res)
          log("Got credentials " + res);
          hash(pass, user.salt, function(err, hash){
            if (err) return fn(err);
            if (hash == user.password) {
              // Create user object with the wanted properties
              facade = {email: id, verified: user.verified}
              return fn(null, facade);
            }
            fn(new Error('invalid password'));
          });
        } else {
          return fn(new Error('something weird happened'));
        }
      }); //getPswd
    } else {
      return fn(new Error('cannot find user'));
    }
  });
}

exports.addUser = addUser
exports.delUser = delUser
exports.getPswd = getPswd
exports.authUsr = authUsr
exports.usrExists = usrExists
