import { forwardRef, type SVGProps } from 'react';
import { cx } from '../../utils/cx';
import { icons, type IconName } from './icons';
import './Icon.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<IconSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'name'> {
  /** Nome do ícone do conjunto Nekkora. */
  name: IconName;
  /** Tamanho: token (xs, sm, md, lg, xl) ou valor em px. */
  size?: IconSize | number;
  /** Espessura do traço. */
  strokeWidth?: number;
  /** Cor (qualquer valor CSS). Padrão: currentColor. */
  color?: string;
  /** Rótulo acessível. Sem ele, o ícone é decorativo (aria-hidden). */
  label?: string;
  /** Aplica animação de rotação (útil para "loader"). */
  spin?: boolean;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 'md', strokeWidth = 1.75, color = 'currentColor', label, spin, className, ...rest },
  ref,
) {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('nk-icon', spin && 'nk-icon--spin', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {icons[name]}
    </svg>
  );
});
