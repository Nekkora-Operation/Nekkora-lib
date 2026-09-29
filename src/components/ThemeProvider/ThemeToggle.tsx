import { Button, type ButtonProps } from '../Button';
import { useTheme } from './ThemeProvider';

export interface ThemeToggleProps extends Omit<ButtonProps, 'icon' | 'leftIcon' | 'rightIcon' | 'children' | 'onClick'> {
  /** Rótulo acessível quando o tema atual é escuro. Padrão: "Mudar para o tema claro". */
  toLightLabel?: string;
  /** Rótulo acessível quando o tema atual é claro. Padrão: "Mudar para o tema escuro". */
  toDarkLabel?: string;
}

/**
 * Botão de ícone que alterna entre os temas escuro e claro do `pair` do ThemeProvider (toggleTheme). Mostra o sol
 * no tema escuro e a lua no claro; o rótulo acessível diz para qual tema vai. Deve estar dentro do ThemeProvider.
 */
export function ThemeToggle({
  toLightLabel = 'Mudar para o tema claro',
  toDarkLabel = 'Mudar para o tema escuro',
  variant = 'ghost',
  size = 'sm',
  ...rest
}: ThemeToggleProps) {
  const { mode, toggleTheme } = useTheme();
  const label = mode === 'dark' ? toLightLabel : toDarkLabel;
  return (
    <Button
      {...rest}
      variant={variant}
      size={size}
      icon={mode === 'dark' ? 'sun' : 'moon'}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    />
  );
}
