import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import type { Size, Tone } from '../../tokens/tokens';
import { Field } from '../Field';
import { Icon } from '../Icon';
import { IconBox } from '../IconBox';
import './SelectMenu.css';

export interface SelectMenuOption {
  value: string;
  label: string;
  /** Texto secundário abaixo do label. */
  description?: ReactNode;
  /** Ícone à esquerda (nome Nekkora ou ReactNode). */
  icon?: IconProp;
  /** Cor do ícone quando optionIcon="box". */
  iconTone?: Tone;
  /** Conteúdo à direita (ex.: <Badge>, atalho, contagem). */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface SelectMenuGroup {
  label: string;
  options: SelectMenuOption[];
}

type Item = SelectMenuOption | SelectMenuGroup;
const isGroup = (i: Item): i is SelectMenuGroup => 'options' in i;

interface BaseProps {
  options: Item[];
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  size?: Size;
  variant?: 'default' | 'filled' | 'ghost';
  /** Ícone fixo à esquerda do gatilho. */
  leftIcon?: IconProp;
  /** Como mostrar o ícone das opções: plain (só o ícone) ou box (IconBox suave). */
  optionIcon?: 'plain' | 'box';
  /** Campo de busca dentro do menu. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Texto quando a busca não encontra nada. */
  emptyMessage?: ReactNode;
  /** Botão para limpar a seleção. */
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  /** Altura máxima da lista (px). */
  maxHeight?: number;
  /** Nome do campo para envio em <form> (gera input hidden). */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export interface SelectMenuSingleProps extends BaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option: SelectMenuOption | null) => void;
}

export interface SelectMenuMultipleProps extends BaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], options: SelectMenuOption[]) => void;
  /** Quantos chips mostrar no gatilho antes de "+N". */
  maxChips?: number;
}

export type SelectMenuProps = SelectMenuSingleProps | SelectMenuMultipleProps;

const ICON_PX = { sm: 14, md: 16, lg: 18 } as const;

/**
 * Select com lista customizada: opções com ícone, descrição, badge, grupos,
 * busca e seleção múltipla. Para formulários simples/mobile, prefira o <Select> nativo.
 */
