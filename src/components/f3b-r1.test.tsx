import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ConfirmDialog, Dialog, RadioGroup, type DialogCloseReason } from '../index';

// F3b-R1: trava por confirmação/abertura, promessa pendente como envio, destinos de foco efetivamente disponíveis.
// Estes testes reprovam nas fontes da F3b (R0): ver contraprova "fontes anteriores" no relatório da R1.

const tab = (shift = false) => fireEvent.keyDown(document, { key: 'Tab', shiftKey: shift });
const esc = () => fireEvent.keyDown(document, { key: 'Escape' });
const backdrop = () => document.querySelector('.nk-dialog__backdrop') as HTMLElement;

describe('ConfirmDialog — R1: trava ligada à confirmação e à abertura', () => {
  function Reabrivel({ onConfirm, onCancel = vi.fn() }: { onConfirm: () => Promise<unknown>; onCancel?: (r: DialogCloseReason) => void }) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <div>
          <button onClick={() => setOpen((o) => !o)}>Alternar</button>
        </div>
        <ConfirmDialog open={open} title="Revogar?" confirmLabel="Revogar" onConfirm={onConfirm} onCancel={onCancel} />
      </>
    );
  }
  // o botão "Alternar" fica inert com o diálogo aberto (fora do alcance do usuário): o teste o aciona por programa,
  // como faria a aplicação ao fechar e reabrir o diálogo por conta própria
  const alternar = () => (document.querySelector('div > button') as HTMLButtonElement).click();

  it('promessa antiga (A) concluindo depois de reabrir NÃO libera a confirmação atual (B): 2 chamadas, não 3', async () => {
    const resolvers: Array<() => void> = [];
    const onConfirm = vi.fn(() => new Promise<void>((r) => resolvers.push(r)));
    render(<Reabrivel onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Revogar' })); // A pendente
    act(() => alternar()); // fecha
    act(() => alternar()); // reabre
    fireEvent.click(screen.getByRole('button', { name: 'Revogar' })); // B pendente
    expect(onConfirm).toHaveBeenCalledTimes(2);
    await act(async () => resolvers[0]()); // A termina
    fireEvent.click(screen.getByRole('button', { name: 'Revogar' }));
    expect(onConfirm).toHaveBeenCalledTimes(2);
    await act(async () => resolvers[1]()); // B termina: agora libera
    fireEvent.click(screen.getByRole('button', { name: 'Revogar' }));
    expect(onConfirm).toHaveBeenCalledTimes(3);
  });

  it('promessa pendente conta como envio: Cancelar, Esc, "Fechar" e fundo sem efeito, mesmo sem busy; depois volta', async () => {
    let finish!: () => void;
    const onCancel = vi.fn();
    render(<Reabrivel onConfirm={() => new Promise<void>((r) => (finish = r))} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Revogar' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    const cancelar = within(dialog).getByRole('button', { name: 'Cancelar' });
    expect(cancelar).toBeDisabled();
    fireEvent.click(cancelar);
    esc();
    fireEvent.click(backdrop());
    fireEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    expect(onCancel).not.toHaveBeenCalled();
    await act(async () => finish());
    esc();
    expect(onCancel).toHaveBeenCalledWith('escape');
  });
});

describe('Dialog — R1: só destinos de foco disponíveis', () => {
  it('foco inicial e Tab ignoram controles em região hidden, com display:none e dentro de <fieldset disabled>', () => {
    render(
      <main>
        <Dialog open title="Destinos" onClose={() => undefined} footer={<button>Confirmar</button>}>
          <div hidden>
            <button>Oculto</button>
          </div>
          <button style={{ display: 'none' }}>Sem exibição</button>
          <fieldset disabled>
            <legend>
              <button>Na legenda</button>
            </legend>
            <button>No fieldset</button>
            <input aria-label="Campo bloqueado" />
          </fieldset>
          <input aria-label="Campo livre" />
        </Dialog>
      </main>,
    );
    // a legenda de um fieldset desabilitado continua habilitada (regra do HTML): é o primeiro destino disponível
    const legenda = screen.getByRole('button', { name: 'Na legenda' });
    expect(legenda).toHaveFocus();
    tab();
    expect(screen.getByRole('textbox', { name: 'Campo livre' })).toHaveFocus();
    tab();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toHaveFocus();
    tab();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
    tab();
    expect(legenda).toHaveFocus();
    tab(true);
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
  });

  it('sem nenhum destino disponível: o foco fica no próprio diálogo (inicial e Tab)', () => {
    render(
      <Dialog open title="Vazio" onClose={() => undefined} showCloseButton={false}>
        <fieldset disabled>
          <button>Bloqueado</button>
        </fieldset>
        <div hidden>
          <input aria-label="Oculto" />
        </div>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
    tab();
    expect(dialog).toHaveFocus();
  });

  it('initialFocus indisponível (desabilitado por fieldset) cai no primeiro destino disponível', () => {
    function P() {
      const alvo = useRef<HTMLButtonElement>(null);
      return (
        <Dialog open title="X" onClose={() => undefined} initialFocus={alvo}>
          <fieldset disabled>
            <button ref={alvo}>Alvo bloqueado</button>
          </fieldset>
          <button>Disponível</button>
        </Dialog>
      );
    }
    render(<P />);
    expect(screen.getByRole('button', { name: 'Disponível' })).toHaveFocus();
  });

  it('busy tirando o foco de um controle desabilitado por fieldset: o foco vai ao diálogo', () => {
    function P({ busy }: { busy: boolean }) {
      return (
        <Dialog open busy={busy} title="Enviar" onClose={() => undefined}>
          <fieldset disabled={busy}>
            <input aria-label="Código" />
          </fieldset>
        </Dialog>
      );
    }
    const { rerender } = render(<P busy={false} />);
    expect(screen.getByRole('textbox', { name: 'Código' })).toHaveFocus();
    rerender(<P busy />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('RadioGroup nativo dentro do diálogo: o grupo é UMA parada; entra pelo marcado; sem marcado, pelo primeiro (Tab) ou último (Shift+Tab)', () => {
    const options = [
      { value: 'a', label: 'Perdido' },
      { value: 'b', label: 'Trocado' },
      { value: 'c', label: 'Outro' },
    ];
    function P({ value }: { value: string | null }) {
      return (
        <Dialog open title="Motivo" onClose={() => undefined} showCloseButton={false} footer={<button>Continuar</button>}>
          <input aria-label="Antes" />
          <RadioGroup legend="Motivo" options={options} value={value} onChange={() => undefined} />
        </Dialog>
      );
    }
    const { rerender } = render(<P value="b" />);
    const antes = screen.getByRole('textbox', { name: 'Antes' });
    const continuar = screen.getByRole('button', { name: 'Continuar' });
    expect(antes).toHaveFocus();
    tab();
    expect(screen.getByRole('radio', { name: 'Trocado' })).toHaveFocus();
    tab();
    expect(continuar).toHaveFocus();
    tab(true);
    expect(screen.getByRole('radio', { name: 'Trocado' })).toHaveFocus();
    tab(true);
    expect(antes).toHaveFocus();
    // nenhum marcado
    rerender(<P value={null} />);
    antes.focus();
    tab();
    expect(screen.getByRole('radio', { name: 'Perdido' })).toHaveFocus();
    continuar.focus();
    tab(true);
    expect(screen.getByRole('radio', { name: 'Outro' })).toHaveFocus();
  });
});
