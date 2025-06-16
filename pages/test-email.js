import { sendMail } from '../../mailer'

export default async function handler(req, res) {
  try {
    await sendMail({
      to: 'ilus1966@gmail.com',
      subject: 'Test depuis mailer.js',
      text: 'Ceci est un email de test',
      html: '<p><strong>Email de test HTML</strong> depuis <code>mailer.js</code>.</p>'
    })

    console.log("✅ Email de test envoyé")
    res.status(200).json({ message: 'Test email envoyé' })
  } catch (error) {
    console.error("❌ Erreur d'envoi test :", error)
    res.status(500).json({ message: 'Erreur lors de l’envoi du test' })
  }
}

