import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { IconProp } from '../../utils/renderIcon';
import { IconBox } from '../IconBox';
import './Steps.css';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  /** Ícone no marcador. Sem ícone, mostra o número da etapa. */
  icon?: IconProp;
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  items: StepItem[];
  /** horizontal vira vertical em telas estreitas. Padrão: horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** Mostra o número da etapa acima do título. Padrão: true. */
  numbered?: boolean;
}

/** Linha do tempo de etapas (jornada, processo, onboarding). */
export function Steps({ items, orientation = 'horizontal', numbered = true, className, ...rest }: StepsProps) {
  return (
    <ol className={cx('nk-steps', `nk-steps--${orientation}`, className)} {...rest}>
      {items.map((item, i) => (
        <li key={i} className="nk-steps__item">
          <div className="nk-steps__marker">
            {item.icon != null ? (
              <IconBox icon={item.icon} tone="accent" variant="solid" size="md" shape="circle" />
            ) : (
              <span className="nk-steps__number">{i + 1}</span>
            )}
          </div>
          <div className="nk-steps__content">
            {numbered && <span className="nk-steps__index">Etapa {String(i + 1).padStart(2, '0')}</span>}
            <span className="nk-steps__title">{item.title}</span>
            {item.description != null && <span className="nk-steps__description">{item.description}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
