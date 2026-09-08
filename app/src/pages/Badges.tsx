import { useEffect, useState } from 'react';
import { getBadges } from '../api/badges';
import type { BadgeItem } from '../api/badges';
import BottomNav from '../components/BottomNav';
import { TrophyIcon, RunIcon, RepeatIcon, FlameIcon, StarIcon, FlagIcon, LockIcon } from '../components/icons';

const ICON_MAP: Record<string, React.ReactNode> = {
  'ti-flag': <FlagIcon />,
  'ti-trophy': <TrophyIcon />,
  'ti-run': <RunIcon />,
  'ti-repeat': <RepeatIcon />,
  'ti-flame': <FlameIcon />,
  'ti-star': <StarIcon />,
};

export default function Badges() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBadges()
      .then(setBadges)
      .finally(() => setLoading(false));
  }, []);

  const debloques = badges.filter((b) => b.debloque).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Badges</h1>
        {!loading && <span className="text-muted">{debloques} / {badges.length}</span>}
      </div>

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : (
        <>
          <div className="badge-grid">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`badge-tile ${badge.debloque ? '' : 'locked'}`}
                title={badge.debloque ? badge.nom : 'Verrouillé'}
              >
                {badge.debloque ? (ICON_MAP[badge.icone] ?? <TrophyIcon />) : <LockIcon />}
              </div>
            ))}
          </div>

          <p className="text-muted" style={{ marginTop: 16, textAlign: 'center' }}>
            Survole un badge pour voir son nom.
          </p>
        </>
      )}

      <BottomNav />
    </div>
  );
}