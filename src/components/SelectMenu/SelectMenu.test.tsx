import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectMenu } from './SelectMenu';

const options = [
  { value: 'agt-01', label: 'AGT-01', description: 'Windows Server 2022' },
  { value: 'agt-02', label: 'AGT-02', disabled: true },
  { value: 'agt-03', label: 'AGT-03' },
];

describe('SelectMenu', () => {
  it('abre com clique, seleciona e fecha', () => {
    const onChange = vi.fn();
    render(<SelectMenu label="Agente" options={options} onChange={onChange} />);
    const combo = screen.getByRole('combobox', { name: 'Agente' });
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(combo);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: /AGT-03/ }));
    expect(onChange).toHaveBeenCalledWith('agt-03', expect.objectContaining({ label: 'AGT-03' }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(combo).toHaveTextContent('AGT-03');
  });

  it('navega pelo teclado pulando opções desabilitadas', () => {
    const onChange = vi.fn();
    render(<SelectMenu aria-label="Agente" options={options} onChange={onChange} />);
    const combo = screen.getByRole('combobox');
    fireEvent.keyDown(combo, { key: 'ArrowDown' });
    fireEvent.keyDown(combo, { key: 'ArrowDown' });
    fireEvent.keyDown(combo, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('agt-03', expect.anything());
  });

  it('fecha com Escape', () => {
    render(<SelectMenu aria-label="Agente" options={options} />);
    const combo = screen.getByRole('combobox');
    fireEvent.click(combo);
    fireEvent.keyDown(combo, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('filtra com a busca', () => {
    render(<SelectMenu aria-label="Agente" options={options} searchable />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: '03' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'xyz' } });
    expect(screen.getByText('Nenhuma opção encontrada.')).toBeInTheDocument();
  });

  it('seleção múltipla com chips e remoção', () => {
    const onChange = vi.fn();
    render(
      <SelectMenu multiple aria-label="Agentes" options={options} defaultValue={['agt-01']} onChange={onChange} name="agentes" />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: /AGT-03/ }));
    expect(onChange).toHaveBeenLastCalledWith(['agt-01', 'agt-03'], expect.any(Array));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remover AGT-01' }));
    expect(onChange).toHaveBeenLastCalledWith(['agt-03'], expect.any(Array));
    expect(document.querySelectorAll('input[type="hidden"][name="agentes"]')).toHaveLength(1);
  });
});
