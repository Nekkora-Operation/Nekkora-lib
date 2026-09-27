import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import { Logo } from '../Logo';
import './AuthLayout.css';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título da etapa (h1). */
  title: ReactNode;
  /** Texto de apoio abaixo do título. */
  description?: ReactNode;
  /** Ícone da etapa, acima do título (ex.: "shield" no MFA). */
  icon?: IconName;
  /** Marca no topo. Padrão: logo Nekkora completo. */
  brand?: ReactNode;
  /** Contexto discreto e não editável acima do card (ex.: organização em que a pessoa está entrando). */
  context?: ReactNode;
  /** Links/ações secundárias abaixo do conteúdo do card. */
  actions?: ReactNode;
  /** Rodapé da página (fora do card). */
  footer?: ReactNode;
  /** Painel institucional lateral (telas largas); some em telas estreitas. */
  aside?: ReactNode;
  /**
   * Move o foco para o título ao montar/trocar de etapa — leitores de tela anunciam a nova etapa.
   * Não use quando um campo deve receber o foco (autoFocus). Padrão: false.
   */
  focusTitle?: boolean;
  /** Muda a cada etapa para reaplicar {@link focusTitle}. */
  stepKey?: string;
  children?: ReactNode;
}

/**
 * Estrutura única das telas de autenticação: marca, contexto, card (título, descrição, conteúdo, ações) e
 * rodapé, com painel institucional opcional. Responsiva de 320px a telas largas.
 */
export function AuthLayout({
  title,
  description,
  icon,
  brand,
  context,
  actions,
  footer,
  aside,
  focusTitle = false,
  stepKey,
  className,
  children,
  ...rest
}: AuthLayoutProps) {
  const titleId = useId();
  const descriptionId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusTitle) headingRef.current?.focus();
  }, [focusTitle, stepKey]);

  return (
    <div className={cx('nk-auth', aside != null && 'nk-auth--split', className)} {...rest}>
      {aside != null && <aside className="nk-auth__aside">{aside}</aside>}
      <main className="nk-auth__main">
        <div className="nk-auth__column">
          <header className="nk-auth__brand">{brand ?? <Logo variant="full" size={34} />}</header>
          {context != null && <div className="nk-auth__context">{context}</div>}
          <section
            className="nk-auth__card"
            aria-labelledby={titleId}
            aria-describedby={description != null ? descriptionId : undefined}
          >
            <div className="nk-auth__header">
              {icon != null && (
                <span className="nk-auth__icon" aria-hidden>
                  <Icon name={icon} size={22} />
                </span>
              )}
              <h1 id={titleId} ref={headingRef} tabIndex={-1} className="nk-auth__title">
                {title}
              </h1>
              {description != null && (
                <div id={descriptionId} className="nk-auth__description">
                  {description}
                </div>
              )}
            </div>
            {children != null && <div className="nk-auth__content">{children}</div>}
            {actions != null && <div className="nk-auth__actions">{actions}</div>}
          </section>
          {footer != null && <footer className="nk-auth__footer">{footer}</footer>}
        </div>
      </main>
    </div>
  );
}

export interface AuthContextBadgeProps {
  /** Rótulo pequeno (ex.: "Acessando"). */
  label: ReactNode;
  /** Valor (ex.: nome da organização). */
  value: ReactNode;
  icon?: IconName;
}

/** Contexto não editável exibido pelo AuthLayout (ex.: organização resolvida pela URL). */
export function AuthContextBadge({ label, value, icon = 'building' }: AuthContextBadgeProps) {
  return (
    <div className="nk-auth-context">
      <span className="nk-auth-context__icon" aria-hidden>
        <Icon name={icon} size={16} />
      </span>
      <span className="nk-auth-context__text">
        <span className="nk-auth-context__label">{label}</span>
        <span className="nk-auth-context__value">{value}</span>
      </span>
    </div>
  );
}
