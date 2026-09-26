/** Tokens do tema dark Nekkora, espelhando as CSS custom properties de tokens.css. */
export const colors = {
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

export const sizes = ['sm', 'md', 'lg'] as const;
export type Size = (typeof sizes)[number];

export type Tone = 'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger';

/** Retorna a CSS var de um token: cssVar('color-accent') -> 'var(--nk-color-accent)'. */
export const cssVar = (token: string) => `var(--nk-${token})`;
