import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FloatingButton, Input, Navbar, SectionHeader, Steps, Textarea } from '../index';

describe('Textarea', () => {
  it('conta caracteres e mostra erro/sucesso', () => {
    const { rerender } = render(<Textarea label="Mensagem" maxLength={10} showCount />);
    const el = screen.getByLabelText('Mensagem');
    fireEvent.change(el, { target: { value: 'Olá' } });
    expect(screen.getByText('3/10')).toBeInTheDocument();
    rerender(<Textarea label="Mensagem" error="Obrigatório" />);
    expect(screen.getByLabelText('Mensagem')).toHaveAttribute('aria-invalid', 'true');
    rerender(<Textarea label="Mensagem" success="Recebido" />);
    expect(screen.getByText('Recebido')).toHaveClass('nk-field__message--success');
  });
});

describe('Input success', () => {
  it('marca o campo como válido', () => {
    render(<Input label="E-mail" success="E-mail válido" />);
    expect(screen.getByText('E-mail válido')).toHaveClass('nk-field__message--success');
  });
});

describe('Navbar', () => {
  it('mostra os controles de tools uma única vez, fora do menu mobile', () => {
    render(<Navbar brand="Nekkora" tools={<button type="button">Tema</button>} actions={<a href="#c">Contato</a>} />);
    expect(screen.getAllByRole('button', { name: 'Tema' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Contato', hidden: true })).toHaveLength(2); // barra + menu mobile (fechado)
    expect(screen.getAllByRole('button', { name: 'Tema', hidden: true })).toHaveLength(1);
  });

  it('marca o link ativo e abre o menu mobile', () => {
    render(<Navbar brand="Nekkora" links={[{ label: 'Studio', href: '#studio' }]} activeHref="#studio" />);
    expect(screen.getAllByRole('link', { name: 'Studio' })[0]).toHaveAttribute('aria-current', 'true');
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('FloatingButton', () => {
  it('abre links externos em nova aba com rótulo acessível', () => {
    render(<FloatingButton href="https://wa.me/5500000000000" icon="whatsapp" label="Fale conosco" tone="whatsapp" />);
    const link = screen.getByRole('link', { name: 'Fale conosco' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('nk-fab--whatsapp');
  });
});

describe('Steps e SectionHeader', () => {
  it('renderiza etapas numeradas e cabeçalho', () => {
    render(
      <>
        <SectionHeader eyebrow="Como funciona" title="Da ideia à operação" />
        <Steps items={[{ title: 'Entendemos' }, { title: 'Estruturamos', icon: 'workflow' }]} />
      </>,
    );
    expect(screen.getByRole('heading', { name: 'Da ideia à operação' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Etapa 02')).toBeInTheDocument();
  });
});

import { Button } from '../index';
describe('Button href', () => {
  it('renderiza link com visual de botão', () => {
    render(<Button href="https://wa.me/55" leftIcon="whatsapp">WhatsApp</Button>);
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveClass('nk-button', 'nk-button--primary');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
