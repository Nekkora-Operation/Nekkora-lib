import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Avatar, getInitials, UserMenu, iconNames } from '../index';

describe('Avatar', () => {
  it('getInitials: primeira letra do primeiro e do último nome, em maiúsculas', () => {
    expect(getInitials('Ana Paula Souza')).toBe('AS');
    expect(getInitials('  ana  ')).toBe('A');
    expect(getInitials('érica álvares')).toBe('ÉÁ');
    expect(getInitials('')).toBe('');
  });

  it('sem foto: mostra as iniciais e é uma imagem com o nome', () => {
    render(<Avatar name="Ana Souza" />);
    const avatar = screen.getByRole('img', { name: 'Ana Souza' });
    expect(avatar).toHaveTextContent('AS');
    expect(avatar.querySelector('img')).toBeNull();
  });

  it('iniciais informadas valem no lugar das calculadas', () => {
    render(<Avatar name="Ana Souza" initials="AN" />);
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toHaveTextContent('AN');
  });

  it('com foto: mostra a foto; se ela falhar, volta às iniciais; trocar a foto tenta de novo', () => {
    const { rerender } = render(<Avatar name="Ana Souza" src="/ana.jpg" size="lg" />);
    const avatar = screen.getByRole('img', { name: 'Ana Souza' });
    expect(avatar).toHaveClass('nk-avatar--lg');
    expect(avatar.querySelector('img')).toHaveAttribute('src', '/ana.jpg');
    expect(avatar).not.toHaveTextContent('AS');
    fireEvent.error(avatar.querySelector('img')!);
    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar).toHaveTextContent('AS');
    rerender(<Avatar name="Ana Souza" src="/ana-2.jpg" size="lg" />);
    expect(avatar.querySelector('img')).toHaveAttribute('src', '/ana-2.jpg');
  });

  it('aria-hidden: deixa de ser imagem (para uso dentro de um botão já rotulado)', () => {
    const { container } = render(<Avatar name="Ana Souza" aria-hidden />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('UserMenu', () => {
  const setup = (props: Partial<Parameters<typeof UserMenu>[0]> = {}) => {
    const onSignOut = vi.fn();
    const onOpenChange = vi.fn();
    const utils = render(
      <div>
        <UserMenu name="Ana Souza" accountLevel="Administrador" onSignOut={onSignOut} onOpenChange={onOpenChange} {...props} />
        <button>fora</button>
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'Menu da conta: Ana Souza' });
    return { ...utils, trigger, onSignOut, onOpenChange };
  };

  it('fechado: só o círculo com as iniciais, sem painel', () => {
    const { trigger } = setup();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).toHaveTextContent('AS');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('com foto: o círculo mostra a foto', () => {
    const { trigger } = setup({ avatarSrc: '/ana.jpg' });
    expect(trigger.querySelector('img')).toHaveAttribute('src', '/ana.jpg');
  });

  it('clicar abre o painel com o nome, o nível da conta e o botão de sair; clicar de novo fecha', () => {
    const { trigger, onOpenChange } = setup();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByRole('dialog', { name: 'Menu da conta' });
    expect(panel.id).toBe(trigger.getAttribute('aria-controls'));
    expect(within(panel).getByText('Ana Souza')).toBeInTheDocument();
    expect(within(panel).getByText('Nível da conta')).toBeInTheDocument();
    expect(within(panel).getByText('Administrador')).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Sair' })).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('sair: chama onSignOut, fecha o painel e devolve o foco ao círculo', () => {
    const { trigger, onSignOut } = setup({ defaultOpen: true });
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('sem onSignOut não há botão de sair; sem nível não há a linha do nível; children entram no painel', () => {
    render(<UserMenu name="Ana Souza" defaultOpen><a href="/conta">Minha conta</a></UserMenu>);
    const panel = screen.getByRole('dialog');
    expect(within(panel).queryByRole('button', { name: 'Sair' })).toBeNull();
    expect(within(panel).queryByText('Nível da conta')).toBeNull();
    expect(within(panel).getByRole('link', { name: 'Minha conta' })).toBeInTheDocument();
  });

  it('Esc fecha e devolve o foco ao círculo', () => {
    const { trigger } = setup({ defaultOpen: true });
    screen.getByRole('button', { name: 'Sair' }).focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('clicar fora fecha; clicar dentro do painel não', () => {
    setup({ defaultOpen: true });
    fireEvent.mouseDown(screen.getByText('Nível da conta'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'fora' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('foco saindo do componente fecha', () => {
    setup({ defaultOpen: true });
    const sair = screen.getByRole('button', { name: 'Sair' });
    sair.focus();
    fireEvent.blur(sair, { relatedTarget: screen.getByRole('button', { name: 'fora' }) });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('rótulos configuráveis', () => {
    render(<UserMenu name="Ana" label="Conta" accountLevel="Convidado" accountLevelLabel="Perfil" signOutLabel="Encerrar sessão" onSignOut={() => {}} defaultOpen />);
    expect(screen.getByRole('button', { name: 'Conta: Ana' })).toBeInTheDocument();
    const panel = screen.getByRole('dialog', { name: 'Conta' });
    expect(within(panel).getByText('Perfil')).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Encerrar sessão' })).toBeInTheDocument();
  });
});

describe('ícones novos', () => {
  it('help e logout fazem parte do conjunto', () => {
    expect(iconNames).toEqual(expect.arrayContaining(['help', 'logout']));
  });
});
