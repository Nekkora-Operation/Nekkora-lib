import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Alert, type AlertTone } from '../Alert';

export interface StatusRegionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
  /** Mensagem atual. `null`/`undefined` = região vazia (continua no documento). */
  message?: ReactNode;
  title?: ReactNode;
  tone?: AlertTone;
  /**
   * Muda a cada novo anúncio, para repetir uma mensagem igual (ex.: o mesmo resultado duas vezes seguidas): o conteúdo
   * é recriado e os leitores de tela anunciam de novo.
   */
  announceKey?: string | number;
  /** Só anuncia, sem mostrar (ex.: o resultado já está visível na lista). */
  visuallyHidden?: boolean;
}

/**
 * Região viva persistente (`role="status"`, educada, atômica) para anunciar o resultado de uma ação sem mover o foco.
 *
 * A região fica SEMPRE no documento — só o conteúdo muda —, porque uma região que aparece junto com a mensagem
 * costuma não ser anunciada. Monte-a uma vez na tela e troque `message`. Para erros que exigem atenção imediata,
 * use `Alert` com `tone="danger"` (role=alert).
 */
export function StatusRegion({
  message,
  title,
  tone = 'success',
  announceKey,
  visuallyHidden = false,
  className,
  ...rest
}: StatusRegionProps) {
  const has = message != null || title != null;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cx('nk-status-region', visuallyHidden && 'nk-visually-hidden', className)}
      {...rest}
    >
      {has && (
        <Fragment key={announceKey}>
          {visuallyHidden ? (
            <>
              {title != null && <span>{title} </span>}
              {message}
            </>
          ) : (
            <Alert tone={tone} title={title} live="off">
              {message}
            </Alert>
          )}
        </Fragment>
      )}
    </div>
  );
}
