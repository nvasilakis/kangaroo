function getLocation (ip, fn) {
  var http = require('http');
  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
    host: 'ipinfo.io',
    path: ip
  };

  callback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      console.log("getLocation result: ", str);
      fn(JSON.parse(str))
    });
  }

  http.request(options, callback).end();
}
