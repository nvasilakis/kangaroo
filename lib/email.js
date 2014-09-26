var pkg = require('../package.json');
var nodemailer = require('nodemailer');

function sendVerification(name, email, callback) {
  var transporter = nodemailer.createTransport();
  if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase.lastIndexOf("prod", 0)) {
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'makesureyoudontreply@gmail.com',
            pass: '1q2w3e4r%T^Y&U*I'
        }
    });
  } 

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'makesureyoudontreply@gmail.com', 
      to: 'nikos.ailo@gmail.com',
      subject: 'title', //'Email Address Confirmation for ' + pkg.name + '  ✔',
      text: 'content' //'Hi there, ' + name + '!\n\n All we need to do is make sure this is your email address for ' + pkg.name + '. \n\n Go to this url: localhost:2046/verify?code=12345\n\n Thanks,\nThe ' + pkg.name + ' team', 
      //html: 'Hi there, <b>' + name + '</b>!\n\n All we need to do is make sure this is <i>your</i> email address for <a href="#">' + pkg.name + '.\n\n: <a href="localhost:2046/verify?code=12345"> verify </a>\n\n Thanks,\nThe ' + pkg.name + ' team',
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback)
  transporter.close();
}

exports.sendVerification = sendVerification
