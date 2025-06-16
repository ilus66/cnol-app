const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.cnol.ma',
  port: 465,
  secure: true,
  auth: {
    user: 'inscription@cnol.ma',
    pass: 'BLh9Qhnlo2CH',
  },
});

function sendMail({ to, subject, text, html, attachments }) {
  return transporter.sendMail({
    from: '"CNOL 2025" <inscription@cnol.ma>',
    to,
    subject,
    text,
    html,
    attachments,
  });
}

module.exports = { sendMail };


