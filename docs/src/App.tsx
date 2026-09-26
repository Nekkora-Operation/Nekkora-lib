import { useEffect, useMemo, useState } from 'react';
import { Button, Icon, Input, Link, Select, Text, themeList, useTheme, type ThemePreference } from 'nekkora-lib';
import { pages } from './pages';

function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, '') || pages[0].id;
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onHash = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function ThemeSelect() {
  const { theme, mode, setTheme } = useTheme();
  return (
    <Select
      aria-label="Tema"
      size="sm"
      leftIcon={theme === 'system' ? 'monitor' : mode === 'light' ? 'sun' : 'moon'}
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemePreference)}
      options={[
        { label: 'Escuros', options: themeList.filter((t) => t.mode === 'dark').map((t) => ({ value: t.name, label: t.label })) },
        { label: 'Claros', options: themeList.filter((t) => t.mode === 'light').map((t) => ({ value: t.name, label: t.label })) },
        { label: 'Automático', options: [{ value: 'system', label: 'Seguir o sistema' }] },
      ]}
    />
  );
}

export function App() {
  const route = useRoute();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const index = Math.max(0, pages.findIndex((p) => p.id === route));
  const page = pages[index];
  const prev = pages[index - 1];
  const next = pages[index + 1];

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, typeof pages>();
    for (const p of pages) {
      if (q && !p.title.toLowerCase().includes(q) && !p.group.toLowerCase().includes(q)) continue;
      map.set(p.group, [...(map.get(p.group) ?? []), p]);
    }
    return [...map.entries()];
  }, [query]);

  useEffect(() => {
    document.title = `${page.title} · Nekkora Design System`;
    setMenuOpen(false);
  }, [page]);

  const { Component } = page;

  return (
    <div className="doc-layout">
      <aside className={`doc-sidebar${menuOpen ? ' doc-sidebar--open' : ''}`}>
        <a href="#/inicio" className="doc-brand">
          <Icon name="sakura" size={30} color="var(--nk-color-accent)" />
          <div>
            <Text variant="h4" as="div">Nekkora</Text>
            <Text variant="overline" color="secondary" className="doc-brand__sub">Design System</Text>
          </div>
        </a>
        <Input size="sm" placeholder="Buscar..." leftIcon="search" value={query} onValueChange={setQuery} clearable fullWidth />
        <nav className="doc-nav">
          {groups.map(([group, items]) => (
            <div key={group} className="doc-nav__group">
              <Text variant="overline" color="muted" className="doc-nav__label">{group}</Text>
              {items.map((p) => (
                <a key={p.id} href={`#/${p.id}`} className={`doc-nav__item${p.id === page.id ? ' is-active' : ''}`}>
                  <Icon name={p.icon} size="sm" />
                  {p.title}
                </a>
              ))}
            </div>
          ))}
          {groups.length === 0 && <Text variant="body-sm" color="muted">Nada encontrado.</Text>}
        </nav>
      </aside>
      {menuOpen && <div className="doc-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="doc-body">
        <header className="doc-topbar">
          <Button
            className="doc-menu-btn"
            variant="ghost"
            icon="more-vertical"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          />
          <Text variant="body-sm" color="secondary" className="doc-crumb">
            {page.group} <Icon name="chevron-right" size="xs" /> <Text as="span" variant="body-sm" weight="medium">{page.title}</Text>
          </Text>
          <div className="doc-topbar__actions">
            <ThemeSelect />
            <Link href="https://github.com/Nekkora-Operation/Nekkora-lib" external variant="subtle" size="sm">
              GitHub
            </Link>
          </div>
        </header>

        <main className="doc-page" key={page.id}>
          <Component />
          <nav className="doc-pager">
            {prev ? (
              <a href={`#/${prev.id}`} className="doc-pager__link">
                <Text variant="caption" color="muted">Anterior</Text>
                <Text weight="medium"><Icon name="arrow-left" size="sm" /> {prev.title}</Text>
              </a>
            ) : <span />}
            {next && (
              <a href={`#/${next.id}`} className="doc-pager__link doc-pager__link--next">
                <Text variant="caption" color="muted">Próximo</Text>
                <Text weight="medium">{next.title} <Icon name="arrow-right" size="sm" /></Text>
              </a>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
