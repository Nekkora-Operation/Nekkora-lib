import './tokens/tokens.css';

// Tokens
export { colors, sizes, cssVar } from './tokens/tokens';
export type { Size, Tone } from './tokens/tokens';

// Utilitários
export { cx } from './utils/cx';
export {
  applyMask,
  unmask,
  formatWithMask,
  formatCPF,
  formatCNPJ,
  formatPhone,
  maskMaxLength,
  maskInputMode,
  resolvePattern,
  MASK_PATTERNS,
} from './utils/masks';
export type { MaskPreset } from './utils/masks';
export type { IconProp } from './utils/renderIcon';

// Componentes
export * from './components/Icon';
export * from './components/Typography';
export * from './components/Button';
export * from './components/Link';
export * from './components/Badge';
export * from './components/Input';
export * from './components/Select';
export * from './components/Container';
export * from './components/Card';
export * from './components/Layout';
export * from './components/Fieldset';
export * from './components/Table';
