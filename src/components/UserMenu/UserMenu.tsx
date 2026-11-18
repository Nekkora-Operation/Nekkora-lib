import { useEffect, useId, useRef, useState, type FocusEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Avatar, type AvatarSize } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import './UserMenu.css';

export interface UserMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nome da pessoa: aparece no painel e dá as iniciais do círculo. */
  name: string;
  /** Foto. Sem foto, o círculo mostra as iniciais. */
  avatarSrc?: string;
  /** Iniciais a mostrar (padrão: tiradas do nome). */
  initials?: string;
  /** Nível da conta (ex.: "Administrador", "Convidado", "Desenvolvedor"). Só informa: quem decide o acesso é a API. */
  accountLevel?: ReactNode;
  accountLevelLabel?: string;
  /** Conteúdo extra do painel, entre as informações e o botão de sair (ex.: links da conta). */
  children?: ReactNode;
  /** Chamado ao clicar em sair. Sem ele, o botão não aparece. */
  onSignOut?: () => void;
  signOutLabel?: string;
  /** Rótulo do botão (seguido do nome) e do painel. */
  label?: string;
  size?: AvatarSize;
  /** Começa aberto. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Conta de quem está logado: um círculo com a foto ou as iniciais que, ao clicar, abre um painel com o nome, o nível
 * da conta e o botão de sair. Feito para as `actions` do AppShell.
 *
 * O painel fecha com Esc (o foco volta ao círculo), ao clicar fora ou quando o foco sai dele.
 */
export function UserMenu({
  name,
  avatarSrc,
  initials,
  accountLevel,
  accountLevelLabel = 'Nível da conta',
  children,
  onSignOut,
  signOutLabel = 'Sair',
  label = 'Menu da conta',
  size = 'md',
  defaultOpen = false,
  onOpenChange,
  className,
  ...rest
}: UserMenuProps) {
  const [open, setOpenState] = useState(defaultOpen);
  const panelId = `${useId()}-panel`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenState(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  });

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    rest.onBlur?.(e);
    // foco foi para fora do componente (Tab além do último item): fecha
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
  };

  return (
    <div {...rest} ref={rootRef} className={cx('nk-usermenu', className)} onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        className="nk-usermenu__trigger"
        aria-label={`${label}: ${name}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(!open)}
      >
        <Avatar name={name} src={avatarSrc} initials={initials} size={size} aria-hidden />
      </button>
      {open && (
        <div id={panelId} className="nk-usermenu__panel" role="dialog" aria-label={label}>
          <p className="nk-usermenu__name">{name}</p>
          {accountLevel != null && (
            <dl className="nk-usermenu__level">
              <dt>{accountLevelLabel}</dt>
              <dd>
                <Badge tone="accent">{accountLevel}</Badge>
              </dd>
            </dl>
          )}
          {children != null && <div className="nk-usermenu__extra">{children}</div>}
          {onSignOut && (
            <Button
              className="nk-usermenu__signout"
              variant="secondary"
              fullWidth
              leftIcon="logout"
              onClick={() => {
                // devolve o foco ao círculo antes de o painel sumir
                triggerRef.current?.focus();
                setOpen(false);
                onSignOut();
              }}
            >
              {signOutLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
