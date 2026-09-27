import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import './Alert.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  danger: 'x-circle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  /** Ação(ões) abaixo da mensagem (ex.: um Link). */
  action?: ReactNode;
  /**
   * Anúncio para leitores de tela: "assertive" (role=alert, interrompe — erros),
   * "polite" (role=status) ou "off". Padrão: assertive para danger, polite para os demais.
   */
  live?: 'assertive' | 'polite' | 'off';
}

/** Mensagem em linha com ícone + cor + texto (nunca só cor). */
export function Alert({ tone = 'info', title, action, live, className, children, ...rest }: AlertProps) {
  const mode = live ?? (tone === 'danger' ? 'assertive' : 'polite');
  const role = mode === 'assertive' ? 'alert' : mode === 'polite' ? 'status' : undefined;
  return (
    <div role={role} className={cx('nk-alert', `nk-alert--${tone}`, className)} {...rest}>
      <span className="nk-alert__icon" aria-hidden>
        <Icon name={ICONS[tone]} size={18} />
      </span>
      <div className="nk-alert__content">
        {title != null && <p className="nk-alert__title">{title}</p>}
        {children != null && <div className="nk-alert__body">{children}</div>}
        {action != null && <div className="nk-alert__action">{action}</div>}
      </div>
    </div>
  );
}
