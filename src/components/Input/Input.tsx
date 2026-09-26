import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { formatWithMask, maskInputMode, maskMaxLength, unmask, type MaskPreset } from '../../utils/masks';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import type { Size } from '../../tokens/tokens';
import { Icon } from '../Icon';
import { Field } from '../Field';

export type InputVariant = 'default' | 'filled' | 'ghost';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'prefix'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Estado de sucesso: true só pinta o campo; um texto também aparece abaixo dele. */
  success?: boolean | ReactNode;
  size?: Size;
  variant?: InputVariant;
  /** Ícone à esquerda (nome Nekkora ou ReactNode). */
  leftIcon?: IconProp;
  /** Ícone à direita (nome Nekkora ou ReactNode). */
  rightIcon?: IconProp;
  /** Texto/elemento fixo antes do valor (ex.: "R$", "https://"). */
  prefix?: ReactNode;
  /** Texto/elemento fixo depois do valor (ex.: "kg", "%"). */
  suffix?: ReactNode;
  /** Atalho de teclado exibido à direita (ex.: "Ctrl K"). */
  shortcut?: string;
  /**
   * Máscara: preset ('cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date')
   * ou padrão customizado (9 = dígito, A = letra, * = alfanumérico). Ex.: "AAA-9A99".
   */
  mask?: MaskPreset | (string & {});
  /** Mostra botão para limpar o valor. */
  clearable?: boolean;
  /** Para type="password": mostra botão de exibir/ocultar senha. Padrão: true. */
  passwordToggle?: boolean;
  fullWidth?: boolean;
  /** Classe do wrapper externo. */
  wrapperClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Recebe o valor mascarado e o valor bruto (sem máscara). */
  onValueChange?: (value: string, rawValue: string) => void;
}

const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    success,
    size = 'md',
    variant = 'default',
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    shortcut,
    mask,
    clearable,
    passwordToggle = true,
    fullWidth,
    wrapperClassName,
    className,
    type = 'text',
    value,
    defaultValue,
    disabled,
    required,
    onChange,
    onValueChange,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `nk-input-${autoId}`;
  const isControlled = value !== undefined;
  const format = (v: string) => (mask ? formatWithMask(v, mask) : v);

  const [inner, setInner] = useState(() => format(String(defaultValue ?? '')));
  const [showPassword, setShowPassword] = useState(false);
  const current = isControlled ? format(String(value ?? '')) : inner;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = format(event.target.value);
    event.target.value = next;
    if (!isControlled) setInner(next);
    onChange?.(event);
    onValueChange?.(next, mask ? unmask(next) : next);
  };

  const clear = () => {
    if (!isControlled) setInner('');
    onValueChange?.('', '');
  };

  const px = ICON_SIZE[size];
  const isPassword = type === 'password';
  const describedBy =
    error != null || hint != null || (success != null && typeof success !== 'boolean') ? `${inputId}-message` : undefined;

  return (
    <Field
      id={inputId}
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
          `nk-control--${size}`,
          `nk-control--${variant}`,
          error != null && 'nk-control--invalid',
          error == null && success != null && success !== false && 'nk-control--valid',
          disabled && 'nk-control--disabled',
          className,
        )}
      >
        {leftIcon != null && <span className="nk-control__addon">{renderIcon(leftIcon, px)}</span>}
        {prefix != null && <span className="nk-control__addon">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          className="nk-control__native"
          type={isPassword && showPassword ? 'text' : type}
          value={current}
          disabled={disabled}
          required={required}
          aria-invalid={error != null || undefined}
          aria-describedby={describedBy}
          inputMode={mask ? maskInputMode(mask) : undefined}
          maxLength={mask ? maskMaxLength(mask) : undefined}
          onChange={handleChange}
          {...rest}
        />
        {clearable && current && !disabled && (
          <button type="button" className="nk-control__action" onClick={clear} aria-label="Limpar">
            <Icon name="close" size={px - 2} />
          </button>
        )}
        {isPassword && passwordToggle && (
          <button
            type="button"
            className="nk-control__action"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            disabled={disabled}
          >
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={px} />
          </button>
        )}
        {suffix != null && <span className="nk-control__addon">{suffix}</span>}
        {shortcut && <kbd className="nk-control__kbd">{shortcut}</kbd>}
        {rightIcon != null && <span className="nk-control__addon">{renderIcon(rightIcon, px)}</span>}
        {error == null && success != null && success !== false && (
          <span className="nk-control__valid-icon">
            <Icon name="check-circle" size={px} />
          </span>
        )}
      </div>
    </Field>
  );
});
