const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.cnol.ma',
  port: 465,
  secure: true, // true car on utilise le port 465 (SSL)
  auth: {
    user: 'inscription@cnol.ma',
    pass: 'BLh9Qhnlo2CH'
  }
});
