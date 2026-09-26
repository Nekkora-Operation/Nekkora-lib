import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Badge, Button, Fieldset, Icon, IconBox, Input, Logo, Select, Table } from '../index';

describe('Input', () => {
  it('aplica máscara de CPF e informa o valor bruto', () => {
    const onValueChange = vi.fn();
    render(<Input label="CPF" mask="cpf" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('CPF') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345678909' } });
    expect(input.value).toBe('123.456.789-09');
    expect(onValueChange).toHaveBeenLastCalledWith('123.456.789-09', '12345678909');
    expect(input.maxLength).toBe(14);
  });

  it('troca a máscara de telefone fixo para celular', () => {
    render(<Input label="Tel" mask="phone" />);
    const input = screen.getByLabelText('Tel') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1133334444' } });
    expect(input.value).toBe('(11) 3333-4444');
    fireEvent.change(input, { target: { value: '11987654321' } });
    expect(input.value).toBe('(11) 98765-4321');
  });

  it('formata valor controlado e exibe erro acessível', () => {
    render(<Input label="CNPJ" mask="cnpj" value="11222333000181" onChange={() => {}} error="Inválido" />);
    const input = screen.getByLabelText('CNPJ') as HTMLInputElement;
    expect(input.value).toBe('11.222.333/0001-81');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Inválido').id).toBe(input.getAttribute('aria-describedby'));
  });

  it('alterna visibilidade da senha', () => {
    render(<Input label="Senha" type="password" />);
    const input = screen.getByLabelText('Senha');
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(input).toHaveAttribute('type', 'text');
  });
});

describe('Button', () => {
  it('desabilita durante loading', () => {
    render(<Button loading>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });
});

describe('Select', () => {
  it('renderiza options e placeholder', () => {
    render(<Select label="Agente" placeholder="Selecione" options={[{ value: 'a', label: 'AGT-01' }]} />);
    const select = screen.getByLabelText('Agente') as HTMLSelectElement;
    expect(select.value).toBe('');
    expect(screen.getByRole('option', { name: 'AGT-01' })).toBeInTheDocument();
  });
});

describe('Fieldset', () => {
  it('usa a legend como nome acessível', () => {
    render(
      <Fieldset legend="Empresa" description="Dados">
        <Input label="Nome" />
      </Fieldset>,
    );
    expect(screen.getByRole('group', { name: 'Empresa' })).toBeInTheDocument();
  });
});

describe('Table', () => {
  it('renderiza linhas e estado vazio', () => {
    const cols = [{ key: 'nome', header: 'Nome' }];
    const { rerender } = render(<Table columns={cols} data={[{ nome: 'Download de Faturas' }]} />);
    expect(screen.getByText('Download de Faturas')).toBeInTheDocument();
    rerender(<Table columns={cols} data={[]} emptyMessage="Vazio" />);
    expect(screen.getByText('Vazio')).toBeInTheDocument();
  });
});

describe('Icon', () => {
  it('usa duotone por padrão e aceita outline', () => {
    const { container, rerender } = render(<Icon name="home" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('nk-icon--duotone');
    expect(svg.querySelector('.nk-icon__duo')).not.toBeNull();
    rerender(<Icon name="home" variant="outline" secondaryColor="red" />);
    expect(container.querySelector('svg')).toHaveClass('nk-icon--outline');
  });
});

describe('IconBox', () => {
  it('renderiza tag preenchida decorativa ou com rótulo', () => {
    const { container, rerender } = render(<IconBox icon="chart" tone="success" />);
    const box = container.firstElementChild!;
    expect(box).toHaveClass('nk-iconbox--solid', 'nk-iconbox--success', 'nk-iconbox--md');
    expect(box).toHaveAttribute('aria-hidden', 'true');
    rerender(<IconBox icon="chart" label="Relatórios" variant="soft" />);
    expect(screen.getByRole('img', { name: 'Relatórios' })).toHaveClass('nk-iconbox--soft');
  });
});

describe('Badge', () => {
  it('aplica a variante solid', () => {
    render(<Badge variant="solid" tone="primary">Financeiro</Badge>);
    expect(screen.getByText('Financeiro')).toHaveClass('nk-badge--solid', 'nk-badge--primary');
  });
});

describe('Logo', () => {
  it('renderiza variantes com nome acessível', () => {
    const { container, rerender } = render(<Logo tagline />);
    expect(screen.getByRole('img', { name: 'Nekkora' })).toHaveClass('nk-logo--full', 'nk-logo--brand');
    expect(container.querySelectorAll('svg')).toHaveLength(2);
    expect(screen.getByText('AUTOMATE · OBSERVE · EVOLVE')).toBeInTheDocument();
    rerender(<Logo variant="symbol" tone="mono" title="Início" />);
    expect(screen.getByRole('img', { name: 'Início' })).toHaveClass('nk-logo--symbol', 'nk-logo--mono');
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    rerender(<Logo variant="app" size={48} />);
    expect(container.querySelector('.nk-logo__app')).not.toBeNull();
  });
});
