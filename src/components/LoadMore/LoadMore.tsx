import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './LoadMore.css';

export interface LoadMoreProps extends HTMLAttributes<HTMLDivElement> {
  /** Há próxima página (o cursor da última página não é nulo). */
  hasMore: boolean;
  /** A próxima página está sendo carregada. */
  loading?: boolean;
  onLoadMore: () => void;
  /** Itens já exibidos (a API não informa total; o texto nunca promete "de N"). */
  count?: number;
  /** Rótulo do item no plural, para o texto de contagem (ex.: "execuções"). */
  itemLabel?: string;
  /** Falha ao carregar mais: a lista exibida continua e o botão vira "Tentar novamente". */
  error?: ReactNode;
  /**
   * A continuação deixou de valer (cursor recusado: a lista mudou, o filtro mudou ou a chave foi rotacionada).
   * Mostra o aviso e oferece recomeçar; nada é repetido automaticamente.
   */
  stale?: ReactNode;
  onRestart?: () => void;
  /**
   * Continuar indisponível agora, por motivo do consumidor (ex.: sem conexão, sessão sendo conferida). Mostra o motivo
   * e não oferece o botão; a lista exibida continua.
   */
  unavailable?: ReactNode;
  /** Texto do fim da lista. */
  endLabel?: ReactNode;
  loadLabel?: string;
}

/**
 * "Carregar mais" para listas paginadas por cursor (sem total e sem número de página). Anuncia a contagem e o fim
 * da lista para leitores de tela; em erro, mantém o que já foi exibido; com a continuação inválida, oferece recomeçar.
 */
export function LoadMore({
  hasMore,
  loading = false,
  onLoadMore,
  count,
  itemLabel = 'itens',
  error,
  stale,
  onRestart,
  unavailable,
  endLabel = 'Fim da lista',
  loadLabel = 'Carregar mais',
  className,
  ...rest
}: LoadMoreProps) {
  // "Exibindo N <itens>": não depende do gênero do rótulo
  const shown = count !== undefined ? `Exibindo ${count.toLocaleString('pt-BR')} ${itemLabel}` : null;
  let body: ReactNode;
  if (stale != null) {
    body = (
      <>
        <p className="nk-loadmore__message nk-loadmore__message--warning">
          <Icon name="alert" size="sm" />
          <span>{stale}</span>
        </p>
        {onRestart && (
          <Button variant="secondary" size="sm" leftIcon="refresh" onClick={onRestart}>
            Recomeçar a lista
          </Button>
        )}
      </>
    );
  } else if (unavailable != null && hasMore) {
    body = (
      <p className="nk-loadmore__message nk-loadmore__message--muted">
        <Icon name="clock" size="sm" />
        <span>{unavailable}</span>
      </p>
    );
  } else if (error != null) {
    body = (
      <>
        <p className="nk-loadmore__message nk-loadmore__message--danger">
          <Icon name="x-circle" size="sm" />
          <span>{error}</span>
        </p>
        <Button variant="secondary" size="sm" leftIcon="refresh" loading={loading} onClick={onLoadMore}>
          Tentar novamente
        </Button>
      </>
    );
  } else if (hasMore) {
    body = (
      <Button variant="secondary" size="sm" loading={loading} onClick={onLoadMore}>
        {loading ? 'Carregando…' : loadLabel}
      </Button>
    );
  } else if (count !== 0) {
    body = <p className="nk-loadmore__end">{endLabel}</p>;
  }

  return (
    <div className={cx('nk-loadmore', className)} {...rest}>
      {body}
      <p className="nk-loadmore__count" role="status" aria-live="polite">
        {shown}
        {shown && !hasMore && stale == null && error == null && count !== 0 ? ' · lista completa' : ''}
      </p>
    </div>
  );
}
