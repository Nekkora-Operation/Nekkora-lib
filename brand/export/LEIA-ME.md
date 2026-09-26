# Nekkora — logo exportado

Gerado a partir dos SVGs em `brand/`. PNGs com fundo transparente (exceto o ícone de app, que tem fundo rosa).
Para qualquer tamanho não listado, prefira o SVG: ele não perde qualidade.

`-dark` = para usar sobre **fundo escuro** (traço claro) · `-light` = para usar sobre **fundo claro**.
O número no nome é a **altura em px**.

| Pasta | O que é | Alturas |
|---|---|---|
| `app-icon/` | Ícone de app (quadrado, fundo rosa, óculos brancos) | 16, 24, 32, 48, 64, 128, 180, 192, 256, 512, 1024 |
| `symbol/` | Só o símbolo Cat-Eye (proporção 3:2) | 16, 24, 32, 48, 64, 128, 256, 512, 1024 |
| `wordmark/` | Só o nome "nekkora" | 24, 32, 64, 128, 256, 512 |
| `lockup/` | Símbolo + nome | 24, 32, 64, 128, 256, 512 |
| `web/` | Pronto para sites: `favicon.ico` (16/32/48), `favicon.svg`, `favicon-16/32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | — |

Uso em HTML:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```
