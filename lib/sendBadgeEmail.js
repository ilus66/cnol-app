const { sendMail } = require('./mailer');

async function sendBadgeEmail(to, fullName, pdfData) {
  const htmlBody = `
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Merci pour votre inscription au CNOL 2025. Veuillez trouver ci-joint votre badge nominatif.</p>
    <p>📍 Lieu : Centre de Conférences de la Fondation Mohamed VI, Rabat</p>
    <p>🗓️ Dates : 10, 11 et 12 octobre 2025</p>
    <p>Merci de l’imprimer ou de le présenter sur votre smartphone.</p>
    <br>
    <p>— L’équipe du CNOL</p>
  `;

  const safeName = fullName
    .normalize('NFD') // décompose accents
    .replace(/[\u0300-\u036f]/g, '') // supprime accents
    .replace(/\s+/g, '-') // espaces -> tirets
    .replace(/[^a-zA-Z0-9\-]/g, '') // supprime tout caractère spécial

  const filename = `badge-cnol2025-${safeName.toLowerCase()}.pdf`;


  try {
    const info = await sendMail({
      to,
      subject: 'Votre badge CNOL 2025',
      html: htmlBody,
      attachments: [
        {
          filename,
          content: pdfData,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('✅ Email envoyé à', to);
  } catch (error) {
    console.error('❌ Erreur envoi email :', error);
  }
}

module.exports = sendBadgeEmail;
