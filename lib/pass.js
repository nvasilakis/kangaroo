//Adapted from express examples
var crypto = require('crypto');
var db = require('./db');

var len = 128;
var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

function hash (pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash.toString('base64'));
      });
    });
  }
};

// TODO: Change with DB
// auth_users, unauth_users
var users = { name: "admin@localhost"
            , password: "z/eVNgzKPyHPzPDATEuZcOuTNYuynLPdaDTczHtpC+2FwabeU7lH0cdzCeiSyZBHI318AFjF7D91C1Mk7RxfuAFkn/aMAiKnERDyuypgi4vsZWNhPI+tH9NCPvCWNBzLHD85Smt91jIkcBMYCrlI5FJ3JA43vN16lrN7hGRwRyw="
            , salt: "tVRWNYxGBFpXZ3pDwD9UELQFlPW4vCeHKEcgzYLNuZpDADqk8dwDpOFNLYOlkG5+iUMYJU79unvgk98y2fheSpQMLfNMMNH5rxMi2qWwFYLyY95hhUjYmc5CU7iOv8+PHT4+YBqeMKTSweP02NGb8np0oI1z9UGnCg7BTr8Spts="}
function auth (name, pass, fn) {
  console.log("*** Trying auth ***");
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  console.log("*** Trying auth ***");
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  console.log("*** Trying auth ***");
  
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){
    if (err) return fn(err);
    console.log(hash);
    console.log(user.password);
    if (hash == user.password) return fn(null, user);
    fn(new Error('invalid password'));
  });
}
exports.auth = auth
exports.hash = hash
