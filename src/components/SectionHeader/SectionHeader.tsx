import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './SectionHeader.css';

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Linha curta acima do título (ex.: "Monitoramento"). */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Nível do título. Padrão: h2. */
  as?: ElementType;
  size?: 'md' | 'lg';
}

/** Cabeçalho de seção: eyebrow + título + descrição. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  size = 'md',
  className,
  ...rest
}: SectionHeaderProps) {
  return (
    <div className={cx('nk-section-header', `nk-section-header--${align}`, `nk-section-header--${size}`, className)} {...rest}>
      {eyebrow != null && <span className="nk-section-header__eyebrow">{eyebrow}</span>}
      <Tag className="nk-section-header__title">{title}</Tag>
      {description != null && <p className="nk-section-header__description">{description}</p>}
    </div>
  );
}
