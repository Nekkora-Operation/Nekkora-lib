import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Typography.css';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline'
  | 'code';

export type TextColor =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'highlight'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'inherit';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  overline: 'span',
  code: 'code',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Estilo tipográfico. */
  variant?: TextVariant;
  /** Elemento HTML renderizado (padrão depende da variante). */
  as?: ElementType;
  color?: TextColor;
  weight?: TextWeight;
  align?: 'left' | 'center' | 'right';
  /** Corta o texto em uma linha com reticências. */
  truncate?: boolean;
  /** Aplica o degradê de destaque (ex.: "Bem-vinda, Ana"). */
  gradient?: boolean;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', as, color = 'default', weight, align, truncate, gradient, className, ...rest },
  ref,
) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return (
    <Tag
      ref={ref}
      className={cx(
        'nk-text',
        `nk-text--${variant}`,
        `nk-text--color-${color}`,
        weight && `nk-text--weight-${weight}`,
        align && `nk-text--align-${align}`,
        truncate && 'nk-text--truncate',
        gradient && 'nk-text--gradient',
        className,
      )}
      {...rest}
    />
  );
});

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  /** Nível semântico/visual: 1–4. */
  level?: 1 | 2 | 3 | 4;
}

/** Atalho para títulos: <Heading level={2}>. */
export const Heading = forwardRef<HTMLElement, HeadingProps>(function Heading({ level = 2, ...rest }, ref) {
  return <Text ref={ref} variant={`h${level}`} {...rest} />;
});
