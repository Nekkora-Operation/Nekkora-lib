import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type React from 'react';
import { cx } from '../../utils/cx';
import type { Size } from '../../tokens/tokens';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import { Icon } from '../Icon';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  /** Ícone à esquerda: nome do ícone Nekkora ou qualquer ReactNode. */
  leftIcon?: IconProp;
  /** Ícone à direita: nome do ícone Nekkora ou qualquer ReactNode. */
  rightIcon?: IconProp;
  /** Botão apenas com ícone (quadrado). Informe `aria-label`. */
  icon?: IconProp;
  /** Mostra spinner e desabilita o botão. */
  loading?: boolean;
  /** Ocupa 100% da largura do container. */
  fullWidth?: boolean;
  /** Bordas totalmente arredondadas. */
  pill?: boolean;
  /** Renderiza um link (<a>) com o visual de botão. Links externos abrem em nova aba. */
  href?: string;
  target?: string;
  rel?: string;
}

const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    icon,
    loading = false,
    fullWidth = false,
    pill = false,
    disabled,
    type = 'button',
    href,
    target,
    rel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const iconPx = ICON_SIZE[size];
  const iconOnly = icon != null && children == null;
  const classes = cx(
    'nk-button',
    `nk-button--${variant}`,
    `nk-button--${size}`,
    iconOnly && 'nk-button--icon-only',
    fullWidth && 'nk-button--full',
    pill && 'nk-button--pill',
    loading && 'nk-button--loading',
    className,
  );
  const content = (
    <>
      {loading ? (
        <Icon name="loader" size={iconPx} spin />
      ) : (
        leftIcon != null && renderIcon(leftIcon, iconPx)
      )}
      {iconOnly ? renderIcon(icon, iconPx + 2) : children != null && <span className="nk-button__label">{children}</span>}
      {!iconOnly && rightIcon != null && renderIcon(rightIcon, iconPx)}
    </>
  );

  if (href != null) {
    const external = /^https?:/.test(href);
    return (
      <a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || undefined}
        className={cx(classes, 'nk-button--link', disabled && 'nk-button--disabled')}
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
});
