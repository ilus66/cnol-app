const { sendMail } = require('./mailer');

(async () => {
  try {
    const info = await sendMail({
      to: 'ilus1966@gmail.com', // 👉 mets ton email ici
      subject: 'Test email depuis le serveur',
      html: '<h1>Ça fonctionne !</h1><p>Email envoyé depuis le serveur Replit.</p>',
    });
    console.log('✅ Email envoyé !', info.messageId);
  } catch (error) {
    console.error('❌ Erreur envoi email :', error);
  }
})();