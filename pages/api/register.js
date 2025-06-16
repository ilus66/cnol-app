import { supabase } from '../../lib/supabaseClient'
import { sendMail } from '../../lib/mailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const user = req.body

  try {
    // Insert dans Supabase
    const { error } = await supabase.from('inscription').insert([user])
    if (error) throw error

    // Envoi email à l'utilisateur
    await sendMail({
      to: user.email,
      subject: 'Confirmation d’inscription - CNOL 2025',
      text: `Bonjour ${user.prenom},

Merci pour votre inscription au CNOL 2025 !
Votre inscription est bien reçue et sera validée par notre équipe.
Une fois validée, votre badge vous sera envoyé par email.

À très bientôt !
L'équipe CNOL 2025`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; line-height:1.6; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
        <h2 style="color: #0070f3;">Bonjour ${user.prenom},</h2>
        <p>Merci pour votre inscription au <strong>CNOL 2025</strong> !</p>
        <p>Votre inscription est bien reçue et sera <strong>validée par notre équipe</strong>.</p>
        <p><strong>Une fois validée, votre badge vous sera envoyé par email.</strong></p>
        <p>Nous avons hâte de vous accueillir lors de cet événement incontournable de l'optique au Maroc.</p>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
        <p style="font-size: 0.9em; color: #666;">
          Pour toute question, contactez-nous à <a href="mailto:cnol.maroc@gmail.com">cnol.maroc@gmail.com</a><br />
          &copy; 2025 CNOL. Tous droits réservés.
        </p>
      </div>`
    })

    // Envoi email à l’organisateur
    await sendMail({
      to: 'cnol.badge@gmail.com',
      subject: `📥 Nouvelle inscription - ${user.prenom} ${user.nom}`,
      text: `Nouvelle inscription reçue :

Nom : ${user.nom}
Prénom : ${user.prenom}
Email : ${user.email}
Téléphone : ${user.telephone}
Fonction : ${user.fonction}
Ville : ${user.ville}
Date : ${new Date().toLocaleString()}`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; max-width:600px; margin:auto; padding:25px; border:1px solid #ddd; border-radius:10px; background:#ffffff;">
        <h2 style="color:#0070f3;">📥 Nouvelle inscription reçue</h2>
        <table style="width:100%; border-collapse:collapse; margin-top:15px;">
          <tr><td style="padding:8px; font-weight:bold;">Nom :</td><td style="padding:8px;">${user.nom}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Prénom :</td><td style="padding:8px;">${user.prenom}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Email :</td><td style="padding:8px;">${user.email}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Téléphone :</td><td style="padding:8px;">${user.telephone}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Fonction :</td><td style="padding:8px;">${user.fonction}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Ville :</td><td style="padding:8px;">${user.ville}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Date :</td><td style="padding:8px;">${new Date().toLocaleString()}</td></tr>
        </table>
      </div>`
    })

    res.status(200).json({ message: 'Inscription enregistrée et emails envoyés' })
  } catch (err) {
    console.error('Erreur API /register:', err)
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' })
  }
}
