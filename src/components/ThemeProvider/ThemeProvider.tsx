import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { isThemeName, themes, type ThemeMode, type ThemeName } from '../../tokens/tokens';

/** "system" segue a preferência do sistema operacional (prefers-color-scheme). */
export type ThemePreference = ThemeName | 'system';

/** Tema usado para cada modo quando a preferência é "system" e no toggleTheme(). */
export interface ThemePair {
  dark: ThemeName;
  light: ThemeName;
}

interface ThemeContextValue {
  /** Preferência escolhida (pode ser "system"). */
  theme: ThemePreference;
  /** Tema efetivamente aplicado. */
  resolvedTheme: ThemeName;
  /** Modo (dark/light) do tema aplicado. */
  mode: ThemeMode;
  setTheme: (theme: ThemePreference) => void;
  /** Alterna entre os temas de `pair` (padrão: dark ↔ light). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';
const DEFAULT_PAIR: ThemePair = { dark: 'dark', light: 'light' };

function getSystemMode(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function readStorage(key?: string): ThemePreference | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(key);
    return v === 'system' || isThemeName(v) ? v : null;
  } catch {
    return null;
  }
}

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Tema controlado. Se omitido, o provider gerencia o estado internamente. */
  theme?: ThemePreference;
  /** Tema inicial no modo não controlado. Padrão: "dark". */
  defaultTheme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
  /**
   * Par de temas escuro/claro usado por "system" e por toggleTheme().
   * Ex.: { dark: 'midnight-blue', light: 'porcelain-light' }. Padrão: { dark: 'dark', light: 'light' }.
   */
  pair?: ThemePair;
  /** Persiste a escolha no localStorage com esta chave (ex.: "nk-theme"). */
  storageKey?: string;
  /**
   * Onde aplicar o tema:
   * - "wrapper" (padrão): renderiza uma <div class="nk-root" data-nk-theme>.
   * - "document": aplica data-nk-theme e nk-root no <html>, sem wrapper.
   */
  target?: 'wrapper' | 'document';
  children?: ReactNode;
}

/** Aplica um tema Nekkora (qualquer tema embutido ou "system") e expõe useTheme() para os filhos. */
export function ThemeProvider({
  theme: controlled,
  defaultTheme = 'dark',
  onThemeChange,
  storageKey,
  pair = DEFAULT_PAIR,
  target = 'wrapper',
  className,
  children,
  ...rest
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<ThemePreference>(() => readStorage(storageKey) ?? defaultTheme);
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode);
  const theme = controlled ?? uncontrolled;
  const resolvedTheme: ThemeName = theme === 'system' ? pair[systemMode] : theme;
  const mode = themes[resolvedTheme].mode;

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(DARK_QUERY);
    const update = () => setSystemMode(mql.matches ? 'dark' : 'light');
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [theme]);

  useEffect(() => {
    if (target !== 'document' || typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('data-nk-theme', resolvedTheme);
    html.setAttribute('data-nk-mode', mode);
    html.classList.add('nk-root');
    return () => {
      html.removeAttribute('data-nk-theme');
      html.removeAttribute('data-nk-mode');
      html.classList.remove('nk-root');
    };
  }, [target, resolvedTheme, mode]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      if (controlled === undefined) setUncontrolled(next);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          /* storage indisponível */
        }
      }
      onThemeChange?.(next);
    },
    [controlled, storageKey, onThemeChange],
  );

  const toggleTheme = useCallback(
    () => setTheme(mode === 'dark' ? pair.light : pair.dark),
    [mode, pair.dark, pair.light, setTheme],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, mode, setTheme, toggleTheme }),
    [theme, resolvedTheme, mode, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {target === 'document' ? (
        children
      ) : (
        <div className={cx('nk-root', className)} data-nk-theme={resolvedTheme} data-nk-mode={mode} {...rest}>
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  );
}

/** Lê e altera o tema atual. Deve ser usado dentro de <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>.');
  return ctx;
}
