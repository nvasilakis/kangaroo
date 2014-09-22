
/*
 * GET home page.
 */

exports.index = function(req, res){
  //render for template engine
  res.render('index', { title: 'Express' });
  //fail();
};