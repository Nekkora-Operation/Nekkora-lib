import {
  forwardRef,
  useId,
  type OptionHTMLAttributes,
  type OptgroupHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import type { Size } from '../../tokens/tokens';
import { Icon } from '../Icon';
import { Field } from '../Field';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  size?: Size;
  variant?: 'default' | 'filled' | 'ghost';
  /** Ícone à esquerda (ex.: "calendar" para "Últimos 7 dias"). */
  leftIcon?: IconProp;
  /** Opção inicial desabilitada exibida quando não há valor. */
  placeholder?: string;
  /** Lista de opções (alternativa a passar <Option> como children). Aceita grupos. */
  options?: Array<SelectOption | SelectOptionGroup>;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const;

const isGroup = (o: SelectOption | SelectOptionGroup): o is SelectOptionGroup => 'options' in o;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id,
    label,
    hint,
    error,
    size = 'md',
    variant = 'default',
    leftIcon,
    placeholder,
    options,
    fullWidth,
    wrapperClassName,
    className,
    disabled,
    required,
    value,
    defaultValue,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? `nk-select-${autoId}`;
  const px = ICON_SIZE[size];
  // Com placeholder e sem valor inicial, começa na opção placeholder.
  const initial = placeholder && value === undefined && defaultValue === undefined ? '' : defaultValue;

  return (
    <Field
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      fullWidth={fullWidth}
      className={wrapperClassName}
    >
      <div
        className={cx(
          'nk-control',
          'nk-select',
          `nk-control--${size}`,
          `nk-control--${variant}`,
          error != null && 'nk-control--invalid',
          disabled && 'nk-control--disabled',
          className,
        )}
      >
        {leftIcon != null && <span className="nk-control__addon">{renderIcon(leftIcon, px)}</span>}
        <select
          ref={ref}
          id={selectId}
          className="nk-control__native nk-select__native"
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={initial}
          aria-invalid={error != null || undefined}
          aria-describedby={error != null || hint != null ? `${selectId}-message` : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options?.map((o) =>
            isGroup(o) ? (
              <OptionGroup key={o.label} label={o.label}>
                {o.options.map((opt) => (
                  <Option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </Option>
                ))}
              </OptionGroup>
            ) : (
              <Option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </Option>
            ),
          )}
          {children}
        </select>
        <Icon name="chevron-down" size={px} className="nk-select__chevron" />
      </div>
    </Field>
  );
});

export type OptionProps = OptionHTMLAttributes<HTMLOptionElement>;

/** Item de <Select>. */
export const Option = forwardRef<HTMLOptionElement, OptionProps>(function Option({ className, ...rest }, ref) {
  return <option ref={ref} className={cx('nk-option', className)} {...rest} />;
});

export type OptionGroupProps = OptgroupHTMLAttributes<HTMLOptGroupElement>;

/** Agrupador de <Option>. */
export const OptionGroup = forwardRef<HTMLOptGroupElement, OptionGroupProps>(function OptionGroup(
  { className, ...rest },
  ref,
) {
  return <optgroup ref={ref} className={cx('nk-optgroup', className)} {...rest} />;
});
