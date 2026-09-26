import { forwardRef, useId, useState, type ChangeEvent, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Field } from '../Field';
import './Textarea.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Estado de sucesso: true só pinta o campo; um texto também aparece abaixo dele. */
  success?: boolean | ReactNode;
  variant?: 'default' | 'filled' | 'ghost';
  /** Mostra o contador de caracteres (usa maxLength quando definido). */
  showCount?: boolean;
  /** Redimensionamento pelo usuário. Padrão: vertical. */
  resize?: 'none' | 'vertical' | 'both';
  fullWidth?: boolean;
  wrapperClassName?: string;
}

/** Área de texto com o mesmo visual e estados do Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    id,
    label,
    hint,
    error,
    success,
    variant = 'default',
    showCount,
    resize = 'vertical',
    fullWidth,
    wrapperClassName,
    className,
    rows = 4,
    maxLength,
    value,
    defaultValue,
    disabled,
    required,
    onChange,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? `nk-textarea-${autoId}`;
  const [count, setCount] = useState(String(value ?? defaultValue ?? '').length);
  const current = value !== undefined ? String(value).length : count;
  const valid = error == null && success != null && success !== false;
  const describedBy =
    error != null || hint != null || (success != null && typeof success !== 'boolean') ? `${fieldId}-message` : undefined;

  return (
    <Field
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      success={success}
      required={required}
      fullWidth={fullWidth}
      className={wrapperClassName}
    >
      <div
        className={cx(
          'nk-control',
          'nk-textarea',
          `nk-control--${variant}`,
          error != null && 'nk-control--invalid',
          valid && 'nk-control--valid',
          disabled && 'nk-control--disabled',
          className,
        )}
      >
        <textarea
          ref={ref}
          id={fieldId}
          className="nk-textarea__native"
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          aria-invalid={error != null || undefined}
          aria-describedby={describedBy}
          style={{ resize }}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setCount(e.target.value.length);
            onChange?.(e);
          }}
          {...rest}
        />
        {showCount && (
          <span className="nk-textarea__count" aria-live="polite">
            {maxLength ? `${current}/${maxLength}` : current}
          </span>
        )}
      </div>
    </Field>
  );
});
