import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Container.css';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Largura máxima: sm 640 · md 960 · lg 1200 · xl 1440 · fluid 100%. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  /** Espaçamento interno horizontal/vertical. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Centraliza horizontalmente (margin auto). */
  centered?: boolean;
  as?: ElementType;
}

/** Container de página/seção com largura máxima. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { size = 'lg', padding = 'md', centered = true, as: Tag = 'div', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx(
        'nk-container',
        `nk-container--${size}`,
        `nk-container--pad-${padding}`,
        centered && 'nk-container--centered',
        className,
      )}
      {...rest}
    />
  );
});
