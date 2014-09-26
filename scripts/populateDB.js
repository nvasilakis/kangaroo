#!/usr/bin/env node

/**
 * Populate Kangaroo example DB with some user data
 * Requirements: `redis-server` (look at kangaroo.sh) 
 */
var db = require("../lib/db")

var kl = process.kill;
var id = function () {};

function populate() {
  console.log("Generating admin account");
  db.addUser("admin@localhost", "1q2w3e4r", id); //TODO: Add to local config file
  db.addUser("o", "o", id)
};

if (process.argv.length > 2 && process.argv[2].indexOf("force") > -1) {
  populate()
} else {
  db.exists("admin@localhost", function(e,r){
    if (e) {console.warn("There was an error with the DB")}
    if (r) {
      console.log("Admin account exists for this namespace. Exiting");
    } else {
      populate()
    }
  });
}
