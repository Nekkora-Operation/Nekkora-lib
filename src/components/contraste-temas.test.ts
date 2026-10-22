/**
 * Contraste de texto dos tokens e dos componentes de status, em TODOS os temas embutidos (LIB-RELEASE-001:
 * P-LIB-01, 02, 04, 05 e 07). Como o contraste-perigo.test.ts, lê as próprias folhas de estilo — o jsdom não calcula
 * cores —, resolve as variáveis de cada tema (inclusive color-mix em srgb e cores translúcidas) e compõe o resultado
 * sobre cada fundo em que o texto aparece.
 *
 * Critério: WCAG 2.x AA para texto normal = 4,5:1 (todos os casos abaixo usam 11–14 px). Elementos sobre gradiente
 * não entram aqui (P-LIB-06): o gradiente depende da página e é medido por pixels na homologação de quem consome.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { themeNames, themes } from '../tokens/tokens';

const here = dirname(fileURLToPath(import.meta.url));
const css = (path: string) => readFileSync(join(here, path), 'utf8');
const themesCss = css('../tokens/themes.css');

type Rgba = [number, number, number, number];
type Props = Record<string, string>;

/** Blocos `seletores { propriedades }` de uma folha (sem aninhamento). */
function blocks(source: string): { selectors: string[]; props: Props }[] {
  const out: { selectors: string[]; props: Props }[] = [];
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const props: Props = {};
    for (const decl of m[2].split(';')) {
      const i = decl.indexOf(':');
      if (i > 0) props[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
    }
    out.push({ selectors: m[1].split(',').map((s) => s.trim()), props });
  }
  return out;
}

/** Variáveis de um tema: todos os blocos de themes.css que o selecionam, na ordem do arquivo. */
function themeVars(theme: string): Props {
  const vars: Props = {};
  for (const b of blocks(themesCss)) {
    if (b.selectors.some((s) => s === `[data-nk-theme='${theme}']` || (theme === 'dark' && s === ':root:not([data-nk-theme])'))) Object.assign(vars, b.props);
  }
  return vars;
}

/** Propriedades da regra cujo seletor é exatamente `selector` em uma folha de componente. */
function rule(source: string, selector: string): Props {
  const found = blocks(source).find((b) => b.selectors.includes(selector));
  if (!found) throw new Error(`regra não encontrada: ${selector}`);
  return found.props;
}

const over = (top: Rgba, base: Rgba): Rgba => [0, 1, 2].map((i) => top[i] * top[3] + base[i] * (1 - top[3])).concat(1) as Rgba;

/** Divide os argumentos de uma função CSS no nível de topo (vírgulas fora de parênteses). */
function args(inner: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of inner) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** Avalia uma cor CSS com as variáveis do tema: hex, rgb(a), transparent, var(--x[, fallback]) e color-mix(in srgb). */
function color(value: string, vars: Props, depth = 0): Rgba {
  if (depth > 20) throw new Error(`referência circular: ${value}`);
  const s = value.trim().toLowerCase();
  if (s === 'transparent') return [0, 0, 0, 0];
  if (s === '#fff' || s === 'white') return [255, 255, 255, 1];
  if (s === '#000' || s === 'black') return [0, 0, 0, 1];
  let m = /^#([0-9a-f]{6})$/.exec(s);
  if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), 1];
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(s);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  m = /^var\((.*)\)$/.exec(s);
  if (m) {
    const [name, fallback] = args(m[1]);
    if (name in vars) return color(vars[name], vars, depth + 1);
    if (fallback !== undefined) return color(fallback, vars, depth + 1);
    throw new Error(`variável não resolvida: ${name}`);
  }
  m = /^color-mix\(in srgb,(.*)\)$/.exec(s);
  if (m) {
    const [a, b] = args(m[1]);
    const pa = /^(.*)\s+([\d.]+)%$/.exec(a);
    const pb = /^(.*)\s+([\d.]+)%$/.exec(b);
    const wa = pa ? +pa[2] / 100 : pb ? 1 - +pb[2] / 100 : 0.5;
    const ca = color(pa ? pa[1] : a, vars, depth + 1);
    const cb = color(pb ? pb[1] : b, vars, depth + 1);
    // CSS Color 5: mistura com alfa pré-multiplicado.
    const alpha = ca[3] * wa + cb[3] * (1 - wa);
    if (alpha === 0) return [0, 0, 0, 0];
    const rgb = [0, 1, 2].map((i) => (ca[i] * ca[3] * wa + cb[i] * cb[3] * (1 - wa)) / alpha);
    return [...rgb, alpha] as Rgba;
  }
  throw new Error(`cor não suportada no teste: ${value}`);
}

