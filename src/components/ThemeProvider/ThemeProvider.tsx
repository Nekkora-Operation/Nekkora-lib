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
import type { ThemeName } from '../../tokens/tokens';

/** "system" segue a preferência do sistema operacional (prefers-color-scheme). */
export type ThemePreference = ThemeName | 'system';

interface ThemeContextValue {
  /** Preferência escolhida (pode ser "system"). */
  theme: ThemePreference;
  /** Tema efetivamente aplicado. */
  resolvedTheme: ThemeName;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): ThemeName {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function readStorage(key?: string): ThemePreference | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(key);
    return v === 'dark' || v === 'light' || v === 'system' ? v : null;
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

/** Aplica o tema Nekkora (dark/light/system) e expõe useTheme() para os filhos. */
export function ThemeProvider({
  theme: controlled,
  defaultTheme = 'dark',
  onThemeChange,
  storageKey,
  target = 'wrapper',
  className,
  children,
  ...rest
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<ThemePreference>(() => readStorage(storageKey) ?? defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ThemeName>(getSystemTheme);
  const theme = controlled ?? uncontrolled;
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(DARK_QUERY);
    const update = () => setSystemTheme(mql.matches ? 'dark' : 'light');
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [theme]);

  useEffect(() => {
    if (target !== 'document' || typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('data-nk-theme', resolvedTheme);
    html.classList.add('nk-root');
    return () => {
      html.removeAttribute('data-nk-theme');
      html.classList.remove('nk-root');
    };
  }, [target, resolvedTheme]);

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
    () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    [resolvedTheme, setTheme],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {target === 'document' ? (
        children
      ) : (
        <div className={cx('nk-root', className)} data-nk-theme={resolvedTheme} {...rest}>
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
