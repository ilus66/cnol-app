import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div style={styles.container}>
      <Head>
        <title>CNOL 2025 - Accueil</title>
        <meta name="description" content="Bienvenue au Congrès National d'Optique Lunetterie 2025" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}>
        <div style={styles.logoWrapper}>
          <Image
            src="/images/cnol-logo-blanc.png"
            alt="Logo CNOL"
            width={160}
            height={160}
            style={styles.logo}
            priority
          />
        </div>

        <h1 style={styles.title}>Bienvenue au CNOL 2025</h1>
        <p style={styles.description}>
          Le Congrès National d’Optique Lunetterie revient à Rabat du 10 au 12 octobre 2025.
        </p>

        <div style={styles.buttonGroup}>
          <a href="/inscription" style={styles.button}>S'inscrire</a>
          <a href="/admin" style={styles.adminButton}>Admin</a>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 1rem',
    background: 'linear-gradient(to right, #0d47a1, #1976d2)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    padding: '2rem',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  logo: {
    maxWidth: '100%',
    height: 'auto',
  },
  title: {
    fontSize: '2.6rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#0d47a1',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: '0.3s',
  },
  adminButton: {
    backgroundColor: '#003366',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: '0.3s',
  },
};
