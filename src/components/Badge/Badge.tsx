import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { Tone } from '../../tokens/tokens';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import './Badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Cor semântica (ex.: success = "Concluído", info = "Em execução", danger = "Falhou"). */
  tone?: Tone;
  /** soft = fundo translúcido (padrão das tabelas), solid = preenchido, outline = só borda. */
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Mostra um ponto de status à esquerda (ex.: "● Online"). */
  dot?: boolean;
  icon?: IconProp;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'soft', size = 'md', dot, icon, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('nk-badge', `nk-badge--${tone}`, `nk-badge--${variant}`, `nk-badge--${size}`, className)}
      {...rest}
    >
      {dot && <span className="nk-badge__dot" aria-hidden />}
      {icon != null && renderIcon(icon, size === 'sm' ? 11 : 12)}
      {children}
    </span>
  );
});