export const SelectMenu = forwardRef<HTMLDivElement, SelectMenuProps>(function SelectMenu(props, ref) {
  const {
    options,
    label,
    hint,
    error,
    placeholder = 'Selecione',
    size = 'md',
    variant = 'default',
    leftIcon,
    optionIcon = 'plain',
    searchable,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'Nenhuma opção encontrada.',
    clearable,
    disabled,
    required,
    fullWidth,
    maxHeight = 280,
    name,
    id,
    className,
  } = props;
  const multiple = props.multiple === true;

  const uid = useId();
  const baseId = id ?? `nk-selectmenu-${uid}`;
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  // ---- valor (controlado ou não)
  const initial = (props.value !== undefined ? props.value : props.defaultValue) ?? (multiple ? [] : null);
  const [inner, setInner] = useState<string | string[] | null>(initial);
  const isControlled = props.value !== undefined;
  const current = isControlled ? (props.value ?? (multiple ? [] : null)) : inner;
  const selected = useMemo(
    () => new Set(multiple ? ((current as string[]) ?? []) : current != null ? [current as string] : []),
    [current, multiple],
  );

  // ---- opções planas (para teclado e busca)
  const flat = useMemo(() => options.flatMap((o) => (isGroup(o) ? o.options : [o])), [options]);
  const byValue = useMemo(() => new Map(flat.map((o) => [o.value, o])), [flat]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const q = query.trim().toLowerCase();
  const matches = (o: SelectMenuOption) =>
    !q || o.label.toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q);
  const visible = useMemo(() => flat.filter(matches), [flat, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const commit = (next: string | string[] | null) => {
    if (!isControlled) setInner(next);
    if (multiple) {
      const arr = next as string[];
      (props as SelectMenuMultipleProps).onChange?.(arr, arr.map((v) => byValue.get(v)!).filter(Boolean));
    } else {
      const v = next as string | null;
      (props as SelectMenuSingleProps).onChange?.(v, v != null ? (byValue.get(v) ?? null) : null);
    }
  };

  const openMenu = useCallback(() => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect && typeof window !== 'undefined') {
      const below = window.innerHeight - rect.bottom;
      setPlacement(below < maxHeight + 64 && rect.top > below ? 'top' : 'bottom');
    }
    setOpen(true);
    const firstSelected = flat.findIndex((o) => selected.has(o.value));
    setActive(firstSelected >= 0 ? firstSelected : flat.findIndex((o) => !o.disabled));
  }, [disabled, flat, maxHeight, selected]);

  const closeMenu = useCallback((focusTrigger = true) => {
    setOpen(false);
    setQuery('');
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const choose = (opt: SelectMenuOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const arr = [...((current as string[]) ?? [])];
      const i = arr.indexOf(opt.value);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(opt.value);
      commit(arr);
    } else {
      commit(opt.value);
      closeMenu();
    }
  };

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, closeMenu]);

  // Foco na busca ao abrir
  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  // Mantém a opção ativa visível
  const activeOpt = visible[active];
  useEffect(() => {
    if (!open || !activeOpt) return;
    document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeOpt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao filtrar, ativa o primeiro resultado habilitado
  useEffect(() => {
    if (open) setActive(visible.findIndex((o) => !o.disabled));
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const move = (dir: 1 | -1, from = active) => {
    if (!visible.length) return;
    let i = from;
    for (let n = 0; n < visible.length; n++) {
      i = (i + dir + visible.length) % visible.length;
      if (!visible[i].disabled) return setActive(i);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'Home':
        e.preventDefault();
        move(1, -1);
        break;
      case 'End':
        e.preventDefault();
        move(-1, visible.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeOpt) choose(activeOpt);
        break;
      case ' ':
        if (!searchable) {
          e.preventDefault();
          if (activeOpt) choose(activeOpt);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        // Type-ahead: digitar pula para a opção que começa com o texto
        if (!searchable && e.key.length === 1) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = now - t.at > 600 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.at = now;
          const i = visible.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) setActive(i);
        }
    }
  };

  // ---- renderização
  const px = ICON_PX[size];
  const selectedOptions = [...selected].map((v) => byValue.get(v)).filter(Boolean) as SelectMenuOption[];
  const single = !multiple ? selectedOptions[0] : undefined;
  const maxChips = multiple ? ((props as SelectMenuMultipleProps).maxChips ?? 3) : 0;

  const renderOptIcon = (o: SelectMenuOption, inTrigger = false) => {
    if (o.icon == null) return null;
    if (optionIcon === 'box' && !inTrigger)
      return <IconBox icon={o.icon} tone={o.iconTone ?? 'accent'} variant="soft" size="sm" />;
    return <span className="nk-selectmenu__opt-icon">{renderIcon(o.icon, px)}</span>;
  };

  let visibleIndex = -1;
  const renderOption = (o: SelectMenuOption) => {
    if (!matches(o)) return null;
    visibleIndex += 1;
    const i = visibleIndex;
    const isSelected = selected.has(o.value);
    return (
      <li
        key={o.value}
        id={optionId(i)}
        role="option"
        data-value={o.value}
        aria-selected={isSelected}
        aria-disabled={o.disabled || undefined}
        className={cx(
          'nk-selectmenu__option',
          i === active && 'is-active',
          isSelected && 'is-selected',
          o.disabled && 'is-disabled',
        )}
        onMouseEnter={() => !o.disabled && setActive(i)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(o)}
      >
        {multiple && (
          <span className="nk-selectmenu__checkbox" aria-hidden>
            {isSelected && <Icon name="check" size={12} strokeWidth={2.5} />}
          </span>
        )}
        {renderOptIcon(o)}
        <span className="nk-selectmenu__opt-text">
          <span className="nk-selectmenu__opt-label">{o.label}</span>
          {o.description != null && <span className="nk-selectmenu__opt-desc">{o.description}</span>}
        </span>
        {o.meta != null && <span className="nk-selectmenu__opt-meta">{o.meta}</span>}
        {!multiple && isSelected && <Icon name="check" size={px} className="nk-selectmenu__check" />}
      </li>
    );
  };

  const hasValue = selectedOptions.length > 0;
  const describedBy = error != null || hint != null ? `${baseId}-message` : undefined;

  return (
    <Field
      id={baseId}
      labelId={label != null ? labelId : undefined}
      label={label}
      hint={hint}
      error={error}
      required={required}
      fullWidth={fullWidth}
      className={className}
    >
      <div ref={setRefs} className={cx('nk-selectmenu', open && 'is-open')}>
        <div
          ref={triggerRef}
          id={baseId}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          // A lista só existe no DOM aberta: aria-controls não pode apontar para um id inexistente.
          aria-controls={open ? listId : undefined}
          aria-labelledby={label != null ? labelId : undefined}
          aria-label={label == null ? props['aria-label'] : undefined}
          aria-activedescendant={open && !searchable && active >= 0 ? optionId(active) : undefined}
          aria-invalid={error != null || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={describedBy}
          className={cx(
            'nk-control',
            'nk-selectmenu__trigger',
            `nk-control--${size}`,
            `nk-control--${variant}`,
            error != null && 'nk-control--invalid',
            disabled && 'nk-control--disabled',
            multiple && 'nk-selectmenu__trigger--multiple',
          )}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={onKeyDown}
        >
          {leftIcon != null && <span className="nk-control__addon">{renderIcon(leftIcon, px)}</span>}
          {!leftIcon && single && renderOptIcon(single, true)}

          <span className="nk-selectmenu__value">
            {!hasValue && <span className="nk-selectmenu__placeholder">{placeholder}</span>}
            {single && <span className="nk-selectmenu__single">{single.label}</span>}
            {multiple &&
              selectedOptions.slice(0, maxChips).map((o) => (
                <span key={o.value} className="nk-selectmenu__chip">
                  {o.label}
                  {!disabled && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={`Remover ${o.label}`}
                      className="nk-selectmenu__chip-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        choose(o);
                      }}
                    >
                      <Icon name="close" size={10} strokeWidth={2.5} />
                    </button>
                  )}
                </span>
              ))}
            {multiple && selectedOptions.length > maxChips && (
              <span className="nk-selectmenu__chip nk-selectmenu__chip--more">+{selectedOptions.length - maxChips}</span>
            )}
          </span>

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              className="nk-control__action"
              aria-label="Limpar seleção"
              onClick={(e) => {
                e.stopPropagation();
                commit(multiple ? [] : null);
              }}
            >
              <Icon name="close" size={px - 2} />
            </button>
          )}
          <Icon name="chevron-down" size={px} className="nk-selectmenu__chevron" />
        </div>

        {open && (
          <div className={cx('nk-selectmenu__menu', `nk-selectmenu__menu--${placement}`)}>
            {searchable && (
              <div className="nk-selectmenu__search">
                <Icon name="search" size={14} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  aria-controls={listId}
                  aria-activedescendant={active >= 0 ? optionId(active) : undefined}
                />
              </div>
            )}
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-labelledby={label != null ? labelId : undefined}
              className="nk-selectmenu__list"
              style={{ maxHeight }}
            >
              {options.map((item) =>
                isGroup(item) ? (
                  item.options.some(matches) ? (
                    <li key={`g-${item.label}`} role="presentation" className="nk-selectmenu__group">
                      <div className="nk-selectmenu__group-label" aria-hidden>
                        {item.label}
                      </div>
                      <ul role="group" aria-label={item.label}>
                        {item.options.map(renderOption)}
                      </ul>
                    </li>
                  ) : null
                ) : (
                  renderOption(item)
                ),
              )}
              {visible.length === 0 && <li className="nk-selectmenu__empty">{emptyMessage}</li>}
            </ul>
          </div>
        )}

        {name != null &&
          (multiple ? (
            [...selected].map((v) => <input key={v} type="hidden" name={name} value={v} />)
          ) : (
            <input type="hidden" name={name} value={(current as string | null) ?? ''} />
          ))}
      </div>
    </Field>
  );
});
