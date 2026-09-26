import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Field.css';

export interface FieldProps {
  id: string;
  label?: ReactNode;
  /** Texto de ajuda abaixo do campo. */
  hint?: ReactNode;
  /** Mensagem de erro (substitui o hint e pinta o campo de vermelho). */
  error?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

/** Wrapper interno de label + hint/erro, compartilhado por Input e Select. */
export function Field({ id, label, hint, error, required, fullWidth, className, children }: FieldProps) {
  const message = error ?? hint;
  return (
    <div className={cx('nk-field', fullWidth && 'nk-field--full', className)}>
      {label != null && (
        <label className="nk-field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="nk-field__required" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {message != null && message !== false && (
        <span id={`${id}-message`} className={cx('nk-field__message', error != null && 'nk-field__message--error')}>
          {message}
        </span>
      )}
    </div>
  );
}
