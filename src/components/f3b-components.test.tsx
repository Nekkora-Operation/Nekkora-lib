import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ConfirmDialog, Dialog, RadioGroup, StatusRegion, type DialogCloseReason } from '../index';

// O jsdom não aplica CSS nem calcula visibilidade: aqui ficam a lógica de foco, inert, teclado e as regras de
// fechamento. Aparência e leitura real por leitor de tela ficam no roteiro de navegador da missão.

const tab = (shift = false) => fireEvent.keyDown(document, { key: 'Tab', shiftKey: shift });
const esc = () => fireEvent.keyDown(document, { key: 'Escape' });
const backdrop = () => document.querySelector('.nk-dialog__backdrop') as HTMLElement;

function Page({ busy = false, onClose = vi.fn() }: { busy?: boolean; onClose?: (r: DialogCloseReason) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <main>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <Dialog
        open={open}
        busy={busy}
        title="Suspender conta"
        description="A pessoa perde o acesso imediatamente."
        onClose={(r) => {
          onClose(r);
          setOpen(false);
        }}
        footer={<button>Confirmar</button>}
      >
        <input aria-label="Observação" />
      </Dialog>
    </main>
  );
}

describe('Dialog', () => {
  it('abre em portal no body como diálogo modal rotulado e descrito; o resto da página fica inert; foco no primeiro controle', () => {
    const { container } = render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog', { name: 'Suspender conta' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('A pessoa perde o acesso imediatamente.');
    expect(container).not.toContainElement(dialog);
    expect(container).toHaveAttribute('inert');
    expect(dialog.closest('[inert]')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Observação' })).toHaveFocus();
  });

  it('Tab e Shift+Tab circulam dentro do diálogo', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog');
    const fechar = within(dialog).getByRole('button', { name: 'Fechar' });
    const confirmar = within(dialog).getByRole('button', { name: 'Confirmar' });
    confirmar.focus();
    tab();
    expect(fechar).toHaveFocus();
    tab(true);
    expect(confirmar).toHaveFocus();
  });

  it.each([
    ['escape', esc],
    ['backdrop', () => fireEvent.click(backdrop())],
    ['close-button', () => fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))],
  ] as const)('%s pede fechamento; ao fechar, a página volta a ficar ativa e o foco volta a quem abriu', (reason, act_) => {
    const onClose = vi.fn();
    const { container } = render(<Page onClose={onClose} />);
    const abrir = screen.getByRole('button', { name: 'Abrir' });
    // ativação por teclado: o botão tem o foco ao abrir (clique no jsdom/Safari não foca o botão: ver teste do <main>)
    abrir.focus();
    fireEvent.click(abrir);
    act_();
    expect(onClose).toHaveBeenCalledWith(reason);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container).not.toHaveAttribute('inert');
    expect(abrir).toHaveFocus();
  });

  it('busy: Esc, fundo e "Fechar" ficam sem efeito (a mesma regra para todos), com aria-busy e "Fechar" desabilitado', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Page onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    rerender(<Page onClose={onClose} busy />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    esc();
    fireEvent.click(backdrop());
    const fechar = within(dialog).getByRole('button', { name: 'Fechar' });
    expect(fechar).toBeDisabled();
    fireEvent.click(fechar);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // terminou o envio: volta a fechar normalmente
    rerender(<Page onClose={onClose} />);
    esc();
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  it('busy com o foco num controle que ficou desabilitado: o foco vai para o próprio diálogo (não para o body)', () => {
    function P({ busy }: { busy: boolean }) {
      return (
        <Dialog open busy={busy} title="Enviar" onClose={() => undefined} footer={<button disabled={busy}>Enviar</button>} />
      );
    }
    const { rerender } = render(<P busy={false} />);
    const enviar = screen.getByRole('button', { name: 'Enviar' });
    enviar.focus();
    rerender(<P busy />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('o botão que abriu sumiu depois da ação: o foco vai para o <main> (focável só por programa), nunca para o body', () => {
    function Row() {
      const [open, setOpen] = useState(false);
      const [done, setDone] = useState(false);
      return (
        <main>
          {done ? <button key="r">Reativar</button> : <button key="s" onClick={() => setOpen(true)}>Suspender</button>}
          <Dialog
            open={open}
            title="Suspender"
            onClose={() => setOpen(false)}
            footer={
              <button
                onClick={() => {
                  setDone(true);
                  setOpen(false);
                }}
              >
                Confirmar
              </button>
            }
          />
        </main>
      );
    }
    render(<Row />);
    fireEvent.click(screen.getByRole('button', { name: 'Suspender' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(screen.queryByRole('button', { name: 'Suspender' })).toBeNull();
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).not.toBe(document.body);
  });

  it('returnFocus (função) e fallbackFocus têm prioridade, na ordem declarada', () => {
    function P({ useReturn }: { useReturn: boolean }) {
      const [open, setOpen] = useState(false);
      const heading = useRef<HTMLHeadingElement>(null);
      const alvo = useRef<HTMLButtonElement>(null);
      return (
        <main>
          <h1 ref={heading} tabIndex={-1}>
            Membros
          </h1>
          <button ref={alvo}>Linha atualizada</button>
          <button onClick={() => setOpen(true)}>Abrir</button>
          <Dialog
            open={open}
            title="T"
            onClose={() => setOpen(false)}
            returnFocus={useReturn ? () => alvo.current : () => null}
            fallbackFocus={heading}
          />
        </main>
      );
    }
    const { unmount } = render(<P useReturn />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    esc();
    expect(screen.getByRole('button', { name: 'Linha atualizada' })).toHaveFocus();
    unmount();
    render(<P useReturn={false} />);
    // quem abriu tem o foco: sem a regra, o foco voltaria para ele
    screen.getByRole('button', { name: 'Abrir' }).focus();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    esc();
    // returnFocus declarado mas sem destino: NÃO volta a quem abriu; vai ao fallback
    expect(screen.getByRole('heading', { name: 'Membros' })).toHaveFocus();
  });

  it('diálogos empilhados: Esc fecha só o de cima; o de baixo volta a ficar ativo', () => {
    function P() {
      const [a, setA] = useState(true);
      const [b, setB] = useState(false);
      return (
        <main>
          <Dialog open={a} title="Primeiro" onClose={() => setA(false)} footer={<button onClick={() => setB(true)}>Detalhes</button>} />
          <Dialog open={b} title="Segundo" onClose={() => setB(false)} />
        </main>
      );
    }
    render(<P />);
    screen.getByRole('button', { name: 'Detalhes' }).focus();
    fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));
    const primeiro = screen.getByRole('dialog', { name: 'Primeiro' });
    expect(primeiro.closest('[inert]')).not.toBeNull();
    esc();
    expect(screen.queryByRole('dialog', { name: 'Segundo' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Primeiro' }).closest('[inert]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Detalhes' })).toHaveFocus();
  });

  it('quem abriu não tinha o foco (clique sem foco, como no Safari): ao fechar, o foco vai ao <main>', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    esc();
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('desmontar com o diálogo aberto (ex.: troca de rota) desfaz o inert e não deixa o portal para trás', () => {
    const { container, unmount } = render(<Dialog open title="X" onClose={() => undefined} />);
    expect(document.querySelector('.nk-dialog-root')).not.toBeNull();
    const host = container;
    unmount();
    expect(document.querySelector('.nk-dialog-root')).toBeNull();
    expect(host).not.toHaveAttribute('inert');
  });

  it('elemento que já era inert antes de abrir continua inert depois de fechar', () => {
    const outside = document.createElement('div');
    outside.setAttribute('inert', '');
    document.body.appendChild(outside);
    const { rerender } = render(<Dialog open title="X" onClose={() => undefined} />);
    rerender(<Dialog open={false} title="X" onClose={() => undefined} />);
    expect(outside).toHaveAttribute('inert');
    outside.remove();
  });
});

describe('ConfirmDialog', () => {
  function Confirm({
    busy = false,
    onConfirm = vi.fn(),
    onCancel = vi.fn(),
    error,
    confirmDisabled,
  }: {
    busy?: boolean;
    onConfirm?: () => void | Promise<unknown>;
    onCancel?: (r: DialogCloseReason) => void;
    error?: string;
    confirmDisabled?: boolean;
  }) {
    return (
      <main>
        <ConfirmDialog
          open
          title="Suspender Carla?"
          confirmLabel="Suspender"
          tone="danger"
          busy={busy}
          error={error}
          confirmDisabled={confirmDisabled}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          <p>
            As sessões dela serão encerradas. <a href="#politica">Política de acesso</a>
          </p>
        </ConfirmDialog>
      </main>
    );
  }

  it('alertdialog com o foco inicial em Cancelar (a opção menos destrutiva), mesmo com um link no conteúdo; Cancelar pede cancelamento', () => {
    const onCancel = vi.fn();
    render(<Confirm onCancel={onCancel} />);
    const dialog = screen.getByRole('alertdialog', { name: 'Suspender Carla?' });
    expect(within(dialog).getByText('As sessões dela serão encerradas.')).toBeInTheDocument();
    const cancelar = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelar).toHaveFocus();
    fireEvent.click(cancelar);
    expect(onCancel).toHaveBeenCalledWith('cancel');
  });

  it('clique duplicado: uma única confirmação enquanto a promessa não termina; depois libera', async () => {
    let finish!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (finish = r)));
    render(<Confirm onConfirm={onConfirm} />);
    const btn = screen.getByRole('button', { name: 'Suspender' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.keyDown(btn, { key: 'Enter' });
    fireEvent.click(btn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await act(async () => finish());
    fireEvent.click(btn);
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });

  it('clique duplicado sem promessa: trava até busy terminar', () => {
    const onConfirm = vi.fn();
    const { rerender } = render(<Confirm onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Suspender' }));
    fireEvent.click(screen.getByRole('button', { name: 'Suspender' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    rerender(<Confirm onConfirm={onConfirm} busy />);
    rerender(<Confirm onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Suspender' }));
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });

  it('busy: Cancelar, Esc, "Fechar" e fundo sem efeito; Confirmar em carregamento', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<Confirm busy onCancel={onCancel} onConfirm={onConfirm} />);
    const cancelar = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelar).toBeDisabled();
    fireEvent.click(cancelar);
    esc();
    fireEvent.click(backdrop());
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onCancel).not.toHaveBeenCalled();
    const confirmar = screen.getByRole('button', { name: 'Suspender' });
    expect(confirmar).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(confirmar);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirmDisabled impede confirmar; erro aparece como alerta dentro do diálogo', () => {
    const onConfirm = vi.fn();
    render(<Confirm onConfirm={onConfirm} confirmDisabled error="Não foi possível confirmar o resultado." />);
    fireEvent.click(screen.getByRole('button', { name: 'Suspender' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(within(screen.getByRole('alertdialog')).getByRole('alert')).toHaveTextContent('Não foi possível confirmar o resultado.');
  });
});

describe('RadioGroup', () => {
  const options = [
    { value: 'DISPOSITIVO_PERDIDO', label: 'Dispositivo perdido' },
    { value: 'DISPOSITIVO_TROCADO', label: 'Dispositivo trocado', description: 'A pessoa trocou de celular.' },
    { value: 'OUTRO', label: 'Outro', disabled: true },
  ];

  it('grupo rotulado pela legenda; rádios nativos com o mesmo nome; controlado', () => {
    const onChange = vi.fn();
    const { rerender } = render(<RadioGroup legend="Motivo" options={options} value={null} onChange={onChange} required />);
    const group = screen.getByRole('group', { name: /Motivo/ });
    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(new Set(radios.map((r) => r.getAttribute('name'))).size).toBe(1);
    expect(radios.every((r) => !(r as HTMLInputElement).checked)).toBe(true);
    expect(radios[0]).toBeRequired();
    fireEvent.click(screen.getByLabelText('Dispositivo trocado'));
    expect(onChange).toHaveBeenCalledWith('DISPOSITIVO_TROCADO');
    rerender(<RadioGroup legend="Motivo" options={options} value="DISPOSITIVO_TROCADO" onChange={onChange} required />);
    expect(screen.getByRole('radio', { name: 'Dispositivo trocado' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Dispositivo trocado' })).toHaveAccessibleDescription('A pessoa trocou de celular.');
    expect(screen.getByRole('radio', { name: 'Outro' })).toBeDisabled();
  });

  it('erro: aria-invalid nas opções e mensagem associada ao grupo; disabled no grupo desabilita todas', () => {
    const { rerender } = render(<RadioGroup legend="Motivo" options={options} error="Escolha um motivo." />);
    const group = screen.getByRole('group', { name: 'Motivo' });
    expect(group).toHaveAccessibleDescription('Escolha um motivo.');
    expect(screen.getByRole('radio', { name: 'Dispositivo perdido' })).toHaveAttribute('aria-invalid', 'true');
    rerender(<RadioGroup legend="Motivo" options={options} disabled />);
    for (const r of screen.getAllByRole('radio')) expect(r).toBeDisabled();
  });
});

describe('StatusRegion', () => {
  it('região role=status persistente: existe vazia e é a mesma ao receber a mensagem', () => {
    const { rerender } = render(<StatusRegion message={null} />);
    const region = screen.getByRole('status');
    expect(region).toBeEmptyDOMElement();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    rerender(<StatusRegion message="Conta suspensa." />);
    expect(screen.getByRole('status')).toBe(region);
    expect(region).toHaveTextContent('Conta suspensa.');
    // o Alert interno não cria uma segunda região viva
    expect(within(region).queryByRole('status')).toBeNull();
    expect(within(region).queryByRole('alert')).toBeNull();
  });

  it('announceKey recria o conteúdo para repetir uma mensagem igual; visuallyHidden só anuncia', () => {
    const { rerender } = render(<StatusRegion message="Concessão revogada." announceKey={1} />);
    const before = screen.getByRole('status').firstElementChild;
    rerender(<StatusRegion message="Concessão revogada." announceKey={2} />);
    expect(screen.getByRole('status').firstElementChild).not.toBe(before);
    rerender(<StatusRegion message="Concessão revogada." visuallyHidden />);
    expect(screen.getByRole('status')).toHaveClass('nk-visually-hidden');
    expect(screen.getByRole('status')).toHaveTextContent('Concessão revogada.');
  });
});
