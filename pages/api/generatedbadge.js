import { generateBadge } from '../../lib/generatebadge';

export default async function handler(req, res) {
  try {
    // Exemple : récupère les données utilisateur depuis la requête (POST JSON)
    const userData = req.body;

    // Génère le PDF en mémoire
    const pdfBytes = await generateBadge(userData);

    // Renvoie le PDF avec le bon header
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=badge-${userData.userId}.pdf`);
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erreur dans /api/generatedbadge:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du badge' });
  }
}
