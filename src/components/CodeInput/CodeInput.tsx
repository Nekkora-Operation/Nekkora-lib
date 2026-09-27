import { forwardRef, useId, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Field } from '../Field';
import './CodeInput.css';

export interface CodeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'size'> {
  /** Quantidade de caracteres (ex.: 6 para TOTP). */
  length: number;
  /** numeric = só dígitos (teclado numérico no celular) · alphanumeric = letras e dígitos (maiúsculas). */
  mode?: 'numeric' | 'alphanumeric';
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Recebe o valor já saneado (sem espaços/separadores). */
  onValueChange?: (value: string) => void;
  /** Chamado quando o código atinge `length` caracteres. */
  onComplete?: (value: string) => void;
}

/**
 * Campo de código de verificação (OTP) com casas visuais. Por baixo é UM input nativo: colar, preencher
 * automaticamente (autocomplete="one-time-code"), leitores de tela e teclado funcionam como em qualquer campo.
 */
export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput(
  {
    id,
    length,
    mode = 'numeric',
    label,
    hint,
    error,
    value,
    defaultValue,
    onValueChange,
    onComplete,
    disabled,
    className,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `nk-code-${autoId}`;
  const sanitize = (v: string) =>
    (mode === 'numeric' ? v.replace(/\D/g, '') : v.replace(/[^0-9a-z]/gi, '').toUpperCase()).slice(0, length);
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(() => sanitize(defaultValue ?? ''));
  const [focused, setFocused] = useState(false);
  const current = isControlled ? sanitize(value ?? '') : inner;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = sanitize(event.target.value);
    if (!isControlled) setInner(next);
    onValueChange?.(next);
    if (next.length === length && current.length !== length) onComplete?.(next);
  };

  const describedBy = error != null || hint != null ? `${inputId}-message` : undefined;
  const active = Math.min(current.length, length - 1);

  return (
    <Field id={inputId} label={label} hint={hint} error={error} fullWidth>
      <div
        className={cx(
          'nk-code',
          focused && 'nk-code--focused',
          error != null && 'nk-code--invalid',
          disabled && 'nk-code--disabled',
          className,
        )}
        style={{ ['--nk-code-length' as string]: length }}
      >
        <input
          ref={ref}
          id={inputId}
          className="nk-code__native"
          value={current}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          inputMode={mode === 'numeric' ? 'numeric' : 'text'}
          autoComplete="one-time-code"
          autoCapitalize={mode === 'numeric' ? 'off' : 'characters'}
          autoCorrect="off"
          spellCheck={false}
          maxLength={length}
          pattern={mode === 'numeric' ? `[0-9]{${length}}` : `[0-9A-Za-z]{${length}}`}
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        <div className="nk-code__slots" aria-hidden>
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              className={cx(
                'nk-code__slot',
                i < current.length && 'nk-code__slot--filled',
                focused && i === active && 'nk-code__slot--active',
              )}
            >
              {current[i] ?? ''}
            </span>
          ))}
        </div>
      </div>
    </Field>
  );
});
