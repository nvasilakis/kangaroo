var pkg = require('../package.json');
var utils = require('../lib/utils');
var nodemailer = require('nodemailer');

var USER = (utils.isProd? ("noreply@"+pkg.homepage) : 'makesureyoudontreply@gmail.com')

/** Just a wrapper for sendMail */
function sendVerification(name, email, callback) {

  // setup e-mail data with unicode symbols
  from =, 
  to = email,
  subject = 'Email Address Confirmation for ' + pkg.name + '  ✔',
  text  = 'Hi there, ' + name + '!\n\n All we need to do is make sure this is your email address for ' + pkg.name + '. \n\n Go to this url: localhost:2046/verify?code=12345\n\n Thanks,\nThe ' + pkg.name + ' team', 
  html = 'Hi there, <b>' + name + '</b>!\n\n All we need to do is make sure this is <i>your</i> email address for <a href="#">' + pkg.name + '.\n\n: <a href="localhost:2046/verify?code=12345"> verify </a>\n\n Thanks,\nThe ' + pkg.name + ' team',
  sendEmail(
}

function sendEmail(name, email, subject, text, html, callback) {
  var transporter = nodemailer.createTransport();
  if (! utils.isProd()) {
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'makesureyoudontreply@gmail.com',
            pass: '1q2w3e4r%T^Y&U*I'
        }
    });
  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback)
  transporter.close();
  } 
}

exports.sendVerification = sendVerification
exports.sendEmail = sendEmail
