/*
 Static Routes
 Can group up based on resourceful (RESTful) or namespaced routing

 responses:
 res.send(), res.json(), res.jsonp(), res.sendfile(), res. download(), res.render(), or res.redirect()
 */
var bp = require('./boilerplate');

/*
 * N.b.: routes are checked in sequence
 */
module.exports = function (app) {
  app.get('/', bp.index);
  app.get('/email/subscribe/:email/', bp.subscribe);
  app.get('/login', bp.login);
  app.get('/register', bp.register);

  // TODO: custom error pages!
  // custom error middleware
  app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
  });

  //JSON 404 middleware
  app.use(function(req, res){
    res.send(404, { error: "Lame, can't find that" });
  });
}
