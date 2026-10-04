import { useEffect, useId, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import './AppShell.css';

export interface AppNavItem {
  /** Identificador estável (chave da lista). */
  id: string;
  label: ReactNode;
  /** Destino: vira `to` quando `linkAs` é um componente de roteamento; senão `href`. */
  href: string;
  icon?: IconName;
  /** Item da página atual (`aria-current="page"`). */
  active?: boolean;
  /** Marcador discreto à direita (ex.: contagem, "novo"). */
  badge?: ReactNode;
}

export interface AppNavGroup {
  id: string;
  /** Título do grupo (opcional). */
  label?: ReactNode;
  items: AppNavItem[];
}

export interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Marca no topo do menu lateral (ex.: <Logo />). Dê nome acessível ao conteúdo (o Logo já tem). */
  brand?: ReactNode;
  /** Link da marca. */
  brandHref?: string;
  nav: AppNavGroup[];
  /** Componente de roteamento para os links (ex.: Link do react-router), como em `<Link as>`. Padrão: <a>. */
  linkAs?: ElementType;
  /** Conteúdo à esquerda do topo: título da página ou trilha (breadcrumbs). */
  header?: ReactNode;
  /** Ações à direita do topo (ex.: <ThemeToggle />, conta). */
  actions?: ReactNode;
  /** Rodapé do menu lateral (ex.: organização, conta). */
  sidebarFooter?: ReactNode;
  /** Rótulo da navegação principal. */
  navLabel?: string;
  /** Rótulo do painel do menu no celular (diálogo). */
  menuLabel?: string;
  /** Texto do link para pular ao conteúdo. */
  skipLabel?: string;
  /** Id do <main> (alvo do link de pular). */
  mainId?: string;
  children: ReactNode;
}

/** Mesma largura do CSS: até aqui o menu é painel recolhível. */
export const APP_SHELL_COMPACT_QUERY = '(max-width: 900px)';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Estrutura da área logada: menu lateral com grupos e item ativo, topo com título e ações, e conteúdo principal.
 *
 * Até 900 px o menu vira painel recolhível, com comportamento de diálogo modal:
 * - abrir (botão do topo) leva o foco ao primeiro elemento do painel; topo e conteúdo ficam `inert`;
 * - Tab e Shift+Tab circulam dentro do painel;
 * - Esc, o botão "Fechar menu" do painel ou o fundo escurecido fecham e devolvem o foco ao botão "Abrir menu";
 * - escolher um item fecha o painel e leva o foco ao conteúdo principal (<main>), já que o link some;
 * - se a largura passar a desktop com o painel aberto, ele fecha e o conteúdo volta a ficar ativo; o foco continua
 *   onde estava (o menu segue visível como menu lateral), salvo se o elemento sumiu ("Fechar menu" só existe no
 *   celular): aí vai ao item ativo do menu.
 * No desktop, o menu é uma região complementar rotulada (`menuLabel`) com a navegação dentro.
 * O menu não decide permissões: mostra só os itens recebidos.
 */
