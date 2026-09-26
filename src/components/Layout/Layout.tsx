import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Layout.css';

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
const space = (n: Space) => (n === 0 ? '0' : `var(--nk-space-${n})`);

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Direção: vertical (column) ou horizontal (row). */
  direction?: 'column' | 'row';
  /** Espaçamento entre itens (escala de tokens: 1 = 4px, 4 = 16px...). */
  gap?: Space;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: ElementType;
}

/** Empilha filhos com espaçamento uniforme (flexbox). */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = 'column', gap = 4, align, justify, wrap, as: Tag = 'div', className, style, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx('nk-stack', className)}
      style={{
        flexDirection: direction,
        gap: space(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Número de colunas ou template CSS (ex.: "2fr 1fr"). */
  columns?: number | string;
  /** Largura mínima de cada coluna para grid responsivo (auto-fit). Ignora `columns`. */
  minColumnWidth?: string;
  gap?: Space;
  as?: ElementType;
}

/** Grid responsivo para cards/estatísticas. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { columns = 2, minColumnWidth, gap = 4, as: Tag = 'div', className, style, ...rest },
  ref,
) {
  const template = minColumnWidth
    ? `repeat(auto-fit, minmax(min(${minColumnWidth}, 100%), 1fr))`
    : typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  return (
    <Tag
      ref={ref}
      className={cx('nk-grid', className)}
      style={{ gridTemplateColumns: template, gap: space(gap), ...style }}
      {...rest}
    />
  );
});
