/**
 * Verificação do pacote distribuível (LIB-RELEASE-001 §3.3): empacota a lib como um consumidor a recebe e instala o
 * tarball em projetos vazios, fora desta pasta, sem acesso a src/, node_modules/ ou dist/ daqui.
 *
 *   node scripts/verificar-pacote.mjs [--react 18,19] [--saida <pasta>]
 *
 * Por versão do React: instala o tarball + react/react-dom, importa via ESM e via CommonJS (mesmas exportações),
 * renderiza componentes no servidor (renderToString), confere styles.css e as fontes que ele referencia, e compila um
 * arquivo TypeScript contra as declarações publicadas. Requer `npm run build` antes. Grava o tarball e o relatório
 * (resultado.json, com sha512/sha256 do tarball) na pasta de saída — padrão: artefatos/.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : fallback;
};
const reactVersions = opt('--react', '18,19').split(',');
const outDir = resolve(root, opt('--saida', 'artefatos'));
const isWin = process.platform === 'win32';
const npm = (args, cwd) => execFileSync(isWin ? 'npm.cmd' : 'npm', args, { cwd, encoding: 'utf8', shell: isWin, stdio: ['ignore', 'pipe', 'pipe'] });
const node = (code, cwd) => execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd, encoding: 'utf8' });

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? 'OK ' : 'FALHA'} ${name}${detail ? ` — ${detail}` : ''}`);
};

// 1. Empacotamento ---------------------------------------------------------------------------------------------
mkdirSync(outDir, { recursive: true });
const [packed] = JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--pack-destination', outDir], root));
const tarball = join(outDir, packed.filename);
const bytes = readFileSync(tarball);
const sha256 = createHash('sha256').update(bytes).digest('hex');
const files = packed.files.map((f) => f.path).sort();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

check('tarball gerado', existsSync(tarball), `${packed.filename} · ${bytes.length} bytes · sha256 ${sha256}`);
check('integridade npm (sha512) registrada', packed.integrity?.startsWith('sha512-'), packed.integrity);
const allowed = (f) => f === 'package.json' || f === 'README.md' || f.startsWith('dist/');
check('só dist/, package.json e README.md no pacote', files.every(allowed), files.filter((f) => !allowed(f)).join(', '));
check('sem sourcemaps no pacote', !files.some((f) => f.endsWith('.map')));
for (const f of ['dist/nekkora-lib.js', 'dist/nekkora-lib.cjs', 'dist/nekkora-lib.css', 'dist/types/index.d.ts', 'dist/fonts/OFL-Inter.txt']) {
  check(`contém ${f}`, files.includes(f));
}
check('sem testes compilados no pacote', !files.some((f) => /\.test\.(d\.ts|js)$/.test(f)));

// 2. CSS: fontes locais, nenhuma URL externa ------------------------------------------------------------------
const cssText = readFileSync(join(root, 'dist/nekkora-lib.css'), 'utf8');
const urls = [...cssText.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
const external = urls.filter((u) => /^(https?:)?\/\//.test(u));
check('CSS sem @import nem URL externa (P-LIB-03)', external.length === 0 && !/@import/.test(cssText), external.join(', '));
const fontUrls = urls.filter((u) => u.startsWith('./fonts/'));
check('@font-face aponta para arquivos do pacote', fontUrls.length > 0 && fontUrls.every((u) => files.includes(`dist/${u.slice(2)}`)), fontUrls.join(', '));
check('CSS sem fonte embutida em base64', !/data:font/.test(cssText));

// 3. Instalação limpa por versão do React ---------------------------------------------------------------------
const results = {};
const typescriptBin = join(root, 'node_modules/typescript/bin/tsc');
for (const major of reactVersions) {
  const dir = mkdtempSync(join(tmpdir(), `nekkora-lib-consumidor-r${major}-`));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: `consumidor-r${major}`, private: true, type: 'module' }, null, 2));
    cpSync(tarball, join(dir, packed.filename));
    npm(['install', '--no-audit', '--no-fund', '--ignore-scripts', `./${packed.filename}`, `react@${major}`, `react-dom@${major}`], dir);
    const installed = JSON.parse(readFileSync(join(dir, 'node_modules/react/package.json'), 'utf8')).version;
    check(`React ${major}: instalação limpa do tarball`, existsSync(join(dir, 'node_modules/nekkora-lib/dist/nekkora-lib.js')), `react ${installed}`);
    check(`React ${major}: sem src/ nem node_modules/ da lib`, !existsSync(join(dir, 'node_modules/nekkora-lib/src')) && !existsSync(join(dir, 'node_modules/nekkora-lib/node_modules')));

    const esm = JSON.parse(node(`const m = await import('nekkora-lib'); console.log(JSON.stringify(Object.keys(m).sort()));`, dir));
    const cjs = JSON.parse(node(`import { createRequire } from 'node:module'; const m = createRequire(import.meta.url)('nekkora-lib'); console.log(JSON.stringify(Object.keys(m).filter((k) => k !== '__esModule').sort()));`, dir));
    check(`React ${major}: ESM importa`, esm.length > 0, `${esm.length} exportações`);
    check(`React ${major}: CommonJS = ESM`, JSON.stringify(esm) === JSON.stringify(cjs), esm.filter((k) => !cjs.includes(k)).concat(cjs.filter((k) => !esm.includes(k))).join(', '));

    const html = node(
      `import { createElement as h } from 'react';
       import { renderToString } from 'react-dom/server';
       import { Alert, Badge, Button, Card, Input, Logo, SectionHeader, ThemeProvider } from 'nekkora-lib';
       console.log(renderToString(h(ThemeProvider, { theme: 'sage-light' },
         h(Logo), h(SectionHeader, { eyebrow: 'E', title: 'T' }), h(Button, null, 'Solicitar'), h(Badge, { tone: 'success' }, '-50%'),
         h(Alert, { tone: 'warning', title: 'A' }, 'corpo'), h(Card, null, h(Input, { label: 'Nome' })))));`,
      dir,
    );
    check(`React ${major}: renderização no servidor`, html.includes('nk-button') && html.includes('nk-alert') && html.includes('<svg'), `${html.length} caracteres de HTML`);

    const css = node(`console.log(import.meta.resolve('nekkora-lib/styles.css'))`, dir).trim();
    const cssPath = fileURLToPath(css);
    const cssFonts = [...readFileSync(cssPath, 'utf8').matchAll(/url\('\.\/fonts\/([^']+)'\)/g)].map((m) => join(dirname(cssPath), 'fonts', m[1]));
    check(`React ${major}: styles.css e fontes resolvíveis`, cssFonts.length > 0 && cssFonts.every(existsSync), `${cssFonts.length} fontes`);

    writeFileSync(
      join(dir, 'uso.tsx'),
      `import { Button, themes, type ThemeName } from 'nekkora-lib';\nimport 'nekkora-lib/styles.css';\nconst t: ThemeName = 'sage-light';\nexport const el = <Button leftIcon="whatsapp" variant="secondary">{themes[t].label}</Button>;\n`,
    );
    writeFileSync(join(dir, 'css.d.ts'), "declare module '*.css';\n");
    writeFileSync(
      join(dir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: false, types: [] }, files: ['uso.tsx', 'css.d.ts'] }),
    );
    let tsOut = '';
    let tsOk = true;
    try {
      npm(['install', '--no-audit', '--no-fund', `@types/react@${major}`, `@types/react-dom@${major}`], dir);
      execFileSync(process.execPath, [typescriptBin, '-p', 'tsconfig.json'], { cwd: dir, encoding: 'utf8' });
    } catch (e) {
      tsOk = false;
      tsOut = `${e.stdout ?? ''}${e.stderr ?? ''}`.trim().split('\n').slice(0, 5).join(' | ');
    }
    check(`React ${major}: TypeScript compila contra dist/types`, tsOk, tsOut);
    results[major] = { react: installed, exports: esm.length };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const failed = checks.filter((c) => !c.ok);
const report = {
  pacote: `${pkg.name}@${pkg.version}`,
  tarball: packed.filename,
  bytes: bytes.length,
  sha256,
  integrity: packed.integrity,
  arquivos: files,
  node: process.version,
  react: results,
  verificacoes: checks,
  resultado: failed.length === 0 ? 'APROVADO' : 'REPROVADO',
};
writeFileSync(join(outDir, 'resultado.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\n${report.resultado}: ${checks.length - failed.length}/${checks.length} verificações — ${join(outDir, 'resultado.json')}`);
process.exit(failed.length === 0 ? 0 : 1);
