import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import './Dialog.css';

/** Como o pedido de fechamento chegou. Todas as formas passam pela mesma regra (`busy`). */
export type DialogCloseReason = 'escape' | 'close-button' | 'backdrop' | 'cancel';

/** Destino de foco: elemento, ref ou função que o devolve na hora (o elemento pode ter sido recriado). */
export type FocusTarget = HTMLElement | null | RefObject<HTMLElement | null> | (() => HTMLElement | null | undefined);

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  open: boolean;
  /**
   * Pedido de fechamento (Esc, botão "Fechar", fundo ou `requestClose('cancel')` do conteúdo). NÃO é chamado
   * enquanto `busy`: durante um envio nenhuma forma de fechamento tem efeito.
   */
  onClose: (reason: DialogCloseReason) => void;
  title: ReactNode;
  /** Texto de apoio abaixo do título (vira `aria-describedby`). */
  description?: ReactNode;
  /** Ações no rodapé (ex.: Cancelar / Confirmar). */
  footer?: ReactNode;
  /**
   * Envio em curso: Esc, fundo e "Fechar" ficam sem efeito (o botão fica desabilitado) e o diálogo recebe
   * `aria-busy`. Se o foco estava num controle que ficou desabilitado, ele vai para o próprio diálogo.
   */
  busy?: boolean;
  /** `alertdialog` para confirmações que exigem resposta. Padrão: `dialog`. */
  role?: 'dialog' | 'alertdialog';
  /** Elemento que recebe o foco ao abrir. Padrão: o primeiro controle do conteúdo; sem nenhum, o próprio diálogo. */
  initialFocus?: FocusTarget;
  /**
   * Para onde o foco volta ao fechar. Padrão: o elemento que tinha o foco ao abrir. Se esse destino não existir mais
   * (ex.: o botão que abriu sumiu depois da ação) ou estiver inativo, o foco vai para `fallbackFocus` e, sem ele, para o
   * `<main>` da página — nunca fica perdido no `<body>`.
   */
  returnFocus?: FocusTarget;
  /** Destino quando `returnFocus` (ou o elemento que abriu) não pode receber o foco. Padrão: `<main>`. */
  fallbackFocus?: FocusTarget;
  /** Fechar ao clicar no fundo. Padrão: true (sempre sujeito a `busy`). */
  closeOnBackdrop?: boolean;
  /** Mostra o botão "Fechar" no cabeçalho. Padrão: true. */
  showCloseButton?: boolean;
  closeLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Pilha de diálogos abertos: só o do topo responde a teclado. */
const stack: symbol[] = [];

function resolve(target: FocusTarget | undefined): HTMLElement | null {
  if (!target) return null;
  if (typeof target === 'function') return target() ?? null;
  if (target instanceof HTMLElement) return target;
  return (target as RefObject<HTMLElement | null>).current ?? null;
}

const FORM_CONTROL = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'FIELDSET']);

/**
 * Desabilitado, inclusive por herança: dentro de um `<fieldset disabled>` (exceto na primeira `<legend>` dele), como
 * define o HTML para controles de formulário.
 */
function disabled(el: HTMLElement): boolean {
  if (!FORM_CONTROL.has(el.tagName)) return false;
  if ((el as HTMLButtonElement).disabled) return true;
  for (let f = el.parentElement?.closest('fieldset'); f; f = f.parentElement?.closest('fieldset')) {
    if (!(f as HTMLFieldSetElement).disabled) continue;
    const legend = Array.from(f.children).find((c) => c.tagName === 'LEGEND');
    if (!legend || !legend.contains(el)) return true;
  }
  return false;
}

/** Visível: `checkVisibility` quando existe (Chromium); senão, nenhum ancestral com display:none/visibility:hidden. */
function visible(el: HTMLElement): boolean {
  const check = (el as HTMLElement & { checkVisibility?: (o?: object) => boolean }).checkVisibility;
  if (typeof check === 'function') return check.call(el, { visibilityProperty: true });
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    const s = window.getComputedStyle(n);
    if (s.display === 'none' || (n === el && s.visibility === 'hidden')) return false;
  }
  return true;
}

/** Pode receber foco agora: no documento, habilitado (também por herança), visível, fora de região inert/oculta. */
function focusable(el: HTMLElement | null): el is HTMLElement {
  if (!el || !el.isConnected || el === document.body) return false;
  if (disabled(el)) return false;
  if (el.closest('[inert], [hidden], [aria-hidden="true"]')) return false;
  return visible(el);
}

