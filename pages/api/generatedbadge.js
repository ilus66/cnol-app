// pages/api/generatedbadge.js
import { supabase } from '../../lib/supabaseClient'
import { generateBadge } from '../../lib/generateBadge'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ message: 'Paramètre id manquant' })
  }

  // Récupérer l’inscrit
  const { data: inscrit, error } = await supabase
    .from('inscription')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !inscrit) {
    return res.status(404).json({ message: 'Inscrit non trouvé' })
  }

  try {
    // Préparer les données pour le badge
    const userData = {
      name: `${inscrit.prenom} ${inscrit.nom}`,
      function: inscrit.fonction,
      city: inscrit.ville,
      email: inscrit.email,
      userId: `cnol2025-${inscrit.id}`,
    }

    // Générer le PDF (Buffer)
    const pdfBuffer = await generateBadge(userData)

    // Envoyer le PDF en binaire
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `inline; filename="badge-${inscrit.prenom.toLowerCase()}-${inscrit.nom.toLowerCase()}.pdf"`
    )
    // IMPORTANT : use .end() to send raw buffer
    return res.status(200).end(pdfBuffer)
  } catch (err) {
    console.error('Erreur génération badge :', err)
    return res
      .status(500)
      .json({ message: 'Erreur serveur lors de la génération du badge' })
  }
}