function luminance([r, g, b]: Rgba): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg: Rgba, bg: Rgba): number {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** Contraste do texto `fg` sobre a camada `layer` (pode ser translúcida) aplicada em cima de `base`. */
const on = (fg: Rgba, layer: Rgba, base: Rgba) => {
  const bg = over(layer, base);
  return contrast(over(fg, bg), bg);
};

const MIN = 4.5;
const badgeCss = css('Badge/Badge.css');
const alertCss = css('Alert/Alert.css');
const BADGE_TONES = ['neutral', 'primary', 'accent', 'success', 'info', 'warning', 'danger'] as const;
const ALERT_TONES = ['info', 'success', 'warning', 'danger'] as const;

/** Mede todos os pares de um tema; devolve os que ficam abaixo do mínimo. */
function failures(theme: string): string[] {
  const v = themeVars(theme);
  const c = (x: string) => color(x, v);
  const none: Rgba = [0, 0, 0, 0];
  const bases: Record<string, Rgba> = {
    fundo: c('var(--nk-color-bg)'),
    superficie: c('var(--nk-color-surface)'),
    rebaixada: over(c('var(--nk-color-surface-sunken)'), c('var(--nk-color-bg)')),
  };
  const card = c('var(--nk-color-card)');
  const light = themes[theme as keyof typeof themes].mode === 'light';
  const results: Record<string, number> = {};
  const measure = (label: string, fg: Rgba, layer: Rgba, where: Record<string, Rgba>) => {
    for (const [name, base] of Object.entries(where)) results[`${label}/${name}`] = on(fg, layer, base);
  };

  // Texto secundário (descrições, hints) e muted (placeholders, contador do Textarea, divisores, metadados) — P-LIB-02
  measure('text-secondary', c('var(--nk-color-text-secondary)'), none, { ...bases, card });
  measure('text-muted', c('var(--nk-color-text-muted)'), none, bases);
  // Acento como texto (eyebrow do SectionHeader, Link accent, Button outline) — P-LIB-01. No claro o card é rosado.
  measure('accent', c('var(--nk-color-accent)'), none, light ? { ...bases, card } : bases);

  // Badge soft e outline — P-LIB-07
  const badgeBase = rule(badgeCss, '.nk-badge');
  for (const tone of BADGE_TONES) {
    // neutral = valores da regra base (.nk-badge)
    const props = { ...badgeBase, ...(tone === 'neutral' ? {} : rule(badgeCss, `.nk-badge--${tone}`)) };
    const fg = c(props['--nk-badge-color']);
    measure(`badge ${tone} soft`, fg, c(props['--nk-badge-soft']), bases);
    measure(`badge ${tone} outline`, fg, none, bases);
  }

  // Alert: título (text) e corpo — P-LIB-04 e P-LIB-05
  const alertBase = rule(alertCss, '.nk-alert');
  const body = rule(alertCss, '.nk-alert__body').color;
  for (const tone of ALERT_TONES) {
    const props = { ...alertBase, ...(tone === 'info' ? {} : rule(alertCss, `.nk-alert--${tone}`)) };
    const vv = { ...v, ...props };
    const layer = color(props['--nk-alert-bg'], vv);
    measure(`alert ${tone} titulo`, color(alertBase.color, vv), layer, bases);
    measure(`alert ${tone} corpo`, color(body, vv), layer, bases);
  }

  return Object.entries(results)
    .filter(([, r]) => r < MIN)
    .map(([k, r]) => `${k} ${r.toFixed(2)}:1`);
}

describe('Contraste de texto em todos os temas (WCAG AA 4,5:1)', () => {
  for (const theme of themeNames) {
    it(`${theme}: texto secundário/muted, acento, Badge soft/outline e Alert`, () => {
      expect(failures(theme), `${theme}: abaixo de ${MIN}:1`).toEqual([]);
    });
  }

  it('o avaliador reproduz as medições anteriores do navegador', () => {
    // P-LIB-01 (axe): #c2466d sobre #f8f3f5 = 4,35:1
    expect(contrast(color('#c2466d', {}), color('#f8f3f5', {}))).toBeCloseTo(4.36, 1);
    // color-mix com transparent = mesma cor com alfa
    expect(color('color-mix(in srgb, #ff0000 25%, transparent)', {})).toEqual([255, 0, 0, 0.25]);
  });

  it('a paleta de tokens.ts espelha themes.css (acento e fundo)', () => {
    for (const theme of themeNames) {
      const v = themeVars(theme);
      expect(v['--nk-color-accent'].toLowerCase(), theme).toBe(themes[theme].palette.accent.toLowerCase());
      expect(v['--nk-color-bg'].toLowerCase(), theme).toBe(themes[theme].palette.bg.toLowerCase());
    }
  });
});
