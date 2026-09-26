import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './Table.css';

type Align = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  /** Chave do dado (ou identificador único da coluna). */
  key: string;
  header: ReactNode;
  /** Renderização customizada da célula. Padrão: row[key]. */
  render?: (row: T, index: number) => ReactNode;
  align?: Align;
  /** Largura CSS (ex.: 120, "20%"). */
  width?: number | string;
  /** Texto secundário (cor mais suave), útil para datas/durações. */
  muted?: boolean;
}

export interface TableProps<T> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<T>[];
  data: T[];
  /** Chave única de cada linha. Padrão: índice. */
  rowKey?: keyof T | ((row: T, index: number) => string | number);
  size?: 'sm' | 'md' | 'lg';
  /** Linhas zebradas. */
  striped?: boolean;
  /** Destaque ao passar o mouse. Padrão: true. */
  hoverable?: boolean;
  /** Mantém o cabeçalho fixo ao rolar (defina maxHeight). */
  stickyHeader?: boolean;
  maxHeight?: number | string;
  /** Envolve a tabela em uma caixa com borda/fundo. */
  bordered?: boolean;
  /** Conteúdo exibido quando `data` está vazio. */
  emptyMessage?: ReactNode;
  /** Mostra linhas "esqueleto" de carregamento. */
  loading?: boolean;
  onRowClick?: (row: T, index: number) => void;
  caption?: ReactNode;
}

function getRowKey<T>(row: T, index: number, rowKey?: TableProps<T>['rowKey']) {
  if (typeof rowKey === 'function') return rowKey(row, index);
  if (rowKey != null) return String(row[rowKey]);
  return index;
}

/** Tabela orientada a dados. Para montagens livres, use TableRoot/TableHead/TableRow/TableCell. */
export function Table<T extends object>({
  columns,
  data,
  rowKey,
  size = 'md',
  striped,
  hoverable = true,
  stickyHeader,
  maxHeight,
  bordered,
  emptyMessage = 'Nenhum registro encontrado.',
  loading,
  onRowClick,
  caption,
  className,
  ...rest
}: TableProps<T>) {
  return (
    <TableRoot
      size={size}
      striped={striped}
      hoverable={hoverable}
      stickyHeader={stickyHeader}
      maxHeight={maxHeight}
      bordered={bordered}
      className={className}
      {...rest}
    >
      {caption != null && <caption className="nk-table__caption">{caption}</caption>}
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.key} align={col.align} style={{ width: col.width }}>
              {col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          Array.from({ length: 4 }, (_, i) => (
            <TableRow key={`sk-${i}`}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <span className="nk-table__skeleton" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="nk-table__empty">
              <Icon name="folder" size={24} />
              <div>{emptyMessage}</div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, i) => (
            <TableRow
              key={getRowKey(row, i, rowKey)}
              clickable={!!onRowClick}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
            >
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} muted={col.muted}>
                  {col.render ? col.render(row, i) : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableRoot>
  );
}

/* ---------- Primitivos (composição livre) ---------- */

export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  bordered?: boolean;
}

export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  { size = 'md', striped, hoverable = true, stickyHeader, maxHeight, bordered, className, ...rest },
  ref,
) {
  return (
    <div
      className={cx('nk-table-wrapper', bordered && 'nk-table-wrapper--bordered')}
      style={{ maxHeight }}
    >
      <table
        ref={ref}
        className={cx(
          'nk-table',
          `nk-table--${size}`,
          striped && 'nk-table--striped',
          hoverable && 'nk-table--hoverable',
          stickyHeader && 'nk-table--sticky',
          className,
        )}
        {...rest}
      />
    </div>
  );
});

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cx('nk-table__head', props.className)} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cx('nk-table__body', props.className)} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
  selected?: boolean;
}

export function TableRow({ clickable, selected, className, ...rest }: TableRowProps) {
  return (
    <tr
      className={cx('nk-table__row', clickable && 'nk-table__row--clickable', selected && 'nk-table__row--selected', className)}
      aria-selected={selected || undefined}
      {...rest}
    />
  );
}

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: Align;
}

export function TableHeaderCell({ align = 'left', className, ...rest }: TableHeaderCellProps) {
  return <th scope="col" className={cx('nk-table__th', `nk-table__cell--${align}`, className)} {...rest} />;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: Align;
  muted?: boolean;
}

export function TableCell({ align = 'left', muted, className, ...rest }: TableCellProps) {
  return <td className={cx('nk-table__td', `nk-table__cell--${align}`, muted && 'nk-table__td--muted', className)} {...rest} />;
}
