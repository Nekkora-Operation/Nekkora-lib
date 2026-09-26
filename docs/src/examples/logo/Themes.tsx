import { Grid, Logo, ThemeProvider, themeList } from 'nekkora-lib';

// O logo usa as cores do tema: o mesmo componente em cada template
export default function LogoThemes() {
  return (
    <Grid minColumnWidth="200px" gap={3}>
      {themeList.map((t) => (
        <ThemeProvider
          key={t.name}
          theme={t.name}
          style={{ display: 'grid', placeItems: 'center', height: 96, borderRadius: 12, border: '1px solid var(--nk-color-border)' }}
        >
          <Logo size={26} />
        </ThemeProvider>
      ))}
    </Grid>
  );
}
