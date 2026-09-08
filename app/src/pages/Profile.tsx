import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

// ⚠️ Pseudo, email, niveau et XP sont en dur — aucun endpoint
// /api/me n'existe encore pour récupérer le profil connecté.
const pseudo = 'Léa';
const email = 'lea.demo@test.com';
const xpTotal = 840;
const niveau = Math.floor(xpTotal / 200) + 1;
const xpDansNiveau = xpTotal % 200;

export default function Profile() {
  const { logout } = useAuth();

  return (
    <div className="page">
      <h1>Profil</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
          {pseudo.charAt(0)}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{pseudo}</p>
          <p className="text-muted" style={{ margin: 0 }}>{email}</p>
        </div>
      </div>

      <div className="card-dark">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Niveau {niveau}</span>
          <span className="muted">{xpDansNiveau} / 200 XP</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(xpDansNiveau / 200) * 100}%` }} />
        </div>
      </div>

      <h2>Compte</h2>
      <div className="card" style={{ padding: 0 }}>
        <div className="list-item" style={{ padding: '14px 16px' }}>
          <span>Informations personnelles</span>
          <span className="text-muted">›</span>
        </div>
        <div className="list-item" style={{ padding: '14px 16px' }}>
          <span>Notifications</span>
          <span className="text-muted">›</span>
        </div>
        <div className="list-item" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={logout}>
          <span style={{ color: 'var(--color-error)' }}>Se déconnecter</span>
          <span className="text-muted">›</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}