import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { renderIcon, type IconProp } from '../../utils/renderIcon';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * surface = painel padrão do dashboard · raised = card destacado (tom rosado)
   * · outlined = só borda · glow = borda com brilho de acento (item ativo).
   */
  variant?: 'surface' | 'raised' | 'outlined' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Efeito de hover para cards clicáveis. */
  interactive?: boolean;
  as?: ElementType;
}

/** Container visual (painel). Compose com CardHeader, CardBody e CardFooter. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant = 'surface', padding = 'md', interactive, as: Tag = 'section', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx(
        'nk-card',
        `nk-card--${variant}`,
        `nk-card--pad-${padding}`,
        interactive && 'nk-card--interactive',
        className,
      )}
      {...rest}
    />
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Ícone à esquerda do título. */
  icon?: IconProp;
  /** Conteúdo à direita (ex.: <Link arrow>Ver todas</Link> ou um <Select>). */
  action?: ReactNode;
  /** Linha divisória abaixo do cabeçalho. */
  divider?: boolean;
}

export function CardHeader({ title, subtitle, icon, action, divider, className, children, ...rest }: CardHeaderProps) {
  return (
    <div className={cx('nk-card__header', divider && 'nk-card__header--divider', className)} {...rest}>
      {icon != null && <span className="nk-card__icon">{renderIcon(icon, 20)}</span>}
      <div className="nk-card__heading">
        {title != null && <h3 className="nk-card__title">{title}</h3>}
        {subtitle != null && <p className="nk-card__subtitle">{subtitle}</p>}
        {children}
      </div>
      {action != null && <div className="nk-card__action">{action}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('nk-card__body', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('nk-card__footer', className)} {...rest} />;
}
