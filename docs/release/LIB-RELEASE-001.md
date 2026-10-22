# LIB-RELEASE-001 — Estabilização e distribuição interna da nekkora-lib

Parte da NEKKORA-RELEASE-001. Relatório gerado a partir de execuções reais em 22/10/2026; os comandos e saídas
estão em [`evidencias/comandos.txt`](evidencias/comandos.txt).

## Identificação

| Item | Valor |
|---|---|
| Missão | LIB-RELEASE-001 (P0) |
| Repositório | `Nekkora-Operation/Nekkora-lib` |
| Branch | `release/lib-release-001` (a partir de `main` = `c4c479f`) |
| Commits | `c485c78` (implementação) · `762eaf1` (CI) · `638f030` (eol=lf) · este relatório |
| Pull Request | [#6](https://github.com/Nekkora-Operation/Nekkora-lib/pull/6) — **sem merge** (aguarda a titular) |
| Versão | `nekkora-lib@0.2.0` — tarball `sha256 1a2e6145…26a6`, integridade `sha512-LE1ZO5Mk…IcT4A==` |
| CI | [run 39813175256](https://github.com/Nekkora-Operation/Nekkora-lib/actions/runs/39813175256) (aprovado) |

## 1. Auditoria da `main` (antes de qualquer alteração)

Clone limpo de `main` (`c4c479f`) numa pasta temporária, `npm ci` + `npm run check`:

| Verificação | Resultado na `main` |
|---|---|
| `npm ci` | OK; **4 vulnerabilidades** (2 altas, 2 moderadas) — `vite 8.3.0–8.3.2`, `vitest/@vitest/mocker ≤ 5.0.2`, `source-map-js ≤ 1.2.1`; todas em dependências de desenvolvimento |
| Typecheck, testes, build, build da documentação | OK — 10 arquivos, **104/104** testes |
| Estrutura / exportações | 36 componentes em `src/components/*`, 76 exportações públicas; ESM + CJS + CSS + `.d.ts` |
| Peer dependencies | `react`/`react-dom >= 18` — só React 19 era testado |
| Fontes | `@import` do Google Fonts em `foundation.css`: toda página que usa a lib fazia requisição a terceiros |
| Pacote | `files: ["dist"]` incluía ~516 kB de sourcemaps |
| Acessibilidade (axe-core 4.13, 67 exemplos × 6 temas, navegador real) | **145 nós com violação** (139 `color-contrast`, 6 `scrollable-region-focusable`) — [`a11y-antes-main.json`](evidencias/a11y-antes-main.json) |
| Distribuição | Só por pasta local (`file:../Nekkora-lib` / `npm link`): não reproduzível fora desta máquina |

## 2. Correções

| ID | Problema | Correção | Medida depois |
|---|---|---|---|
| P-LIB-01 | Acento do Nekkora Light `#C2466D` = 4,35:1 sobre o fundo | Acento `#AD3E61` (mesmo matiz, 11% mais escuro); hover/active acompanham | 5,26:1 fundo · 4,90:1 card · 4,57:1 Badge accent soft |
| P-LIB-02 | `text-muted` (placeholders, contador, divisores) 2,66–4,10:1 | Derivação 58% (escuro) / 65% (claro); Nekkora Dark `#918692`, Light `#786C76` | ≥ 4,5:1 sobre fundo, superfície e campo em todos os temas |
| P-LIB-03 | Inter via Google Fonts | Inter variável (OFL 1.1) **dentro do pacote** (`dist/fonts`, latin + latin-ext com `unicode-range`) | 0 requisições externas; latin = 48 kB |
| P-LIB-04 | Corpo do `Alert` info = 4,47:1 (Porcelain) | Corpo com 80% do texto | ≥ 4,5:1 em todos os tons e temas |
| P-LIB-05 | Corpo do `Alert` warning 3,5–4,1:1 (Sakura) | Idem | ≥ 4,5:1 |
| P-LIB-06 | Contraste sobre gradiente não decidido pelo axe | Medição por pixels (percentil 10) dos 150 nós "incompletos", inclusive texto com gradiente (`background-clip: text`) | 0 abaixo do mínimo |
| P-LIB-07 | `Badge` success soft = 4,25:1 (Sage Light) | Tokens `success-text`/`warning-text` no modo claro; `primary-soft` 12%; `neutral-soft` mais leve | ≥ 4,5:1 (soft e outline, todos os tons) |
| — | Tema escuro aninhado em claro herdava os tokens do claro (achado da auditoria) | Tokens redeclarados no modo escuro | axe 0 em `themes/Nested` |
| — | `Table` rolável sem foco por teclado (`scrollable-region-focusable`) | `tabIndex=0`, `role="region"` e nome acessível quando há `maxHeight` | 0 |
| — | `DescriptionList`: `aria-label` em `<span>` (proibido) — usado pelo Commercial | Traço `aria-hidden` + texto oculto "não informado" | 0 |
| — | `SelectMenu`: `aria-controls` para lista inexistente quando fechado | Só aponta quando aberto | — |
| — | Rodapé do `AuthLayout`, célula muted em linha selecionada | `text-secondary` / `text` | 0 |
| — | 4 vulnerabilidades de desenvolvimento | `npm audit fix` (vite 8.3.5, vitest 5.0.5, source-map-js 1.2.2) | 0 vulnerabilidades |

Elementos visuais aprovados (logotipo, paleta-base, tipografia, temas) foram mantidos; as únicas mudanças de cor são as
de acessibilidade acima, todas no mesmo matiz.

## 3. Distribuição

- **ESM** (`dist/nekkora-lib.js`), **CommonJS** (`.cjs`), **CSS** (`nekkora-lib/styles.css`) e **declarações**
  (`dist/types`); pacote sem sourcemaps (`files: ["dist", "!dist/**/*.map"]`, 222 kB).
- `scripts/fontes.mjs` (pós-build): o modo biblioteca do Vite embutiria a fonte em base64 (+180 kB e download dos
  dois subconjuntos sempre); a fonte vai como arquivo e o bundler de quem consome a resolve.
- `scripts/verificar-pacote.mjs`: instala o tarball em projetos vazios fora do repositório com **React 18.3.1 e
  19.3.1** — ESM, CJS (mesmas 76 exportações), renderização no servidor, CSS e fontes, TypeScript contra `dist/types`.
  **27/27** ([`pacote-resultado.json`](evidencias/pacote-resultado.json)).
- **Build reproduzível:** o CI gera o pacote, refaz o build numa pasta limpa e exige o mesmo sha256. Com `.gitattributes`
  (`eol=lf`) o build no Windows produz **o mesmo sha256 do CI** (`1a2e6145…`); o Commercial reconstrói o tarball a partir
  do commit `638f030` no próprio CI e confere byte a byte (`scripts/verificar-lib.mjs --reconstruir`).
- **Sem npm.** Numa tag `v*`, o CI anexa tarball + `SHA256SUMS` + `resultado.json` a uma GitHub Release (distribuição
  interna). O Commercial versiona o tarball do CI em `vendor/` — instalação determinística, sem pastas da máquina.

## 4. Qualidade

| Verificação | Resultado |
|---|---|
| `npm ci` + `npm run check` (typecheck, testes, build, docs) | OK — **112/112** testes (104 + 8 novos) |
| `contraste-temas.test.ts` (novo) | Tokens, Badge (7 tons, soft/outline) e Alert (4 tons) nos 6 temas, a partir do CSS |
| axe-core em navegador real — 67 exemplos × 6 temas | **145 → 0** nós com violação ([`a11y-depois.json`](evidencias/a11y-depois.json)) |
| Contraste por pixels (incompletos do axe) | 150 nós, **0** abaixo de 4,5:1 (3:1 texto grande) |
| Requisições externas | **1 → 0** |
| Pacote em ambiente limpo (React 18 e 19) | **27/27** |
| CI no GitHub (Ubuntu) | Aprovado, inclusive build reproduzível |
| `npm audit` | **4 → 0** |

### Limitações conhecidas

- Os 24 "incompletos" restantes do axe são `bypass` (link de pular conteúdo) nos exemplos isolados da documentação —
  regra de página inteira, não de componente; o Commercial tem o link e passa.
- Leitores de tela não foram testados com tecnologia assistiva real (só a árvore de acessibilidade via axe).
- Playwright/axe da auditoria vêm de `../Nekkora-Platform-Web/node_modules` (como no Commercial até aqui): não são
  dependências da lib.

## 5. Pendências

| ID | Pendência | Responsável |
|---|---|---|
| L-01 | Merge do PR #6 | Titular |
| L-02 | Criar a tag `v0.2.0` no commit mesclado (gera a GitHub Release interna) — opcional: o Commercial já fixa o tarball do CI por hash | Titular |
| L-03 | P-LIB-08 (ícone no cabeçalho do `Dialog`) — fora do escopo desta release (não é defeito) | Backlog |

## 6. Conclusão

**Status: APROVADA COM RESSALVAS** — critérios técnicos de §3.4 atendidos e comprovados (testes, build limpo, sem
regressões nos componentes do Commercial — ver COM-RELEASE-001 —, acessibilidade crítica resolvida, instalação sem
arquivos da máquina, versão identificada por hash). Ressalva: merge e tag dependem da titular.
