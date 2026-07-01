'use client';

/**
 * Filet de sécurité ultime : ne s'affiche que si le layout racine lui-même
 * plante. Il remplace tout le document, donc il embarque son propre <html>/<body>
 * et des styles inline (globals.css peut ne pas s'appliquer ici). Bilingue neutre.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontFamily: 'system-ui, sans-serif',
          background: '#F8FAFC',
          color: '#0F172A',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ fontSize: 48 }}>⚡</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          Something went wrong · Une erreur est survenue
        </h1>
        <p style={{ color: '#556072', margin: 0 }}>
          Please try again · Réessaie.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            border: 'none',
            borderRadius: 16,
            background: '#F5A623',
            color: '#141414',
            fontWeight: 700,
            padding: '12px 20px',
            cursor: 'pointer',
          }}
        >
          Try again · Réessayer
        </button>
      </body>
    </html>
  );
}
