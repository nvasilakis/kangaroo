#!/usr/bin/env node

/**
 * Populate Kangaroo example DB with some user data
 * Requirements: `redis-server` (look at kangaroo.sh) 
 */
var db = require("../lib/db")

function populate() {
  console.log("Generating admin account");
  db.addUser("admin@localhost", "1q2w3e4r", process.kill); //TODO: Add to local config file
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
