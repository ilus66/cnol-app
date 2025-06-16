import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const { qrCode } = req.body

  if (!qrCode) return res.status(400).json({ error: "QR code manquant" })

  const { data: inscrit, error } = await supabase
    .from('inscrits')
    .select('*')
    .eq('qr_code', qrCode)
    .single()

  if (error || !inscrit) return res.status(404).json({ error: "Inscrit non trouvé" })

  // si déjà scanné, ne rien faire
  if (inscrit.scanned) return res.status(200).json({ message: "Déjà scanné" })

  const { error: updateError } = await supabase
    .from('inscrits')
    .update({ scanned: true, scanned_at: new Date() })
    .eq('id', inscrit.id)

  if (updateError) return res.status(500).json({ error: "Erreur enregistrement" })

  res.status(200).json({ message: `Entrée validée pour ${inscrit.prenom} ${inscrit.nom}` })
}
