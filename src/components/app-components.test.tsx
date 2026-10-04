import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { AppShell, DescriptionList, LoadMore, type AppNavGroup } from '../index';

const nav: AppNavGroup[] = [
  {
    id: 'produto',
    label: 'Produto',
    items: [
      { id: 'exec', label: 'Execuções', href: '/execucoes', icon: 'executions', active: true },
      { id: 'ws', label: 'Workspaces', href: '/workspaces', icon: 'workspace', badge: '9' },
    ],
  },
  { id: 'conta', items: [{ id: 'perfil', label: 'Minha conta', href: '/conta', icon: 'user' }] },
];

describe('AppShell', () => {
  it('navegação com rótulo dentro do menu lateral (região complementar rotulada), grupos, item ativo com aria-current e conteúdo principal', () => {
    render(
      <AppShell brand="Nekkora" nav={nav} header={<h1>Execuções</h1>} actions={<button>Sair</button>} sidebarFooter="Organização X">
        <p>conteúdo</p>
      </AppShell>,
    );
    const navEl = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(screen.getByRole('complementary', { name: 'Menu' })).toContainElement(navEl);
    expect(within(navEl).getByText('Produto')).toBeInTheDocument();
    const active = within(navEl).getByRole('link', { name: 'Execuções' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(active).toHaveAttribute('href', '/execucoes');
    expect(within(navEl).getByRole('link', { name: 'Workspaces 9' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('main')).toHaveTextContent('conteúdo');
    expect(screen.getByRole('heading', { name: 'Execuções' })).toBeInTheDocument();
    expect(screen.getByText('Organização X')).toBeInTheDocument();
  });

  it('link para pular ao conteúdo aponta para o <main>', () => {
    render(<AppShell nav={nav} mainId="conteudo"><p>x</p></AppShell>);
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveAttribute('href', '#conteudo');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo');
  });

  // Painel móvel. O jsdom não aplica o CSS: os testes de comportamento de navegador (largura real, transição,
  // visibilidade) estão no roteiro de navegador da missão; aqui fica a lógica de foco, inert e teclado.
  const openMenu = () => {
    const utils = render(<AppShell brand="Nekkora" nav={nav}><p>conteúdo</p></AppShell>);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    fireEvent.click(toggle);
    const shell = utils.container.firstElementChild as HTMLElement;
    const body = shell.querySelector('.nk-shell__body') as HTMLElement;
    return { ...utils, toggle, shell, body };
  };

  it('abrir: painel vira diálogo modal, conteúdo e topo ficam inert e o foco entra no painel', () => {
    const { toggle, shell, body } = openMenu();
    expect(shell).toHaveClass('nk-shell--open');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.id).toBe(toggle.getAttribute('aria-controls'));
    expect(body).toHaveAttribute('inert');
    expect(shell.querySelector('.nk-shell__skip')).toHaveAttribute('inert');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Nekkora' }));
  });

  it('Tab e Shift+Tab circulam dentro do painel', () => {
    openMenu();
    const dialog = screen.getByRole('dialog');
    const items = [...dialog.querySelectorAll<HTMLElement>('a[href], button')];
    const [first, last] = [items[0], items[items.length - 1]];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    // foco fora do painel (ex.: perdido): Tab o traz de volta ao começo
    (document.body as HTMLElement).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  it('Esc, botão "Fechar menu" do painel e fundo: fecham, tiram o inert e devolvem o foco ao botão "Abrir menu"', () => {
    for (const how of ['esc', 'botao', 'fundo'] as const) {
      const { toggle, shell, body, unmount } = openMenu();
      if (how === 'esc') fireEvent.keyDown(document, { key: 'Escape' });
      if (how === 'botao') fireEvent.click(screen.getByRole('button', { name: 'Fechar menu' }));
      if (how === 'fundo') fireEvent.click(shell.querySelector('.nk-shell__scrim')!);
      expect(shell, how).not.toHaveClass('nk-shell--open');
      expect(body, how).not.toHaveAttribute('inert');
      expect(screen.queryByRole('dialog'), how).toBeNull();
      expect(document.activeElement, how).toBe(toggle);
      unmount();
    }
  });

  it('escolher um item no painel: fecha e leva o foco ao conteúdo principal (o link some)', () => {
    const { shell } = openMenu();
    fireEvent.click(screen.getByRole('link', { name: 'Workspaces 9' }));
    expect(shell).not.toHaveClass('nk-shell--open');
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('no desktop (painel fechado), clicar num item não move o foco', () => {
    render(<AppShell nav={nav}><p>x</p></AppShell>);
    const link = screen.getByRole('link', { name: 'Workspaces 9' });
    link.focus();
    fireEvent.click(link);
    expect(document.activeElement).toBe(link);
  });

  it('largura passa a desktop com o painel aberto: fecha e tira o inert; foco fica no elemento visível ou vai ao item ativo', () => {
    const listeners = new Set<() => void>();
    const mql = { matches: true, addEventListener: (_: string, f: () => void) => listeners.add(f), removeEventListener: (_: string, f: () => void) => listeners.delete(f) };
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => (q === '(max-width: 900px)' ? mql : original?.(q))) as never;
    // o jsdom não calcula layout: "visível" = getClientRects não vazio
    const visible = (el: HTMLElement) => Object.defineProperty(el, 'getClientRects', { value: () => [{}] });
    try {
      // 1) foco num item que continua visível no desktop: fica nele
      let r = openMenu();
      const item = screen.getByRole('link', { name: 'Workspaces 9' });
      visible(item);
      item.focus();
      mql.matches = false;
      act(() => listeners.forEach((f) => f()));
      expect(r.shell).not.toHaveClass('nk-shell--open');
      expect(r.body).not.toHaveAttribute('inert');
      expect(document.activeElement).toBe(item);
      expect(listeners.size).toBe(0); // ouvinte removido ao fechar
      r.unmount();

      // 2) foco em "Fechar menu" (some no desktop): vai ao item ativo do menu
      mql.matches = true;
      r = openMenu();
      screen.getByRole('button', { name: 'Fechar menu' }).focus();
      mql.matches = false;
      act(() => listeners.forEach((f) => f()));
      expect(r.shell).not.toHaveClass('nk-shell--open');
      expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Execuções' }));
    } finally {
      window.matchMedia = original;
    }
  });

  it('linkAs: usa o componente de roteamento com `to`', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(function RouterLink(
      { to, ...rest },
      ref,
    ) {
      return <a ref={ref} data-router-to={to} href={`#router${to}`} {...rest} />;
    });
    render(<AppShell nav={nav} linkAs={RouterLink} brand="Nekkora" brandHref="/inicio"><p>x</p></AppShell>);
    expect(screen.getByRole('link', { name: 'Execuções' })).toHaveAttribute('data-router-to', '/execucoes');
    expect(screen.getByRole('link', { name: 'Nekkora' })).toHaveAttribute('data-router-to', '/inicio');
  });
});

describe('LoadMore', () => {
  it('com próxima página: botão "Carregar mais" e contagem sem total', () => {
    const onLoadMore = vi.fn();
    render(<LoadMore hasMore onLoadMore={onLoadMore} count={25} itemLabel="execuções" />);
    fireEvent.click(screen.getByRole('button', { name: 'Carregar mais' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 25 execuções');
    expect(screen.getByRole('status')).not.toHaveTextContent(/ de \d/);
  });

  it('carregando: botão desabilitado com "Carregando…"', () => {
    render(<LoadMore hasMore loading onLoadMore={() => {}} count={25} />);
    expect(screen.getByRole('button', { name: /Carregando/ })).toBeDisabled();
  });

  it('fim da lista: sem botão, com texto de fim e "lista completa" anunciado', () => {
    render(<LoadMore hasMore={false} onLoadMore={() => {}} count={40} itemLabel="execuções" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Fim da lista')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 40 execuções · lista completa');
  });

  it('lista vazia: nada além da área de status (o vazio é da tela)', () => {
    render(<LoadMore hasMore={false} onLoadMore={() => {}} count={0} />);
    expect(screen.queryByText('Fim da lista')).toBeNull();
  });

  it('indisponível: mostra o motivo, sem botão, e mantém a contagem', () => {
    const onLoadMore = vi.fn();
    render(<LoadMore hasMore onLoadMore={onLoadMore} count={25} unavailable="Sem conexão. A lista exibida continua válida." />);
    expect(screen.getByText('Sem conexão. A lista exibida continua válida.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Exibindo 25 itens');
  });

  it('ocupado: um clique durante o carregamento não aciona de novo', () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<LoadMore hasMore onLoadMore={onLoadMore} count={25} />);
    fireEvent.click(screen.getByRole('button', { name: 'Carregar mais' }));
    rerender(<LoadMore hasMore loading onLoadMore={onLoadMore} count={25} />);
    fireEvent.click(screen.getByRole('button', { name: /Carregando/ }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('erro: mantém a contagem e oferece "Tentar novamente"', () => {
    const onLoadMore = vi.fn();
    render(<LoadMore hasMore onLoadMore={onLoadMore} count={25} error="Não foi possível carregar mais." />);
    expect(screen.getByText('Não foi possível carregar mais.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('continuação inválida (cursor recusado): aviso e "Recomeçar a lista", sem "Carregar mais"', () => {
    const onRestart = vi.fn();
    const onLoadMore = vi.fn();
    render(<LoadMore hasMore={false} onLoadMore={onLoadMore} count={50} stale="A lista mudou desde a última página." onRestart={onRestart} />);
    expect(screen.queryByRole('button', { name: 'Carregar mais' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Recomeçar a lista' }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(onLoadMore).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).not.toHaveTextContent('lista completa');
  });
});

describe('DescriptionList', () => {
  it('<dl> com pares termo–valor; vazio vira "—" acessível como "não informado"', () => {
    render(
      <DescriptionList
        items={[
          { term: 'Status', description: 'Concluída' },
          { term: 'Duração', description: null },
          { term: 'Motivo', description: '' },
          { term: 'Descrição', description: 'Texto longo', wide: true },
        ]}
      />,
    );
    const terms = screen.getAllByRole('term').map((t) => t.textContent);
    expect(terms).toEqual(['Status', 'Duração', 'Motivo', 'Descrição']);
    const defs = screen.getAllByRole('definition');
    expect(defs[0]).toHaveTextContent('Concluída');
    expect(within(defs[1]).getByLabelText('não informado')).toHaveTextContent('—');
    expect(within(defs[2]).getByLabelText('não informado')).toBeInTheDocument();
    expect(defs[3].parentElement).toHaveClass('nk-dl__item--wide');
  });

  it('colunas configuráveis e marcador de vazio próprio', () => {
    const { container } = render(<DescriptionList columns={3} emptyLabel="sem valor" items={[{ term: 'A', description: undefined }]} />);
    expect(container.querySelector('dl')).toHaveClass('nk-dl--cols-3');
    expect(screen.getByText('sem valor')).toBeInTheDocument();
  });

  it('zero é valor (não é vazio)', () => {
    render(<DescriptionList items={[{ term: 'Tentativas', description: 0 }]} />);
    expect(screen.getByRole('definition')).toHaveTextContent('0');
  });
});
