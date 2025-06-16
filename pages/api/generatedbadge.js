import { generateBadge } from '../../lib/generateBadge';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const userData = req.body;

    // Validation minimale (optionnelle mais recommandée)
    if (!userData || !userData.name || !userData.userId) {
      return res.status(400).json({ error: 'Données utilisateur manquantes ou incomplètes' });
    }

    // Générer le PDF
    const pdfBytes = await generateBadge(userData);

    // Envoyer le fichier PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=badge-${userData.userId}.pdf`);
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('❌ Erreur dans /api/generatedbadge:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du badge' });
  }
}
