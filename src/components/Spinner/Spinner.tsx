import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Spinner.css';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Texto para leitores de tela. Padrão: "Carregando". */
  label?: string;
}

/**
 * Indicador de atividade circular. Anuncia o rótulo para leitores de tela; com `label=""` fica
 * decorativo (use quando o contexto já anuncia o carregamento).
 */
export function Spinner({ size = 'md', label = 'Carregando', className, ...rest }: SpinnerProps) {
  const silent = label === '';
  return (
    <span
      role={silent ? undefined : 'status'}
      aria-hidden={silent || undefined}
      className={cx('nk-spinner', `nk-spinner--${size}`, className)}
      {...rest}
    >
      <span className="nk-spinner__ring" aria-hidden />
      {!silent && <span className="nk-visually-hidden">{label}</span>}
    </span>
  );
}
