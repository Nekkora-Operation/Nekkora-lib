import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'nekkora-lib';
import { App } from './App';
import './playground.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider target="document" defaultTheme="dark" storageKey="nk-playground-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
