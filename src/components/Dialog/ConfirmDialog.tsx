import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from '../Alert';
import { Button } from '../Button';
import { Dialog, type DialogCloseReason, type FocusTarget } from './Dialog';

export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  /** Consequências da ação (o que muda, para quem, o que NÃO é desfeito). */
  children?: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel?: ReactNode;
  /** `danger` para ações destrutivas (botão vermelho). Padrão: `primary`. */
  tone?: 'primary' | 'danger';
  /**
   * Chamado UMA vez por confirmação: cliques repetidos são ignorados enquanto a confirmação anterior não terminar
   * (promessa pendente ou `busy`). Se devolver promessa, a trava dura até ELA terminar — e, enquanto pendente, conta
   * como envio: nenhuma forma de fechar tem efeito. Sem promessa, a trava dura até `busy` passar de true a false; sem
   * promessa e sem `busy`, vale uma confirmação por abertura. Uma promessa de antes de reabrir nunca libera a atual.
   */
  onConfirm: () => void | Promise<unknown>;
  /** Cancelamento (Cancelar, Esc, "Fechar", fundo). Nunca chamado durante `busy` nem com a promessa da confirmação pendente. */
  onCancel: (reason: DialogCloseReason) => void;
  /** Envio em curso: Confirmar mostra carregamento; Cancelar, Esc, "Fechar" e fundo ficam sem efeito. */
  busy?: boolean;
  /** Impede confirmar (ex.: resultado anterior incerto, aguardando decisão). */
  confirmDisabled?: boolean;
  /** Mensagem de erro dentro do diálogo (anunciada como alerta). */
  error?: ReactNode;
  /** Ver `Dialog`. Padrão do foco inicial: o botão Cancelar (a opção menos destrutiva). */
  initialFocus?: FocusTarget;
  returnFocus?: FocusTarget;
  fallbackFocus?: FocusTarget;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Confirmação de ação sobre o `Dialog` (`role="alertdialog"`): título, consequências, Cancelar e Confirmar.
 * O componente não repete nada sozinho e não decide o resultado: quem chama controla `busy`, `error` e o fechamento.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'primary',
  onConfirm,
  onCancel,
  busy = false,
  confirmDisabled = false,
  error,
  initialFocus,
  returnFocus,
  fallbackFocus,
  size = 'sm',
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  /**
   * Trava da confirmação ATUAL, identificada por um número único. Só a conclusão da própria confirmação (promessa) ou o
   * fim do `busy` que ela provocou a libera; uma promessa de uma confirmação ou abertura anterior que termine depois não
   * toca na trava atual. Reabrir o diálogo começa sem trava.
   */
  const lock = useRef<{ id: number; kind: 'promise' | 'sync' } | null>(null);
  const seq = useRef(0);
  /** Promessa da confirmação atual pendente: conta como envio (bloqueia todas as formas de fechar). */
  const [pendingId, setPendingId] = useState<number | null>(null);
  const wasBusy = useRef(busy);

  useEffect(() => {
    // nova abertura (ou fechamento): a confirmação anterior deixa de ser a atual
    lock.current = null;
    setPendingId(null);
  }, [open]);
  useEffect(() => {
    // `busy` true -> false: terminou o envio de uma confirmação sem promessa
    if (wasBusy.current && !busy && lock.current?.kind === 'sync') lock.current = null;
    wasBusy.current = busy;
  }, [busy]);

  const sending = busy || pendingId !== null;

  const confirm = () => {
    if (lock.current || sending || confirmDisabled) return;
    const id = ++seq.current;
    lock.current = { id, kind: 'sync' };
    let result: void | Promise<unknown>;
    try {
      result = onConfirm();
    } catch (e) {
      if (lock.current?.id === id) lock.current = null;
      throw e;
    }
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      lock.current = { id, kind: 'promise' };
      setPendingId(id);
      const settle = () => {
        // só a confirmação que ainda é a atual libera; uma antiga (de antes de reabrir) não faz nada
        if (lock.current?.id !== id) return;
        lock.current = null;
        setPendingId((p) => (p === id ? null : p));
      };
      (result as Promise<unknown>).then(settle, settle);
    }
  };

  return (
    <Dialog
      open={open}
      role="alertdialog"
      title={title}
      description={description}
      size={size}
      busy={sending}
      onClose={onCancel}
      initialFocus={initialFocus ?? cancelRef}
      returnFocus={returnFocus}
      fallbackFocus={fallbackFocus}
      footer={
        <>
          <Button ref={cancelRef} variant="ghost" disabled={sending} onClick={() => !sending && onCancel('cancel')}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={sending} disabled={confirmDisabled} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error != null && (
        <Alert tone="danger" live="assertive">
          {error}
        </Alert>
      )}
    </Dialog>
  );
}
