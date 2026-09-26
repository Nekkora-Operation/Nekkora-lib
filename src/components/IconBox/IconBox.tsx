import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import type { Tone } from '../../tokens/tokens';
import './IconBox.css';

export type IconBoxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BOX_ICON: Record<IconBoxSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 28 };

export interface IconBoxProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Ícone: nome do ícone Nekkora ou qualquer ReactNode. */
  icon: IconProp;
  /** Cor semântica da caixa. */
  tone?: Tone;
  /**
   * solid = fundo preenchido com ícone branco (tag preenchida) ·
   * soft = fundo translúcido com ícone colorido · outline = só borda.
   */
  variant?: 'solid' | 'soft' | 'outline';
  /** xs 24 · sm 32 · md 40 · lg 48 · xl 56 px. */
  size?: IconBoxSize;
  shape?: 'rounded' | 'circle' | 'square';
  /** Rótulo acessível. Sem ele, a caixa é decorativa. */
  label?: string;
}

/** Ícone dentro de uma caixa colorida — para cards de indicadores, listas, menus e avatares de processos. */
export const IconBox = forwardRef<HTMLSpanElement, IconBoxProps>(function IconBox(
  { icon, tone = 'accent', variant = 'solid', size = 'md', shape = 'rounded', label, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx(
        'nk-iconbox',
        `nk-iconbox--${tone}`,
        `nk-iconbox--${variant}`,
        `nk-iconbox--${size}`,
        `nk-iconbox--${shape}`,
        className,
      )}
      {...rest}
    >
      {renderIcon(icon, BOX_ICON[size])}
    </span>
  );
});
