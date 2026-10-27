#!/usr/bin/env node
/**
 * Auditoria de acessibilidade da lib em navegador real (LIB-RELEASE-001 §3.1/§3.2): cada exemplo da documentação
 * (docs/src/examples) é aberto sozinho no frame.html, em cada tema embutido, e analisado pelo axe-core (WCAG 2.0/2.1
 * A e AA). Também registra toda requisição que sai do servidor local (a lib não deve depender de terceiros).
 *
 *   npm run build:docs
 *   NEKKORA_PW_MODULES=../Nekkora-Platform-Web/node_modules node scripts/auditoria-a11y.mjs [docs/dist] [saida]
 *
 * Playwright e axe-core não são dependências da lib: são resolvidos a partir de NEKKORA_PW_MODULES (uma pasta
 * node_modules que os contenha), como na homologação do Commercial. Saída: resultado.json na pasta indicada.
 */
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const [, , distArg = 'docs/dist', outArg = 'artefatos/a11y'] = process.argv;
const dist = resolve(distArg);
const outDir = resolve(outArg);
const modules = process.env.NEKKORA_PW_MODULES;
const require = createRequire(modules ? resolve(modules, 'noop.js') : import.meta.url);
const { chromium } = require('playwright');
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const THEMES = ['dark', 'light', 'sakura-dark', 'midnight-blue', 'porcelain-light', 'sage-light'];
const examplesDir = resolve('docs/src/examples');
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const EXAMPLES = walk(examplesDir)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => relative(examplesDir, f).replace(/\\/g, '/').replace(/\.tsx$/, ''))
  .sort();

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(dist, path === '/' ? 'index.html' : path);
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1100, height: 900 }, reducedMotion: 'reduce' });
const external = new Set();
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
  external.add(url);
  return route.abort();
});

/**
 * Mede o contraste real de elementos sobre fundos que o axe não sabe calcular (gradientes, pseudo-elementos):
 * deixa o texto transparente, captura a caixa do elemento e compara a cor do texto com cada pixel do fundo.
 * (Mesmo método de scripts/homologacao.mjs do Nekkora-Commercial.) Usa o percentil 10 (os 10% de pixels de fundo mais desfavoráveis) para ignorar bordas e ícones vizinhos.
 * Exigência: 4,5:1, ou 3:1 para texto grande (≥ 24 px, ou ≥ 18,66 px em negrito).
 */
async function measureContrastByPixels(page, selectors) {
  const out = [];
  for (const sel of [...new Set(selectors)]) {
    const el = page.locator(sel).first();
    if (!(await el.count()) || !(await el.isVisible())) continue;
    await el.scrollIntoViewIfNeeded();
    const info = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      // Texto com gradiente (background-clip: text): a "cor" do texto são as paradas do gradiente e o fundo real é o do
      // elemento pai. Esconde o gradiente e mede cada parada contra os pixels de fundo.
      const clipText = cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text';
      // lido antes de esconder o texto: o objeto do getComputedStyle é "vivo"
      const fg = clipText ? (cs.backgroundImage.match(/rgba?\([^)]+\)|color\(srgb[^)]+\)/g) ?? [cs.color]) : [cs.color];
      if (clipText) node.style.setProperty('background', 'none', 'important');
      node.dataset.nkPrevColor = node.style.color;
      node.style.setProperty('color', 'transparent', 'important');
      node.querySelectorAll('*').forEach((c) => c.style.setProperty('color', 'transparent', 'important'));
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      return { fg, large: size >= 24 || (bold && size >= 18.66), round: radius >= Math.min(node.offsetWidth, node.offsetHeight) * 0.4 };
    });
    let box = await el.boundingBox();
    if (!box || box.width < 2 || box.height < 2) continue;
    // Elemento redondo (ex.: número da etapa): amostra só o miolo, sem os cantos fora do círculo.
    if (info.round) box = { x: box.x + box.width * 0.2, y: box.y + box.height * 0.2, width: box.width * 0.6, height: box.height * 0.6 };
    const png = await page.screenshot({ clip: box });
    await el.evaluate((node) => {
      node.style.color = node.dataset.nkPrevColor ?? '';
      node.style.removeProperty('background');
      node.querySelectorAll('*').forEach((c) => c.style.removeProperty('color'));
    });
    const r = await page.evaluate(
      async ({ b64, fg }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const cv = document.createElement('canvas');
        cv.width = img.width;
        cv.height = img.height;
        const ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const px = ctx.getImageData(0, 0, cv.width, cv.height).data;
        const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
        const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        const parse = (c) => (c.startsWith('color(srgb') ? c.replace('color(srgb', '').match(/[\d.]+/g).map((v) => v * 255) : c.match(/[\d.]+/g).map(Number));
        const lfs = fg.map(parse).map((raw) => L(raw[0], raw[1], raw[2]));
        const ratios = [];
        for (let i = 0; i < px.length; i += 4 * 3) {
          const lb = L(px[i], px[i + 1], px[i + 2]);
          // pior parada do gradiente contra este pixel de fundo
          ratios.push(Math.min(...lfs.map((lf) => (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05))));
        }
        ratios.sort((a, b) => a - b);
        return { p10: +ratios[Math.floor(ratios.length * 0.1)].toFixed(2), min: +ratios[0].toFixed(2) };
      },
      { b64: png.toString('base64'), fg: info.fg },
    );
    out.push({ target: sel.slice(-80), required: info.large ? 3 : 4.5, ...(info.fg.length > 1 && { gradienteNoTexto: info.fg }), ...r });
  }
  return out;
}

