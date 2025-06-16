import { useState } from 'react';
import dynamic from 'next/dynamic';

const QRCodeScanner = dynamic(() => import('../components/QRCodeScanner'), { ssr: false });

export default function ScanPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Scanner QR Code</h1>
      <QRCodeScanner
        onScanSuccess={(decoded) => {
          setResult(decoded);
          setError(null);
        }}
        onScanError={(err) => {
          setError(err);
        }}
      />
      {result && (
        <p>
          <strong>Résultat :</strong> {result}
        </p>
      )}
      {error && (
        <p style={{ color: 'red' }}>
          <strong>Erreur :</strong> {error}
        </p>
      )}
    </div>
  );
}
