import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './DescriptionList.css';

export interface DescriptionItem {
  /** Chave estável; padrão: o índice. */
  key?: string;
  term: ReactNode;
  /** Valor. `null`/`undefined`/'' mostram o marcador de vazio (o campo existe, sem valor). */
  description?: ReactNode;
  /** Ocupa a linha inteira (ex.: descrição longa). */
  wide?: boolean;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** Colunas no desktop (o celular sempre usa 1). Padrão: 2. */
  columns?: 1 | 2 | 3;
  /** Marcador de valor ausente. Padrão: "—" (lido como "não informado"). */
  emptyLabel?: ReactNode;
}

/**
 * Lista de detalhes chave–valor (<dl>) para telas de detalhe. Valor ausente aparece como "—" com texto acessível
 * "não informado", para nunca sumir o campo.
 */
export function DescriptionList({ items, columns = 2, emptyLabel, className, ...rest }: DescriptionListProps) {
  return (
    <dl className={cx('nk-dl', `nk-dl--cols-${columns}`, className)} {...rest}>
      {items.map((item, i) => {
        const empty = item.description === null || item.description === undefined || item.description === '';
        return (
          <div key={item.key ?? i} className={cx('nk-dl__item', item.wide && 'nk-dl__item--wide')}>
            <dt className="nk-dl__term">{item.term}</dt>
            <dd className={cx('nk-dl__desc', empty && 'nk-dl__desc--empty')}>
              {/* aria-label não vale em <span> (papel genérico): o traço fica oculto e o texto vai só para o leitor de tela */}
              {empty ? (emptyLabel ?? <><span aria-hidden="true">—</span><span className="nk-visually-hidden">não informado</span></>) : item.description}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
