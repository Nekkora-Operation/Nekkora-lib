import { Button, Select, Stack, Text, themeList, useTheme, type ThemePreference } from 'nekkora-lib';

// Precisa estar dentro de um <ThemeProvider> (esta documentação usa um na raiz).
export default function ThemesHook() {
  const { theme, resolvedTheme, mode, setTheme, toggleTheme } = useTheme();

  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Select
        label="Tema da documentação"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemePreference)}
        options={[
          ...themeList.map((t) => ({ value: t.name, label: t.label })),
          { value: 'system', label: 'Seguir o sistema' },
        ]}
      />
      <Stack direction="row" gap={3} align="center">
        <Button variant="secondary" leftIcon={mode === 'dark' ? 'sun' : 'moon'} onClick={toggleTheme}>
          Alternar claro/escuro
        </Button>
        <Text variant="caption" color="secondary">{resolvedTheme} · {mode}</Text>
      </Stack>
    </Stack>
  );
}
