import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import './Fieldset.css';

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  /** Título do grupo. */
  legend?: ReactNode;
  /** Texto descritivo abaixo do título. */
  description?: ReactNode;
  icon?: IconProp;
  /** default = com borda e fundo · plain = sem caixa · divided = linha acima. */
  variant?: 'default' | 'plain' | 'divided';
  /** Distribui os campos em N colunas (1–4). Em telas pequenas volta para 1. */
  columns?: 1 | 2 | 3 | 4;
  /** Ações à direita da legenda (ex.: botão "Adicionar"). */
  action?: ReactNode;
}

/** Agrupa campos de formulário relacionados. `disabled` desabilita todos os campos internos. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, icon, variant = 'default', columns = 1, action, className, children, ...rest },
  ref,
) {
  const descriptionId = `nk-fieldset-${useId()}-description`;
  return (
    <fieldset
      ref={ref}
      className={cx('nk-fieldset', `nk-fieldset--${variant}`, className)}
      aria-describedby={description != null ? descriptionId : undefined}
      {...rest}
    >
      {legend != null && <legend className="nk-visually-hidden">{legend}</legend>}
      {(legend != null || description != null || action != null) && (
        <div className="nk-fieldset__header">
          {icon != null && <span className="nk-fieldset__icon">{renderIcon(icon, 18)}</span>}
          <div className="nk-fieldset__heading">
            {legend != null && <div className="nk-fieldset__legend" aria-hidden>
                {legend}
              </div>}
            {description != null && <p id={descriptionId} className="nk-fieldset__description">{description}</p>}
          </div>
          {action != null && <div className="nk-fieldset__action">{action}</div>}
        </div>
      )}
      <div className={cx('nk-fieldset__content', `nk-fieldset__content--cols-${columns}`)}>{children}</div>
    </fieldset>
  );
});