export function AppShell({
  brand,
  brandHref = '#',
  nav,
  linkAs,
  header,
  actions,
  sidebarFooter,
  navLabel = 'Navegação principal',
  menuLabel = 'Menu',
  skipLabel = 'Pular para o conteúdo',
  mainId,
  className,
  children,
  ...rest
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  const autoId = useId();
  const sidebarId = `${autoId}-sidebar`;
  const contentId = mainId ?? `${autoId}-main`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  /**
   * Para onde o foco vai DEPOIS de fechar (o conteúdo só deixa de ser inert após o render). 'keep': mantém onde está,
   * a menos que o elemento tenha sumido (então vai ao item ativo do menu, ou ao primeiro).
   */
  const pendingFocus = useRef<'toggle' | 'main' | 'keep' | null>(null);
  const Tag = linkAs ?? 'a';

  const close = (focusTo: 'toggle' | 'main' | 'keep') => {
    pendingFocus.current = focusTo;
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      // leva o foco para o primeiro elemento do painel aberto
      sidebarRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      return;
    }
    const mode = pendingFocus.current;
    pendingFocus.current = null;
    if (mode === 'keep') {
      const a = document.activeElement as HTMLElement | null;
      const lost = !a || a === document.body || a.getClientRects().length === 0;
      if (lost) {
        const nav = sidebarRef.current;
        (nav?.querySelector<HTMLElement>('[aria-current="page"]') ?? nav?.querySelector<HTMLElement>('.nk-shell__item'))?.focus();
      }
      return;
    }
    (mode === 'toggle' ? toggleRef.current : mode === 'main' ? mainRef.current : null)?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close('toggle');
        return;
      }
      if (e.key !== 'Tab' || !sidebarRef.current) return;
      const items = [...sidebarRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = sidebarRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    // passou a desktop com o painel aberto: fecha; o foco fica onde está, salvo se o elemento sumiu
    const mq = typeof window.matchMedia === 'function' ? window.matchMedia(APP_SHELL_COMPACT_QUERY) : undefined;
    const onWidth = () => {
      if (mq && !mq.matches) close('keep');
    };
    mq?.addEventListener('change', onWidth);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq?.removeEventListener('change', onWidth);
    };
  }, [open]);

  const linkProps = (href: string) => (linkAs ? { to: href } : { href });

  return (
    <div className={cx('nk-shell', open && 'nk-shell--open', className)} {...rest}>
      <a className="nk-shell__skip" href={`#${contentId}`} inert={open || undefined}>
        {skipLabel}
      </a>
      <div
        id={sidebarId}
        ref={sidebarRef}
        className="nk-shell__sidebar"
        // menu lateral = região complementar rotulada; aberto no celular = diálogo modal (<aside> não aceita role=dialog)
        role={open ? 'dialog' : 'complementary'}
        aria-modal={open || undefined}
        aria-label={menuLabel}
      >
        <div className="nk-shell__sidebar-head">
          {brand != null && (
            <Tag className="nk-shell__brand" {...linkProps(brandHref)}>
              {brand}
            </Tag>
          )}
          <Button
            className="nk-shell__close-btn"
            variant="ghost"
            size="sm"
            icon="close"
            aria-label="Fechar menu"
            onClick={() => close('toggle')}
          />
        </div>
        <nav className="nk-shell__nav" aria-label={navLabel}>
          {nav.map((group) => (
            <div key={group.id} className="nk-shell__group">
              {group.label != null && <p className="nk-shell__group-label">{group.label}</p>}
              <ul className="nk-shell__list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Tag
                      className={cx('nk-shell__item', item.active && 'is-active')}
                      aria-current={item.active ? 'page' : undefined}
                      onClick={() => {
                        if (open) close('main');
                      }}
                      {...linkProps(item.href)}
                    >
                      {item.icon && <Icon name={item.icon} size="sm" />}
                      <span className="nk-shell__item-label">{item.label}</span>
                      {item.badge != null && (
                        <>
                          {' '}
                          <span className="nk-shell__item-badge">{item.badge}</span>
                        </>
                      )}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {sidebarFooter != null && <div className="nk-shell__sidebar-footer">{sidebarFooter}</div>}
      </div>
      {open && <div className="nk-shell__scrim" aria-hidden="true" onClick={() => close('toggle')} />}
      <div className="nk-shell__body" inert={open || undefined}>
        <header className="nk-shell__topbar">
          <Button
            ref={toggleRef}
            className="nk-shell__menu-btn"
            variant="ghost"
            size="sm"
            icon="menu"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls={sidebarId}
            onClick={() => setOpen(true)}
          />
          <div className="nk-shell__header">{header}</div>
          {actions != null && <div className="nk-shell__actions">{actions}</div>}
        </header>
        <main id={contentId} ref={mainRef} className="nk-shell__main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
