import React, { useEffect, useState } from 'react'
import { 
  Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  CircularProgress, Stack, Pagination
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const participantTypes = [
  { value: 'exposant', label: 'Exposant' },
  { value: 'intervenant', label: 'Intervenant' },
  { value: 'vip', label: 'VIP' },
  { value: 'opticien', label: 'Opticien' },
  { value: 'ophtalmologue', label: 'Ophtalmologue' },
  { value: 'orthoptiste', label: 'Orthoptiste' },
  { value: 'étudiant', label: 'Étudiant' },
  { value: 'presse', label: 'Presse' },
  { value: 'autre', label: 'Autre' },
]

const sponsoringLevels = [
  { value: 'platinum', label: 'Platinum' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
]

const statusFilters = [
  { value: '', label: 'Tous statuts' },
  { value: 'validated', label: 'Validé' },
  { value: 'pending', label: 'Non validé' },
]

const PAGE_SIZE = 10

export default function Admin() {
  const [inscriptions, setInscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    participant_type: 'exposant',
    sponsoring_level: 'platinum',
    email: '',
    telephone: '',
    ville: '',
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchInscriptions()
  }, [page, search, typeFilter, statusFilter])

  async function fetchInscriptions() {
    setLoading(true)
    try {
      let query = supabase
        .from('inscription')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (search) {
        query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%`)
      }

      if (statusFilter) {
        query = query.eq('valide', statusFilter === 'validated')
      }

      if (typeFilter) {
        query = query.eq('participant_type', typeFilter)
      }

      const { data, error } = await query.limit(PAGE_SIZE)
      if (error) {
        toast.error(`Erreur chargement : ${error.message}`)
      } else {
        setInscriptions(data || [])
      }
    } catch (error) {
      toast.error('Erreur réseau')
    }
    setLoading(false)
  }

  async function validerInscription(id) {
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await res.json()
      if (res.ok) {
        toast.success(result.message)
        fetchInscriptions()
      } else {
        toast.error(`Erreur : ${result.message}`)
      }
    } catch {
      toast.error('Erreur réseau ou serveur')
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setAdding(true)
    const { nom, prenom, participant_type, sponsoring_level, email, telephone, ville } = formData
    if (!nom.trim() || !prenom.trim()) {
      toast.error('Nom et prénom sont obligatoires')
      setAdding(false)
      return
    }
    try {
      const { error } = await supabase.from('inscription').insert([
        {
          nom: nom.trim(),
          prenom: prenom.trim(),
          participant_type,
          sponsoring_level: participant_type === 'exposant' ? sponsoring_level : null,
          fonction:
            participant_type.charAt(0).toUpperCase() +
            participant_type.slice(1),
          email: email.trim(),
          telephone: telephone.trim(),
          ville: ville.trim(),
          valide: false,
          scanned: false,
          created_at: new Date().toISOString(),
        },
      ])
      if (error) {
        toast.error(`Erreur ajout : ${error.message}`)
      } else {
        toast.success('Inscription ajoutée !')
        setFormData({
          nom: '',
          prenom: '',
          participant_type: 'exposant',
          sponsoring_level: 'platinum',
          email: '',
          telephone: '',
          ville: '',
        })
        fetchInscriptions()
      }
    } catch (err) {
      toast.error(`Erreur serveur : ${err.message}`)
    }
    setAdding(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handlePrintBadge(inscrit) {
    window.open(`/api/generatedbadge?id=${inscrit.id}`, '_blank')
  }

  const exportCSV = () => {
    const header = ['Nom','Prénom','Type','Sponsoring','Statut','Email','Téléphone','Ville','Scanné']
    const rows = inscriptions.map(i => [
      i.nom,
      i.prenom,
      i.participant_type || i.fonction || '',
      i.participant_type==='exposant'? (i.sponsoring_level||'') : '',
      i.valide ? 'Validé' : 'Non validé',
      i.email || '',
      i.telephone || '',
      i.ville || '',
      i.scanned ? 'Oui' : 'Non',
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inscriptions_page${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Toaster position="top-right" />

      <Typography variant="h4" gutterBottom>Administration des Inscriptions</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Link href="/scan" passHref legacyBehavior>
          <Button variant="contained" color="secondary" component="a">Scanner un badge</Button>
        </Link>
        <Button variant="contained" color="primary" onClick={exportCSV}>Exporter CSV</Button>
      </Stack>

      <Box component="form" onSubmit={handleAdd} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Ajouter un participant interne</Typography>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" >
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              name="participant_type"
              value={formData.participant_type}
              onChange={handleChange}
            >
              {participantTypes.slice(0,3).map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.participant_type === 'exposant' && (
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Sponsoring</InputLabel>
              <Select
                label="Sponsoring"
                name="sponsoring_level"
                value={formData.sponsoring_level}
                onChange={handleChange}
              >
                {sponsoringLevels.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button type="submit" variant="contained" color="success" disabled={adding}>
            {adding ? 'Ajout en cours…' : 'Ajouter'}
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
        <TextField
          label="Rechercher nom/prénom"
          variant="outlined"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          fullWidth
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filtrer par type</InputLabel>
          <Select
            label="Filtrer par type"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
          >
            <MenuItem value="">Tous types</MenuItem>
            {participantTypes.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filtrer par statut</InputLabel>
          <Select
            label="Filtrer par statut"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          >
            {statusFilters.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Sponsoring</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell align="center">Scanné</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : inscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Aucun inscrit trouvé
                </TableCell>
              </TableRow>
            ) : (
              inscriptions.map(inscrit => (
                <TableRow key={inscrit.id}>
                  <TableCell>{inscrit.nom}</TableCell>
                  <TableCell>{inscrit.prenom}</TableCell>
                  <TableCell>{inscrit.participant_type || inscrit.fonction}</TableCell>
                  <TableCell>{inscrit.participant_type === 'exposant' ? inscrit.sponsoring_level : '-'}</TableCell>
                  <TableCell sx={{ color: inscrit.valide ? 'green' : 'red' }}>
                    {inscrit.valide ? 'Validé' : 'Non validé'}
                  </TableCell>
                  <TableCell>{inscrit.email}</TableCell>
                  <TableCell>{inscrit.telephone}</TableCell>
                  <TableCell>{inscrit.ville}</TableCell>
                  <TableCell align="center">
                    {inscrit.scanned ? '✓' : '✗'}
                  </TableCell>
                  <TableCell>
                    {!inscrit.valide && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => validerInscription(inscrit.id)}
                      >
                        Valider
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handlePrintBadge(inscrit)}
                    >
                      Imprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={10} // si tu connais le total, adapte ici
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
