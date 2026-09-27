import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Alert, AuthContextBadge, AuthLayout, Checkbox, CodeInput, Divider, Input, QrCode, Spinner, StateView } from '../index';

describe('Input (senha)', () => {
  it('mostra/oculta sem alterar o valor e sem tirar o foco do campo', () => {
    render(<Input label="Senha" type="password" defaultValue="segredo-123" />);
    const field = screen.getByLabelText('Senha') as HTMLInputElement;
    field.focus();
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('aria-controls', field.id);
    const mouseDown = fireEvent.mouseDown(toggle);
    expect(mouseDown).toBe(false); // preventDefault: o foco não sai do campo
    fireEvent.click(toggle);
    expect(field.type).toBe('text');
    expect(field.value).toBe('segredo-123');
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('associa e anuncia a mensagem de erro', () => {
    render(<Input label="E-mail" error="Informe um e-mail válido." />);
    const field = screen.getByLabelText('E-mail');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    const message = document.getElementById(field.getAttribute('aria-describedby')!)!;
    expect(message).toHaveTextContent('Erro: Informe um e-mail válido.');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Checkbox', () => {
  it('tem rótulo real e alterna', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Guardei meus códigos" onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Guardei meus códigos' });
    fireEvent.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Alert', () => {
  it('erro usa role=alert; demais role=status; ícone + texto', () => {
    const { rerender } = render(<Alert tone="danger" title="Falhou">Tente de novo.</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('FalhouTente de novo.');
    rerender(<Alert tone="info">Aviso</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Aviso');
  });
});

describe('CodeInput', () => {
  it('saneia, limita o tamanho e avisa quando completa', () => {
    const onComplete = vi.fn();
    const onValue = vi.fn();
    render(<CodeInput label="Código" length={6} onValueChange={onValue} onComplete={onComplete} />);
    const input = screen.getByLabelText('Código') as HTMLInputElement;
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    fireEvent.change(input, { target: { value: '12 34-56789' } });
    expect(input.value).toBe('123456');
    expect(onValue).toHaveBeenLastCalledWith('123456');
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('modo alfanumérico em maiúsculas', () => {
    render(<CodeInput label="Código" length={4} mode="alphanumeric" />);
    const input = screen.getByLabelText('Código') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'ab-c1' } });
    expect(input.value).toBe('ABC1');
  });
});

describe('QrCode', () => {
  it('desenha localmente um SVG com nome acessível', () => {
    render(<QrCode value="otpauth://totp/Nekkora:ana?secret=JBSWY3DPEHPK3PXP&issuer=Nekkora" label="QR Code do autenticador" />);
    const img = screen.getByRole('img', { name: 'QR Code do autenticador' });
    expect(img.tagName.toLowerCase()).toBe('svg');
    expect(img.querySelector('path')!.getAttribute('d')!.length).toBeGreaterThan(100);
  });
});

describe('StateView, Spinner e Divider', () => {
  it('estado de erro é alerta; carregando anuncia status', () => {
    const { rerender } = render(<StateView status="error" title="Link inválido" description="Peça outro." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Link inválido');
    rerender(<StateView status="loading" title="Validando link…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Validando link…');
  });

  it('spinner silencioso não anuncia', () => {
    const { container } = render(<Spinner label="" />);
    expect(container.querySelector('[role="status"]')).toBeNull();
    render(<Divider label="ou" />);
    expect(screen.getByRole('separator')).toHaveTextContent('ou');
  });
});

describe('AuthLayout', () => {
  it('card rotulado pelo título, contexto e foco no título', () => {
    render(
      <AuthLayout
        title="Bem-vinda de volta"
        description="Acesse sua conta para continuar."
        context={<AuthContextBadge label="Acessando" value="Nekkora Demo" />}
        focusTitle
        footer="rodapé"
      >
        <p>conteúdo</p>
      </AuthLayout>,
    );
    const heading = screen.getByRole('heading', { level: 1, name: 'Bem-vinda de volta' });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByRole('region', { name: 'Bem-vinda de volta' })).toHaveAccessibleDescription('Acesse sua conta para continuar.');
    expect(screen.getByText('Nekkora Demo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
