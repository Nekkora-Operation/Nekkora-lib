import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'nekkora-lib';
import { App } from './App';
import './docs.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider target="document" defaultTheme="dark" storageKey="nk-docs-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
