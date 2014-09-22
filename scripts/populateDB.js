#!/usr/bin/env node

/**
 * Populate Kangaroo example DB with some user data
 * Requirements: `redis-server` (look at kangaroo.sh) 
 */


var redis = require("redis"),
    client = redis.createClient();
var hash = require("../lib/pass").hash;
var crypto = require("crypto");

var NS = "kangarooDEV:"; // namespace

var salt1 = crypto.randomBytes(128).toString('base64');
client.hset(NS+"admin@localhost", "email", "nikos@vasilak.is", redis.print);
client.hset(NS+"admin@localhost", "salt", salt1, redis.print);
hash('1q2w3e4r', function(err, salt, hash){
  if (err) throw err;
  client.hset(NS+"admin@localhost", "password", hash, redis.print);
});

process.kill();
