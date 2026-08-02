import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const message = err.response?.data?.error ?? 'Une erreur est survenue.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Créer un défi</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="titre">Titre</label>
          <input
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="type">Type de défi</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="objectifValeur">Objectif</label>
          <input
            id="objectifValeur"
            type="number"
            step="0.01"
            value={objectifValeur}
            onChange={(e) => setObjectifValeur(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="unite">Unité</label>
          <input
            id="unite"
            type="text"
            placeholder="km, séances, matchs..."
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="dateLimite">Date limite (optionnel)</label>
          <input
            id="dateLimite"
            type="date"
            value={dateLimite}
            onChange={(e) => setDateLimite(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer le défi'}
        </button>
      </form>
    </div>
  );
}