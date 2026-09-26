import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import type { Tone } from '../../tokens/tokens';
import './FloatingButton.css';

export interface FloatingButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destino (ex.: link do WhatsApp). */
  href: string;
  icon: IconProp;
  /** Rótulo acessível e texto do tooltip. */
  label: string;
  /** Mostra o rótulo como tooltip no hover/foco. Padrão: true. */
  tooltip?: boolean;
  /** Cor de fundo. `whatsapp` usa o verde oficial. Padrão: accent. */
  tone?: Tone | 'whatsapp';
  position?: 'bottom-right' | 'bottom-left';
  /** Anel pulsando discretamente para chamar atenção (respeita reduced-motion). */
  pulse?: boolean;
  /** Texto extra ao lado do ícone (ex.: contador). */
  children?: ReactNode;
}

/** Botão de ação flutuante fixo no canto da tela (ex.: WhatsApp, ajuda). */
export const FloatingButton = forwardRef<HTMLAnchorElement, FloatingButtonProps>(function FloatingButton(
  { href, icon, label, tooltip = true, tone = 'accent', position = 'bottom-right', pulse, className, children, ...rest },
  ref,
) {
  const external = /^https?:/.test(href);
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      className={cx('nk-fab', `nk-fab--${tone}`, `nk-fab--${position}`, pulse && 'nk-fab--pulse', className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {renderIcon(icon, 26)}
      {children}
      {tooltip && (
        <span className="nk-fab__tooltip" aria-hidden="true">
          {label}
        </span>
      )}
    </a>
  );
});
