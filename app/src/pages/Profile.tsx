import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api/user';
import type { Me } from '../api/user';
import BottomNav from '../components/BottomNav';
import { ChevronRightIcon } from '../components/icons';

export default function Profile() {
  const { logout } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setMe)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !me) {
    return (
      <div className="page">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  const xpDansNiveau = me.xpTotal % 200;

  return (
    <div className="page">
      <h1>Profil</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
          {me.pseudo.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{me.pseudo}</p>
          <p className="text-muted" style={{ margin: 0 }}>{me.email}</p>
        </div>
      </div>

      <div className="card-dark">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Niveau {me.niveau}</span>
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
          <span className="text-muted"><ChevronRightIcon size={16} /></span>        </div>
        <div className="list-item" style={{ padding: '14px 16px' }}>
          <span>Notifications</span>
          <span className="text-muted"><ChevronRightIcon size={16} /></span>        </div>
        <div className="list-item" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={logout}>
          <span style={{ color: 'var(--color-error)' }}>Se déconnecter</span>
          <span className="text-muted"><ChevronRightIcon size={16} /></span>        </div>
      </div>

      <BottomNav />
    </div>
  );
}