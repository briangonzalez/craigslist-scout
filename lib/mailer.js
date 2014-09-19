
var nodemailer = require('nodemailer');
var transporter;

function Mailer(options){}

Mailer.prototype.send = function(options) {

  transporter = transporter || nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sender@gmail.com',
      pass: 'password'
    }
  });

  transporter.sendMail({
      from: 'sender@address',
      to: recipients,
      subject: '[Hound] New Item:' + options.result.title,
      text: 'hello world!'
  });

};

module.exports = new Mailer();
