/** Modo de cor de um tema: define as derivações (bordas, sombras, status...). */
export type ThemeMode = 'dark' | 'light';

/** Temas embutidos. Use como data-nk-theme="…" ou <ThemeProvider theme="…">. */
export const themeNames = [
  'dark',
  'light',
  'sakura-dark',
  'midnight-blue',
  'porcelain-light',
  'sage-light',
] as const;
export type ThemeName = (typeof themeNames)[number];

/** Paleta base de um tema (espelha as CSS vars de themes.css). */
export interface ThemePalette {
  bg: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  highlight: string;
  text: string;
  accent: string;
}

export interface ThemeDefinition {
  name: ThemeName;
  label: string;
  mode: ThemeMode;
  description: string;
  palette: ThemePalette;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  dark: {
    name: 'dark',
    label: 'Nekkora Dark',
    mode: 'dark',
    description: 'Tema principal — sofisticado, imersivo e focado em produtividade.',
    palette: {
      bg: '#180C1A',
      surface: '#20222F',
      card: '#48213B',
      primary: '#603C52',
      secondary: '#765067',
      highlight: '#FADCD5',
      text: '#E8E2E7',
      accent: '#F29BB2',
    },
  },
  light: {
    name: 'light',
    label: 'Nekkora Light',
    mode: 'light',
    description: 'A identidade Nekkora (ameixa + rosa) sobre fundos claros.',
    palette: {
      bg: '#F8F3F5',
      surface: '#FFFFFF',
      card: '#F6E9EE',
      primary: '#603C52',
      secondary: '#765067',
      highlight: '#48213B',
      text: '#2A1A28',
      accent: '#C2466D',
    },
  },
  'sakura-dark': {
    name: 'sakura-dark',
    label: 'Sakura Dark',
    mode: 'dark',
    description: 'Identidade/autoral — o tema mais "Nekkora", mantém o rosa de forma elegante.',
    palette: {
      bg: '#1B0C1A',
      surface: '#2D222F',
      card: '#4B2138',
      primary: '#6D3C52',
      secondary: '#765D67',
      highlight: '#FADCD5',
      text: '#F8F2F7',
      accent: '#F0A3B8',
    },
  },
  'midnight-blue': {
    name: 'midnight-blue',
    label: 'Midnight Blue',
    mode: 'dark',
    description: 'Técnico/profissional — corporativo sem virar azul SaaS genérico.',
    palette: {
      bg: '#0D1117',
      surface: '#161B22',
      card: '#212936',
      primary: '#526D9E',
      secondary: '#7189B5',
      highlight: '#AFC8F2',
      text: '#F2F5F8',
      accent: '#8FB0EA',
    },
  },
  'porcelain-light': {
    name: 'porcelain-light',
    label: 'Porcelain Light',
    mode: 'light',
    description: 'Neutro/profissional — o light mais institucional.',
    palette: {
      bg: '#F7F6F4',
      surface: '#FFFFFF',
      card: '#ECEAE6',
      primary: '#4E5D78',
      secondary: '#76839A',
      highlight: '#D7CBBF',
      text: '#24262B',
      accent: '#4E5D78',
    },
  },
  'sage-light': {
    name: 'sage-light',
    label: 'Sage Light',
    mode: 'light',
    description: 'Calmo/diferente — personalidade própria sem perder sofisticação.',
    palette: {
      bg: '#F4F6F1',
      surface: '#FFFFFF',
      card: '#E6EAE2',
      primary: '#506B62',
      secondary: '#80958D',
      highlight: '#C7D6CE',
      text: '#202724',
      accent: '#506B62',
    },
  },
};

export const themeList: ThemeDefinition[] = themeNames.map((name) => themes[name]);

export const isThemeName = (value: unknown): value is ThemeName =>
  typeof value === 'string' && (themeNames as readonly string[]).includes(value);

/** Cores de status (iguais em todos os temas do mesmo modo). */
export const statusColors: Record<ThemeMode, Record<'success' | 'info' | 'warning' | 'danger', string>> = {
  dark: { success: '#4ADE80', info: '#8B8CF6', warning: '#F5A86A', danger: '#F0506E' },
  light: { success: '#15803D', info: '#5B5BD6', warning: '#B45309', danger: '#D02C50' },
};

/** Paleta + status do tema Nekkora Dark. */
export const darkColors = {
  ...themes.dark.palette,
  textSecondary: '#94A3B8',
  ...statusColors.dark,
} as const;

/** Paleta + status do tema Nekkora Light. */
export const lightColors = {
  ...themes.light.palette,
  textSecondary: '#64566A',
  ...statusColors.light,
} as const;

/** Alias do tema principal (dark). */
export const colors = darkColors;

export const sizes = ['sm', 'md', 'lg'] as const;
export type Size = (typeof sizes)[number];

export type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'info' | 'warning' | 'danger';

/** Retorna a CSS var de um token: cssVar('color-accent') -> 'var(--nk-color-accent)'. */
export const cssVar = (token: string) => `var(--nk-${token})`;
