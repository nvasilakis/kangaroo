
/*
 * GET users listing.
 */
var fs = require('fs');

exports.list = function(req, res){
  // res.set({keys: values}) in a generic route and next()
  //res.send("respond with a resource");
  console.log(fs.readdirSync("."));
  res.sendfile('README');
};
