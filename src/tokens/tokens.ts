/** Tokens do tema dark Nekkora, espelhando as CSS custom properties de tokens.css. */
export const darkColors = {
  bg: '#180C1A',
  surface: '#20222F',
  card: '#48213B',
  primary: '#603C52',
  secondary: '#765067',
  highlight: '#FADCD5',
  text: '#E8E2E7',
  textSecondary: '#94A3B8',
  accent: '#F29BB2',
  success: '#4ADE80',
  info: '#8B8CF6',
  warning: '#F5A86A',
  danger: '#F0506E',
} as const;

/** Tokens do tema claro (data-nk-theme="light"). */
export const lightColors = {
  bg: '#F8F3F5',
  surface: '#FFFFFF',
  card: '#F6E9EE',
  primary: '#603C52',
  secondary: '#765067',
  highlight: '#48213B',
  text: '#2A1A28',
  textSecondary: '#64566A',
  accent: '#C2466D',
  success: '#15803D',
  info: '#5B5BD6',
  warning: '#B45309',
  danger: '#D02C50',
} as const;

/** Alias do tema principal (dark). */
export const colors = darkColors;

export type ThemeName = 'dark' | 'light';
export const themes: Record<ThemeName, Record<keyof typeof darkColors, string>> = {
  dark: darkColors,
  light: lightColors,
};

export const sizes = ['sm', 'md', 'lg'] as const;
export type Size = (typeof sizes)[number];

export type Tone = 'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger';

/** Retorna a CSS var de um token: cssVar('color-accent') -> 'var(--nk-color-accent)'. */
export const cssVar = (token: string) => `var(--nk-${token})`;
