import { Stack, Text, ThemeToggle, useTheme } from 'nekkora-lib';

// Alterna entre os temas do `pair` do ThemeProvider — ex.: <ThemeProvider pair={{ dark: 'midnight-blue', light: 'sage-light' }}>.
export default function ThemesToggle() {
  const { resolvedTheme } = useTheme();
  return (
    <Stack direction="row" gap={3} align="center">
      <ThemeToggle />
      <Text variant="caption" color="secondary">
        Tema atual: {resolvedTheme}
      </Text>
    </Stack>
  );
}
