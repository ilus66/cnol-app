import { supabase } from '../../lib/supabaseClient';
import { generateBadge } from '../../lib/generateBadge';
import sendBadgeEmail from '../../lib/sendBadgeEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID manquant' });
  }

  try {
    // 1. Récupérer l'inscription
    const { data: inscrit, error } = await supabase
      .from('inscription')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !inscrit) {
      return res.status(404).json({ message: "Inscription non trouvée" });
    }

    if (inscrit.valide) {
      return res.status(400).json({ message: "Inscription déjà validée" });
    }

    // 2. Mise à jour du statut valide
    const { data: updated, error: updateError } = await supabase
      .from('inscription')
      .update({ valide: true })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: "Erreur lors de la validation" });
    }

    // 3. Générer le badge PDF
    const pdfBuffer = await generateBadge({
      name: `${updated.prenom} ${updated.nom}`,
      function: updated.fonction,
      city: updated.ville,
      email: updated.email,
      userId: `cnol2025-${updated.id}`,
    });

    // 4. Envoyer l'e-mail avec le badge en pièce jointe
    await sendBadgeEmail(
      updated.email,
      `${updated.prenom} ${updated.nom}`,
      pdfBuffer
    );

    return res.status(200).json({ message: 'Inscription validée et mail envoyé.' });
  } catch (error) {
    console.error('❌ Erreur API validate:', error);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}
