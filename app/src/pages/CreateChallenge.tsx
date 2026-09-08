import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createChallenge } from '../api/challenges';

const TYPES = [
  { value: 'distance', label: 'Distance (km)' },
  { value: 'repetition', label: 'Répétition (nb)' },
  { value: 'frequence', label: 'Fréquence (fois)' },
  { value: 'occurrence', label: 'Occurrence (nb de fois)' },
];

export default function CreateChallenge() {
  const [titre, setTitre] = useState('');
  const [type, setType] = useState('distance');
  const [objectifValeur, setObjectifValeur] = useState('');
  const [unite, setUnite] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createChallenge({
        titre,
        type,
        objectifValeur: parseFloat(objectifValeur),
        unite,
        dateLimite: dateLimite || undefined,
      });
      navigate('/challenges');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/challenges" className="btn-icon">←</Link>
        <h1 style={{ margin: 0 }}>Nouveau défi</h1>
        <div style={{ width: 24 }} />
      </div>

      <form onSubmit={handleSubmit}>
        <p className="text-muted" style={{ marginBottom: 8 }}>Type de défi</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              style={{
                padding: 12,
                borderRadius: 10,
                border: type === t.value ? 'none' : '1px solid var(--color-border)',
                background: type === t.value ? 'var(--color-primary)' : 'var(--color-surface)',
                color: type === t.value ? 'white' : 'var(--color-text)',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="form-field">
          <label htmlFor="titre">Titre</label>
          <input id="titre" type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="objectifValeur">Objectif</label>
          <input id="objectifValeur" type="number" step="0.01" value={objectifValeur} onChange={(e) => setObjectifValeur(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="unite">Unité</label>
          <input id="unite" type="text" placeholder="km, séances, matchs..." value={unite} onChange={(e) => setUnite(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="dateLimite">Date limite (optionnel)</label>
          <input id="dateLimite" type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Création...' : 'Créer le défi'}
        </button>
      </form>
    </div>
  );
}