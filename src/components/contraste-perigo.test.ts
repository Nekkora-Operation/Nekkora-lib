/**
 * Contraste da variante de perigo do Button (usada pelo ConfirmDialog com tone="danger"), em TODOS os temas embutidos,
 * calculado a partir das próprias folhas de estilo — o jsdom não calcula cores, então o teste lê Button.css e
 * themes.css, resolve as variáveis por tema e compõe as cores translúcidas sobre cada fundo onde o botão pode estar.
 *
 * Critério: WCAG 2.x AA para texto normal (o rótulo tem 13–16 px, peso médio) = 4,5:1, nos estados com conteúdo
 * ativo — normal, foco (mesmas cores; o anel é do tema) e hover. Desabilitado e carregando são componentes inativos
 * (isentos pela WCAG 1.4.3). Medida real em navegador: auditoria axe do web DEPOIS da animação do diálogo.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { themeNames } from '../tokens/tokens';

const here = dirname(fileURLToPath(import.meta.url));
const themesCss = readFileSync(join(here, '../tokens/themes.css'), 'utf8');
const buttonCss = readFileSync(join(here, 'Button/Button.css'), 'utf8');

type Rgba = [number, number, number, number];

/** Blocos `seletores { propriedades }` de uma folha (sem aninhamento). */
function blocks(css: string): { selectors: string[]; props: Record<string, string> }[] {
  const out: { selectors: string[]; props: Record<string, string> }[] = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const props: Record<string, string> = {};
    for (const decl of m[2].split(';')) {
      const i = decl.indexOf(':');
      if (i > 0) props[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
    }
    out.push({ selectors: m[1].split(',').map((s) => s.trim()), props });
  }
  return out;
}

/** Variáveis de um tema: todos os blocos de themes.css que o selecionam, na ordem do arquivo. */
function themeVars(theme: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const b of blocks(themesCss)) {
    const hit = b.selectors.some((s) => s === `[data-nk-theme='${theme}']` || (theme === 'dark' && s === ':root:not([data-nk-theme])'));
    if (hit) Object.assign(vars, b.props);
  }
  return vars;
}

function resolve(value: string, vars: Record<string, string>, depth = 0): string {
  const m = /^var\((--[\w-]+)\)$/.exec(value.trim());
  if (!m) return value.trim();
  if (depth > 10 || !(m[1] in vars)) throw new Error(`variável não resolvida: ${m[1]}`);
  return resolve(vars[m[1]], vars, depth + 1);
}

function parseColor(c: string): Rgba {
  const s = c.trim().toLowerCase();
  if (s === '#fff' || s === '#ffffff' || s === 'white') return [255, 255, 255, 1];
  let m = /^#([0-9a-f]{6})$/.exec(s);
  if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), 1];
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(s);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  throw new Error(`cor não suportada no teste: ${c}`);
}

const over = (top: Rgba, base: Rgba): Rgba => [0, 1, 2].map((i) => top[i] * top[3] + base[i] * (1 - top[3])).concat(1) as Rgba;
const mix = (a: Rgba, wa: number, b: Rgba): Rgba => [0, 1, 2].map((i) => a[i] * wa + b[i] * (1 - wa)).concat(1) as Rgba;

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

/** Declarações da variante de perigo no Button.css (normal e hover). */
function dangerRules() {
  const all = blocks(buttonCss);
  const normal = all.find((b) => b.selectors.includes('.nk-button--danger'));
  const hover = all.find((b) => b.selectors.some((s) => s.startsWith('.nk-button--danger:hover')));
  if (!normal || !hover) throw new Error('regras da variante de perigo não encontradas');
  return { normal: normal.props, hover: hover.props };
}

const MIN = 4.5;

describe('Button variante de perigo: contraste do rótulo em todos os temas', () => {
  const { normal, hover } = dangerRules();

  for (const theme of themeNames) {
    it(`${theme}: normal/foco sobre fundo, superfície (diálogo), card e superfície rebaixada; hover sólido ≥ ${MIN}:1`, () => {
      const v = themeVars(theme);
      const bg = parseColor(resolve('var(--nk-color-bg)', v));
      const surface = parseColor(resolve('var(--nk-color-surface)', v));
      const card = parseColor(resolve('var(--nk-color-card)', v));
      // escuro: color-mix(bg 75%, #000); claro: = superfície (themes.css)
      const sunken = v['--nk-color-surface-sunken']?.startsWith('color-mix') ? mix(bg, 0.75, [0, 0, 0, 1]) : surface;
      const bases = { fundo: bg, superficie: surface, card, rebaixada: sunken };

      const fg = parseColor(resolve(normal.color, v));
      const soft = parseColor(resolve(normal.background, v));
      const results: Record<string, number> = {};
      for (const [name, base] of Object.entries(bases)) results[`normal/${name}`] = contrast(over(fg, over(soft, base)), over(soft, base));

      const hoverBg = parseColor(resolve(hover.background, v));
      const hoverFg = parseColor(resolve(hover.color, v));
      for (const [name, base] of Object.entries(bases)) results[`hover/${name}`] = contrast(over(hoverFg, over(hoverBg, base)), over(hoverBg, base));

      const failing = Object.entries(results)
        .filter(([, r]) => r < MIN)
        .map(([k, r]) => `${k} ${r.toFixed(2)}:1`);
      expect(failing, `${theme}: abaixo de ${MIN}:1`).toEqual([]);
    });
  }

  it('o teste reconhece o caso medido no navegador (dark, diálogo): #f0506e sobre #401e2c = 4,22:1', () => {
    expect(contrast(parseColor('#f0506e'), parseColor('#401e2c'))).toBeCloseTo(4.22, 2);
  });
});