/** Tenta focar e confere se o foco foi de fato aplicado. */
function tryFocus(el: HTMLElement | null | undefined): boolean {
  if (!focusable(el ?? null)) return false;
  el!.focus();
  return document.activeElement === el;
}

/**
 * Paradas de Tab dentro de `root`, na ordem do documento, só com destinos disponíveis. Um grupo de rádios nativos
 * (mesmo `name`) é UMA parada, como no navegador: entra pelo marcado; sem nenhum marcado, pelo primeiro (Tab) ou
 * pelo último (Shift+Tab). As setas dentro do grupo continuam nativas.
 */
type Stop = { members: HTMLElement[] };
function tabStops(root: HTMLElement): Stop[] {
  const stops: Stop[] = [];
  const groups = new Map<string, Stop>();
  for (const el of Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))) {
    if (!focusable(el)) continue;
    const input = el as HTMLInputElement;
    if (el.tagName === 'INPUT' && input.type === 'radio' && input.name) {
      const key = `${input.form ? 'f' : 'r'}:${input.name}`;
      const g = groups.get(key);
      if (g) {
        g.members.push(el);
        continue;
      }
      const stop = { members: [el] };
      groups.set(key, stop);
      stops.push(stop);
      continue;
    }
    stops.push({ members: [el] });
  }
  return stops;
}
function entry(stop: Stop, backwards: boolean): HTMLElement {
  const checked = stop.members.find((m) => (m as HTMLInputElement).checked);
  return checked ?? (backwards ? stop.members[stop.members.length - 1] : stop.members[0]);
}
/** Foca a primeira parada disponível a partir de `from` (no sentido dado); sem nenhuma, o próprio painel. */
function focusStop(stops: Stop[], from: number, backwards: boolean, panel: HTMLElement) {
  const n = stops.length;
  for (let k = 0; k < n; k++) {
    const i = (((from + (backwards ? -k : k)) % n) + n) % n;
    if (tryFocus(entry(stops[i], backwards))) return;
  }
  panel.focus();
}

function focusMain(): boolean {
  const main = document.querySelector<HTMLElement>('main');
  if (!main || main.closest('[inert]')) return false;
  // o <main> não é focável por padrão: torna-o focável só por programa (sem entrar na ordem de Tab)
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  main.focus();
  return document.activeElement === main;
}

