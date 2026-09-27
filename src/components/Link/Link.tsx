import { forwardRef, type AnchorHTMLAttributes, type ElementType, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { Size } from '../../tokens/tokens';
import { Icon } from '../Icon';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import './Link.css';

export type LinkVariant = 'accent' | 'default' | 'subtle';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  size?: Size;
  /** Sublinhado: sempre, só no hover, ou nunca. */
  underline?: 'always' | 'hover' | 'none';
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  /** Mostra seta "→" à direita (ex.: "Ver todas →"). */
  arrow?: boolean;
  /** Abre em nova aba com rel seguro e ícone de link externo. */
  external?: boolean;
  disabled?: boolean;
  /** Componente de roteamento (ex.: Link do react-router) ou "button" para ações com aparência de link. Padrão: <a>. */
  as?: ElementType;
  /** Destino repassado ao componente de roteamento de `as` (ex.: `<Link as={RouterLink} to="/login">`). */
  to?: string;
}

const ICON_SIZE = { sm: 12, md: 14, lg: 16 } as const;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    variant = 'accent',
    size = 'md',
    underline = 'hover',
    leftIcon,
    rightIcon,
    arrow,
    external,
    disabled,
    as: Tag = 'a',
    className,
    children,
    ...rest
  },
  ref,
) {
  const px = ICON_SIZE[size];
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Tag
      ref={ref}
      className={cx(
        'nk-link',
        `nk-link--${variant}`,
        `nk-link--${size}`,
        `nk-link--underline-${underline}`,
        disabled && 'nk-link--disabled',
        className,
      )}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...externalProps}
      {...rest}
    >
      {leftIcon != null && renderIcon(leftIcon, px)}
      <span className="nk-link__label">{children as ReactNode}</span>
      {rightIcon != null && renderIcon(rightIcon, px)}
      {arrow && <Icon name="arrow-right" size={px} className="nk-link__arrow" />}
      {external && <Icon name="external-link" size={px} />}
    </Tag>
  );
});
