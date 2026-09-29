import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

function Toggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{resolvedTheme}</button>;
}

afterEach(() => localStorage.clear());

describe('ThemeProvider', () => {
  it('aplica o tema no wrapper e alterna', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <Toggle />
      </ThemeProvider>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-nk-theme', 'light');
    expect(root).toHaveClass('nk-root');
    fireEvent.click(screen.getByRole('button'));
    expect(root).toHaveAttribute('data-nk-theme', 'dark');
  });

  it('aplica no <html> com target="document" e persiste no storage', () => {
    const { unmount } = render(
      <ThemeProvider target="document" defaultTheme="dark" storageKey="nk-theme">
        <Toggle />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-nk-theme', 'dark');
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement).toHaveAttribute('data-nk-theme', 'light');
    expect(localStorage.getItem('nk-theme')).toBe('light');
    unmount();
    expect(document.documentElement).not.toHaveAttribute('data-nk-theme');
  });

  it('aceita os templates de cor e expõe o modo', () => {
    const { container } = render(<ThemeProvider theme="midnight-blue" />);
    expect(container.firstElementChild).toHaveAttribute('data-nk-theme', 'midnight-blue');
    expect(container.firstElementChild).toHaveAttribute('data-nk-mode', 'dark');
  });

  it('alterna dentro do par configurado', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="midnight-blue" pair={{ dark: 'midnight-blue', light: 'porcelain-light' }}>
        <Toggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(container.firstElementChild).toHaveAttribute('data-nk-theme', 'porcelain-light');
    expect(container.firstElementChild).toHaveAttribute('data-nk-mode', 'light');
  });

  it('ignora valor inválido no storage', () => {
    localStorage.setItem('nk-theme', 'inexistente');
    const { container } = render(<ThemeProvider storageKey="nk-theme" defaultTheme="sage-light" />);
    expect(container.firstElementChild).toHaveAttribute('data-nk-theme', 'sage-light');
  });

  it('respeita o tema controlado', () => {
    const { container } = render(<ThemeProvider theme="light" />);
    expect(container.firstElementChild).toHaveAttribute('data-nk-theme', 'light');
  });
});

describe('ThemeToggle', () => {
  it('alterna entre o par escuro/claro e anuncia o destino', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="midnight-blue" pair={{ dark: 'midnight-blue', light: 'sage-light' }}>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-nk-theme', 'midnight-blue');
    fireEvent.click(screen.getByRole('button', { name: 'Mudar para o tema claro' }));
    expect(root).toHaveAttribute('data-nk-theme', 'sage-light');
    fireEvent.click(screen.getByRole('button', { name: 'Mudar para o tema escuro' }));
    expect(root).toHaveAttribute('data-nk-theme', 'midnight-blue');
  });
});
