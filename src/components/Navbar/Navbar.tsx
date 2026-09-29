import { useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import './Navbar.css';

export interface NavbarLink {
  label: ReactNode;
  href: string;
}

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Marca à esquerda (ex.: <Logo />). */
  brand?: ReactNode;
  /** Link da marca. Padrão: "#". */
  brandHref?: string;
  links?: NavbarLink[];
  /** href do link ativo (ex.: seção visível). */
  activeHref?: string;
  /** Ações à direita (ex.: botão de contato). No mobile aparecem dentro do menu. */
  actions?: ReactNode;
  /**
   * Controles compactos sempre visíveis na barra (ex.: <ThemeToggle />): antes das ações no desktop e ao lado do
   * botão de menu no mobile.
   */
  tools?: ReactNode;
  /** Fixa no topo ao rolar. Padrão: true. */
  sticky?: boolean;
  /** Fundo translúcido com blur. Padrão: true. */
  blur?: boolean;
  /** Largura máxima do conteúdo. Padrão: 1200. */
  maxWidth?: number;
  /** Rótulo acessível da navegação. */
  label?: string;
}

/** Barra de navegação com âncoras, ações e menu recolhível no mobile. */
export function Navbar({
  brand,
  brandHref = '#',
  links = [],
  activeHref,
  actions,
  tools,
  sticky = true,
  blur = true,
  maxWidth = 1200,
  label = 'Navegação principal',
  className,
  ...rest
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuId = `nk-navbar-${useId()}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cx('nk-navbar', sticky && 'nk-navbar--sticky', blur && 'nk-navbar--blur', open && 'is-open', className)}
      {...rest}
    >
      <nav className="nk-navbar__inner" style={{ maxWidth }} aria-label={label}>
        {brand != null && (
          <a className="nk-navbar__brand" href={brandHref}>
            {brand}
          </a>
        )}
        <ul className="nk-navbar__links">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cx('nk-navbar__link', activeHref === l.href && 'is-active')}
                aria-current={activeHref === l.href ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        {tools != null && <div className="nk-navbar__tools">{tools}</div>}
        {actions != null && <div className="nk-navbar__actions">{actions}</div>}
        <Button
          className="nk-navbar__toggle"
          variant="ghost"
          icon={open ? 'close' : 'menu'}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        />
      </nav>
      <div id={menuId} className="nk-navbar__mobile" hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cx('nk-navbar__link', activeHref === l.href && 'is-active')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        {actions != null && <div className="nk-navbar__mobile-actions">{actions}</div>}
      </div>
    </header>
  );
}
