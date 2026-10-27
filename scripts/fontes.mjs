/**
 * Pós-build: publica a fonte Inter junto com a lib (P-LIB-03).
 *
 * O modo biblioteca do Vite embute em base64 todo arquivo referenciado pelo CSS, o que faria o navegador baixar os
 * dois subconjuntos da fonte (e o CSS ficar ~180 kB maior) mesmo quando a página só usa um. Por isso a fonte fica fora
 * do index.ts: este script copia os .woff2 e a licença para dist/fonts/ e coloca as regras @font-face de
 * src/fonts/fonts.css no topo de dist/nekkora-lib.css, com as URLs relativas a dist/. O app que importa
 * 'nekkora-lib/styles.css' resolve ./fonts/... pelo próprio bundler, como qualquer asset.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src/fonts');
const out = join(root, 'dist/fonts');
const cssFile = join(root, 'dist/nekkora-lib.css');

mkdirSync(out, { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith('.woff2') || f.endsWith('.txt'));
for (const f of files) copyFileSync(join(src, f), join(out, f));

const fontCss = readFileSync(join(src, 'fonts.css'), 'utf8').replace(/\r\n/g, '\n').replace(/url\('\.\//g, "url('./fonts/");
const referenced = [...fontCss.matchAll(/url\('\.\/fonts\/([^']+)'\)/g)].map((m) => m[1]);
const missing = referenced.filter((f) => !files.includes(f));
if (referenced.length === 0 || missing.length > 0) throw new Error(`fonts.css referencia arquivos ausentes: ${missing.join(', ') || '(nenhuma URL)'}`);

const css = readFileSync(cssFile, 'utf8');
if (css.includes('@font-face')) throw new Error('dist/nekkora-lib.css já tem @font-face — rode o build do zero');
writeFileSync(cssFile, `${fontCss}${css}`);
console.log(`fontes: ${files.length} arquivos em dist/fonts, ${referenced.length} @font-face em nekkora-lib.css`);
