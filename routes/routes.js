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
  app.get('/index', bp.index);
  app.get('/about', bp.about);
  app.get('/features', bp.features);
  app.get('/contact', bp.contact);
  app.get('/email/subscribe/:email/', bp.subscribe);
  app.post('/login', bp.plogin);
  app.get('/login', bp.glogin);
  app.get('/reset', bp.reset);
  app.get('/logout', bp.logout);
  app.get('/register', bp.register);
  app.get('/dashboard', bp.isUserLoggedIn, bp.dashboard);
  app.get('/edit', bp.isUserLoggedIn, bp.edit);
  app.get('/new', bp.isUserLoggedIn, bp.add);

  app.get('/settings', bp.isUserLoggedIn, bp.profile);
  app.get('/settings/profile', bp.isUserLoggedIn, bp.profile);
  app.get('/settings/account', bp.isUserLoggedIn, bp.account);
  app.get('/settings/notifications', bp.isUserLoggedIn, bp.notifications);
  app.get('/settings/security', bp.isUserLoggedIn, bp.security);

  app.post('/settings/profile', bp.isUserLoggedIn, bp.pprofile);
  app.post('/settings/account', bp.isUserLoggedIn, bp.paccount);
  app.post('/settings/notifications', bp.isUserLoggedIn, bp.pnotifications);
  app.post('/settings/security', bp.isUserLoggedIn, bp.psecurity);

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
