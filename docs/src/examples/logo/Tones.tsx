import { Grid, Logo } from 'nekkora-lib';

const tile = { display: 'grid', placeItems: 'center', height: 120, borderRadius: 12 } as const;

export default function LogoTones() {
  return (
    <Grid minColumnWidth="220px" gap={3}>
      {/* brand: cores do tema atual */}
      <div style={{ ...tile, background: 'var(--nk-color-surface-raised)' }}>
        <Logo size={32} />
      </div>
      {/* inverse: branco, para fundos preenchidos */}
      <div style={{ ...tile, background: 'var(--nk-solid-accent)' }}>
        <Logo size={32} tone="inverse" />
      </div>
      {/* mono: uma cor só (herda color) */}
      <div style={{ ...tile, background: 'var(--nk-color-bg)', color: 'var(--nk-color-text-secondary)' }}>
        <Logo size={32} tone="mono" />
      </div>
    </Grid>
  );
}
