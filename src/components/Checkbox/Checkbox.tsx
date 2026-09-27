import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Rótulo clicável ao lado da caixa. */
  label: ReactNode;
  /** Texto de apoio abaixo do rótulo. */
  hint?: ReactNode;
  error?: ReactNode;
}

/** Caixa de seleção nativa (acessível por teclado: Espaço alterna) com visual Nekkora. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, hint, error, className, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `nk-checkbox-${autoId}`;
  const messageId = hint != null || error != null ? `${inputId}-message` : undefined;
  return (
    <div className={cx('nk-checkbox', disabled && 'nk-checkbox--disabled', error != null && 'nk-checkbox--invalid', className)}>
      <span className="nk-checkbox__box">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="nk-checkbox__native"
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={messageId}
          {...rest}
        />
        <span className="nk-checkbox__mark" aria-hidden>
          <Icon name="check" size={12} strokeWidth={3} variant="outline" />
        </span>
      </span>
      <span className="nk-checkbox__text">
        <label htmlFor={inputId} className="nk-checkbox__label">
          {label}
        </label>
        {(error ?? hint) != null && (
          <span id={messageId} className={cx('nk-checkbox__message', error != null && 'nk-checkbox__message--error')} aria-live={error != null ? 'polite' : undefined}>
            {error ?? hint}
          </span>
        )}
      </span>
    </div>
  );
});
