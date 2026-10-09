import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Texto de apoio abaixo do rótulo da opção. */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
  /** Pergunta do grupo (vira a `<legend>`, lida junto de cada opção). */
  legend: ReactNode;
  options: RadioOption[];
  /** Valor escolhido (controlado). `null`/`undefined` = nenhuma opção marcada. */
  value?: string | null;
  onChange?: (value: string) => void;
  /** Nome do grupo no formulário. Padrão: gerado. */
  name?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Grupo de opções exclusivas com rádios nativos: Tab entra no grupo, setas mudam a opção e Espaço marca
 * (comportamento do navegador). `disabled` no grupo desabilita todas as opções.
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { legend, options, value, onChange, name, required, hint, error, orientation = 'vertical', disabled, className, ...rest },
  ref,
) {
  const autoId = useId();
  const groupName = name ?? `nk-radio-${autoId}`;
  const messageId = (error ?? hint) != null ? `${groupName}-message` : undefined;
  return (
    <fieldset
      ref={ref}
      className={cx('nk-radio-group', `nk-radio-group--${orientation}`, error != null && 'nk-radio-group--invalid', className)}
      disabled={disabled}
      aria-describedby={messageId}
      {...rest}
    >
      <legend className="nk-radio-group__legend">
        {legend}
        {required && (
          <span className="nk-radio-group__required" aria-hidden>
            {' '}
            *
          </span>
        )}
      </legend>
      <div className="nk-radio-group__options">
        {options.map((o) => {
          const id = `${groupName}-${o.value}`;
          const descId = o.description != null ? `${id}-description` : undefined;
          return (
            <div key={o.value} className={cx('nk-radio', (disabled || o.disabled) && 'nk-radio--disabled')}>
              <span className="nk-radio__box">
                <input
                  id={id}
                  type="radio"
                  className="nk-radio__native"
                  name={groupName}
                  value={o.value}
                  checked={value === o.value}
                  disabled={o.disabled}
                  required={required}
                  aria-invalid={error != null || undefined}
                  aria-describedby={descId}
                  onChange={() => onChange?.(o.value)}
                />
                <span className="nk-radio__mark" aria-hidden />
              </span>
              <span className="nk-radio__text">
                <label htmlFor={id} className="nk-radio__label">
                  {o.label}
                </label>
                {o.description != null && (
                  <span id={descId} className="nk-radio__description">
                    {o.description}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {(error ?? hint) != null && (
        <p id={messageId} className={cx('nk-radio-group__message', error != null && 'nk-radio-group__message--error')} aria-live={error != null ? 'polite' : undefined}>
          {error ?? hint}
        </p>
      )}
    </fieldset>
  );
});
