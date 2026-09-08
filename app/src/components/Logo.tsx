interface LogoProps {
  size?: number;
  withText?: boolean;
}

export default function Logo({ size = 40, withText = false }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          background: 'var(--color-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 90 90" width={size * 0.55} height={size * 0.55}>
          <path
            d="M 22.5 25 L 45 65 L 65 15"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {withText && (
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: size * 0.4, color: 'var(--color-text)' }}>vezra</p>
          {size >= 36 && (
            <p style={{ margin: 0, fontSize: size * 0.22, color: 'var(--color-primary)' }}>Live your sport.</p>
          )}
        </div>
      )}
    </div>
  );
}