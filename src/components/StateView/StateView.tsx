import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import { Spinner } from '../Spinner';
import './StateView.css';

export type StateViewStatus = 'loading' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

const ICONS: Record<Exclude<StateViewStatus, 'loading'>, IconName> = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert',
  info: 'info',
  neutral: 'box',
};

export interface StateViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  status: StateViewStatus;
  title: ReactNode;
  description?: ReactNode;
  /** Ícone próprio (substitui o do status). */
  icon?: IconName;
  /** Ações (botões/links) abaixo do texto. */
  actions?: ReactNode;
  /** Detalhe técnico discreto (ex.: "Código do erro: 1a2b…"). */
  meta?: ReactNode;
}

/**
 * Estado de uma área/etapa: carregando, sucesso, erro, aviso, informação ou vazio. Centralizado, com
 * ícone + título + texto (nunca só cor) e anúncio para leitores de tela.
 */
export function StateView({ status, title, description, icon, actions, meta, className, ...rest }: StateViewProps) {
  return (
    <div
      role={status === 'error' ? 'alert' : 'status'}
      className={cx('nk-state', `nk-state--${status}`, className)}
      {...rest}
    >
      <div className="nk-state__glyph" aria-hidden={status !== 'loading' || undefined}>
        {status === 'loading' ? (
          <Spinner size="lg" label="" />
        ) : (
          <Icon name={icon ?? ICONS[status]} size={28} />
        )}
      </div>
      <p className="nk-state__title">{title}</p>
      {description != null && <div className="nk-state__description">{description}</div>}
      {actions != null && <div className="nk-state__actions">{actions}</div>}
      {meta != null && <p className="nk-state__meta">{meta}</p>}
    </div>
  );
}
