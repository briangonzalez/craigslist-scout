
var nodemailer = require('nodemailer');
var util = require('util');

function Mailer(options){}

Mailer.prototype.mail = function(options) {

  var sender = options.sender.split(':');

  if ( options.sender === 'false' || options.sender.length < 2 )
    return;

  var email = sender[0];
  var password = sender[1];

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });

  transporter.sendMail({
      from: options.sender,
      to: options.recipients,
      subject: '[CL-SCOUT] ' + options.result.title,
      html: util.format('<p>%s<p><div><img src="%s"><div>', options.result.url, options.result.img)
  });

};

module.exports = new Mailer();
