import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Field.css';

export interface FieldProps {
  id: string;
  /** id do elemento <label> (para aria-labelledby em controles que não são inputs nativos). */
  labelId?: string;
  label?: ReactNode;
  /** Texto de ajuda abaixo do campo. */
  hint?: ReactNode;
  /** Mensagem de erro (substitui o hint e pinta o campo de vermelho). */
  error?: ReactNode;
  /** Mensagem de sucesso (usada quando não há erro). */
  success?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

/** Wrapper interno de label + hint/erro, compartilhado por Input e Select. */
export function Field({ id, labelId, label, hint, error, success, required, fullWidth, className, children }: FieldProps) {
  const message = error ?? (success != null && success !== true ? success : undefined) ?? hint;
  return (
    <div className={cx('nk-field', fullWidth && 'nk-field--full', className)}>
      {label != null && (
        <label id={labelId} className="nk-field__label" htmlFor={id}>
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
        <span
          id={`${id}-message`}
          // erros são anunciados por leitores de tela assim que aparecem
          aria-live={error != null ? 'polite' : undefined}
          className={cx(
            'nk-field__message',
            error != null && 'nk-field__message--error',
            error == null && success != null && success !== true && 'nk-field__message--success',
          )}
        >
          {error != null && <span className="nk-visually-hidden">Erro: </span>}
          {message}
        </span>
      )}
    </div>
  );
}