const results = { origem: distArg, inicio: new Date().toISOString(), exemplos: EXAMPLES.length, temas: THEMES, porTema: {}, violacoes: [], incompletos: 0, porPixels: [], externas: [] };
const page = await context.newPage();
for (const theme of THEMES) {
  let total = 0;
  for (const ex of EXAMPLES) {
    await page.goto(`${origin}/frame.html?ex=${encodeURIComponent(ex)}&theme=${theme}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ content: axeSource });
    const r = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const out = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return {
        violations: out.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), summary: n.failureSummary?.split('\n').slice(1, 2).join(' ').trim() })) })),
        incomplete: out.incomplete.reduce((s, v) => s + v.nodes.length, 0),
        // Contraste que o axe não decide (gradiente, imagem, pseudo-elemento, sobreposição): medido por pixels (P-LIB-06).
        contrastTargets: (out.incomplete.find((v) => v.id === 'color-contrast')?.nodes ?? []).map((n) => ({ target: n.target.join(' '), motivo: n.any[0]?.data?.messageKey ?? n.any[0]?.message })),
        otherIncomplete: out.incomplete.filter((v) => v.id !== 'color-contrast').map((v) => `${v.id}(${v.nodes.length})`),
      };
    });
    results.incompletos += r.incomplete;
    const motivos = Object.fromEntries(r.contrastTargets.map((t) => [t.target, t.motivo]));
    for (const m of await measureContrastByPixels(page, r.contrastTargets.map((t) => t.target))) {
      results.porPixels.push({ tema: theme, exemplo: ex, ...m, motivo: motivos[Object.keys(motivos).find((k) => k.endsWith(m.target)) ?? ''] ?? null, ok: m.p10 >= m.required });
    }
    if (r.otherIncomplete.length) (results.outrosIncompletos ??= []).push({ tema: theme, exemplo: ex, regras: r.otherIncomplete });
    for (const v of r.violations) {
      total += v.nodes.length;
      results.violacoes.push({ tema: theme, exemplo: ex, regra: v.id, impacto: v.impact, nos: v.nodes });
    }
  }
  results.porTema[theme] = total;
  console.log(`${theme}: ${total} nós com violação em ${EXAMPLES.length} exemplos`);
}
results.externas = [...external];
results.fim = new Date().toISOString();
await browser.close();
server.close();

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'resultado.json'), `${JSON.stringify(results, null, 2)}\n`);
const byRule = {};
for (const v of results.violacoes) byRule[v.regra] = (byRule[v.regra] ?? 0) + v.nos.length;
console.log('por regra:', JSON.stringify(byRule));
console.log(`requisições externas: ${results.externas.length}${results.externas.length ? ` (${results.externas.slice(0, 3).join(', ')})` : ''}`);
const lowPx = results.porPixels.filter((m) => !m.ok);
console.log(`incompletos do axe: ${results.incompletos} · contraste medido por pixels: ${results.porPixels.length} nós, ${lowPx.length} abaixo do mínimo`);
for (const m of lowPx.slice(0, 30)) console.log(`  abaixo: ${m.tema} ${m.exemplo} ${m.target} p10=${m.p10} (mín. ${m.required}) ${m.motivo ?? ''}`);
console.log(`outros incompletos: ${JSON.stringify(results.outrosIncompletos ?? [])}`);
process.exit(results.violacoes.length === 0 && results.externas.length === 0 && lowPx.length === 0 ? 0 : 1);
