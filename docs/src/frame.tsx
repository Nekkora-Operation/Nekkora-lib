import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { isThemeName, ThemeProvider } from 'nekkora-lib';
import '../../src/fonts/fonts.css';
import { examples } from './ui/examples';

/**
 * Página própria para exemplos que ocupam a página inteira (ex.: AppShell): roda dentro de um iframe da documentação,
 * com seu próprio documento (um único <main>, landmarks corretos) e a largura real do quadro (media queries).
 * Parâmetros: ?ex=<caminho do exemplo>&theme=<tema>.
 */
const params = new URLSearchParams(location.search);
const entry = examples[params.get('ex') ?? ''];
const theme = params.get('theme') ?? 'dark';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider target="document" theme={isThemeName(theme) ? theme : 'dark'}>
      {entry ? <entry.Component /> : <p>Exemplo não encontrado.</p>}
    </ThemeProvider>
  </StrictMode>,
);