/**
 * Diálogo modal (renderizado em portal no `<body>`).
 *
 * - `role="dialog"` (ou `alertdialog`) com `aria-modal`, rotulado pelo título e descrito pela descrição;
 * - ao abrir: o resto da página fica `inert` e o foco vai para `initialFocus`, o primeiro controle ou o próprio diálogo;
 * - Tab e Shift+Tab circulam dentro do diálogo, só por destinos disponíveis (habilitados, inclusive por `<fieldset>`,
 *   visíveis, fora de `hidden`/`inert`); um grupo de rádios é uma parada, como no navegador;
 * - Esc, "Fechar", o fundo e o "Cancelar" do conteúdo pedem fechamento por `onClose` — todos bloqueados durante `busy`;
 * - ao fechar (ou desmontar): a página volta a ficar ativa e o foco volta a `returnFocus`/elemento que abriu; se ele
 *   sumiu ou ficou inativo, vai para `fallbackFocus` ou para o `<main>`.
 * O diálogo não decide o resultado de nenhuma ação: só apresenta e respeita `busy`.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  busy = false,
  role = 'dialog',
  initialFocus,
  returnFocus,
  fallbackFocus,
  closeOnBackdrop = true,
  showCloseButton = true,
  closeLabel = 'Fechar',
  size = 'md',
  className,
  children,
  ...rest
}: DialogProps) {
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const token = useRef(Symbol('dialog'));
  // valores atuais lidos pelos efeitos sem reabrir o diálogo
  const latest = useRef({ onClose, busy, closeOnBackdrop, returnFocus, fallbackFocus, initialFocus });
  latest.current = { onClose, busy, closeOnBackdrop, returnFocus, fallbackFocus, initialFocus };

  if (open && !containerRef.current && typeof document !== 'undefined') {
    const c = document.createElement('div');
    c.className = 'nk-dialog-root';
    containerRef.current = c;
  }

  const requestClose = (reason: DialogCloseReason) => {
    if (latest.current.busy) return;
    latest.current.onClose(reason);
  };

  // abrir: monta o portal, deixa o resto inert, empilha, guarda quem abriu e põe o foco dentro.
  // fechar/desmontar: desfaz na ordem inversa e devolve o foco (depois de a página deixar de ser inert).
  useLayoutEffect(() => {
    if (!open) return;
    const container = containerRef.current!;
    document.body.appendChild(container);
    const active = document.activeElement as HTMLElement | null;
    opener.current = active && active !== document.body ? active : null;

    const marked: HTMLElement[] = [];
    for (const child of Array.from(document.body.children) as HTMLElement[]) {
      if (child === container || child.hasAttribute('inert')) continue;
      child.setAttribute('inert', '');
      marked.push(child);
    }
    const me = token.current;
    stack.push(me);

    // foco inicial: initialFocus; senão o primeiro destino DISPONÍVEL do conteúdo e depois do rodapé (o "Fechar" do
    // cabeçalho fica por último); sem nenhum, o próprio painel. Cada tentativa confere se o foco foi aplicado.
    const panel = panelRef.current;
    if (panel && !tryFocus(resolve(latest.current.initialFocus))) {
      const areas = ['.nk-dialog__body', '.nk-dialog__footer', '.nk-dialog__header'];
      const done = areas.some((sel) => {
        const area = panel.querySelector<HTMLElement>(sel);
        return area ? tabStops(area).some((s) => tryFocus(entry(s, false))) : false;
      });
      if (!done) panel.focus();
    }

    return () => {
      const i = stack.lastIndexOf(me);
      if (i >= 0) stack.splice(i, 1);
      for (const el of marked) el.removeAttribute('inert');
      container.remove();
      const { returnFocus: rf, fallbackFocus: ff } = latest.current;
      const candidates = [resolve(rf), rf ? null : opener.current];
      for (const c of candidates) {
        if (focusable(c)) {
          c.focus();
          if (document.activeElement === c) return;
        }
      }
      const fb = resolve(ff);
      if (focusable(fb)) {
        fb.focus();
        if (document.activeElement === fb) return;
      }
      focusMain();
    };
  }, [open]);

  // teclado: Esc e prisão de foco, só no diálogo do topo
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token.current) return;
      const panel = panelRef.current;
      if (!panel) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose('escape');
        return;
      }
      if (e.key !== 'Tab') return;
      // o diálogo conduz todo o Tab: só destinos disponíveis, grupos de rádio como uma parada, circular
      e.preventDefault();
      const stops = tabStops(panel);
      if (!stops.length) {
        panel.focus();
        return;
      }
      const a = document.activeElement as HTMLElement | null;
      const at = a ? stops.findIndex((s) => s.members.includes(a)) : -1;
      const back = e.shiftKey;
      const from = at < 0 ? (back ? stops.length - 1 : 0) : at + (back ? -1 : 1);
      focusStop(stops, from, back, panel);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // envio começou e o foco estava num controle que ficou desabilitado (ou saiu): o foco fica no próprio diálogo
  useEffect(() => {
    if (!open || !busy) return;
    const panel = panelRef.current;
    const a = document.activeElement as HTMLElement | null;
    if (panel && (!a || !panel.contains(a) || (a !== panel && !focusable(a)))) panel.focus();
  }, [open, busy]);

  if (!open || !containerRef.current) return null;

  return createPortal(
    <div className="nk-dialog__layer">
      <div
        className="nk-dialog__backdrop"
        aria-hidden="true"
        onClick={() => {
          if (latest.current.closeOnBackdrop) requestClose('backdrop');
        }}
      />
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description != null ? descriptionId : undefined}
        aria-busy={busy || undefined}
        tabIndex={-1}
        className={cx('nk-dialog', `nk-dialog--${size}`, className)}
        {...rest}
      >
        <div className="nk-dialog__header">
          <div className="nk-dialog__heading">
            <h2 id={titleId} className="nk-dialog__title">
              {title}
            </h2>
            {description != null && (
              <p id={descriptionId} className="nk-dialog__description">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button
              className="nk-dialog__close"
              variant="ghost"
              size="sm"
              icon="close"
              aria-label={closeLabel}
              disabled={busy}
              onClick={() => requestClose('close-button')}
            />
          )}
        </div>
        {children != null && <div className="nk-dialog__body">{children}</div>}
        {footer != null && <div className="nk-dialog__footer">{footer}</div>}
      </div>
    </div>,
    containerRef.current,
  );
}
