import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Logo.css';

export type LogoVariant = 'full' | 'symbol' | 'wordmark' | 'app';
/** brand = cores do tema · mono = uma cor (currentColor) · inverse = branco, para fundos preenchidos. */
export type LogoTone = 'brand' | 'mono' | 'inverse';

export interface LogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** full = símbolo + nome · symbol = só o gato de óculos · wordmark = só o nome · app = ícone de app. */
  variant?: LogoVariant;
  /** Altura do símbolo em px (o nome acompanha a proporção). */
  size?: number;
  tone?: LogoTone;
  /** Tagline abaixo do nome (variant="full"). true usa a tagline padrão. */
  tagline?: boolean | ReactNode;
  /** Nome acessível. */
  title?: string;
}

const DEFAULT_TAGLINE = 'AUTOMATE · OBSERVE · EVOLVE';

/** Símbolo Cat-Eye: óculos com orelhas de gato (Neko + Observability). */
function LogoSymbol({ height }: { height: number }) {
  return (
    <svg
      className="nk-logo__symbol"
      viewBox="14 31 100 67"
      height={height}
      width={(height * 100) / 67}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(0 -3.5)">
        <g className="nk-logo__frame" strokeWidth="6.5" strokeLinejoin="round">
          <path d="M38.26 55.58A20 20 0 1 1 20.3 72.03L19 40Z" />
          <path d="M89.74 55.58A20 20 0 1 0 107.7 72.03L109 40Z" />
        </g>
        <g className="nk-logo__ear" strokeWidth="2" strokeLinejoin="round">
          <path d="M21.5 46L24 61L32.5 55.5Z" />
          <path d="M106.5 46L104 61L95.5 55.5Z" />
        </g>
        <path className="nk-logo__bridge" d="M58.8 68.7Q64 63.5 69.2 68.7" fill="none" strokeWidth="6" strokeLinecap="round" />
        <ellipse className="nk-logo__pupil" cx="42.5" cy="76.5" rx="4.2" ry="9" />
        <ellipse className="nk-logo__pupil" cx="90.5" cy="76.5" rx="4.2" ry="9" />
        <circle className="nk-logo__glint" cx="44.6" cy="71.5" r="1.9" />
        <circle className="nk-logo__glint" cx="92.6" cy="71.5" r="1.9" />
        <path className="nk-logo__nose" d="M60 91.5H68L64 96.5Z" strokeWidth="2.4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Logotipo "nekkora": monolinear geométrico; o "o" é uma lente com pupila de gato. */
function Wordmark({ height }: { height: number }) {
  return (
    <svg
      className="nk-logo__wordmark"
      viewBox="-6 34 377 72"
      height={height}
      width={(height * 377) / 72}
      aria-hidden="true"
      focusable="false"
    >
      <g className="nk-logo__letters" fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 100V60M0 80A20 20 0 0 1 40 80V100" />
        <path d="M62 80H102A20 20 0 1 0 96.14 94.14" />
        <path d="M124 40V100M152 60L125.5 85M135 76L154 100" />
        <path d="M174 40V100M202 60L175.5 85M185 76L204 100" />
        <path d="M288 100V60M288 80A20 20 0 0 1 308 60" />
        <circle cx="345" cy="80" r="20" />
        <path d="M365 60V100" />
      </g>
      <circle className="nk-logo__lens-o" cx="246" cy="80" r="20" fill="none" strokeWidth="9" />
      <ellipse className="nk-logo__lens-pupil" cx="247.5" cy="80" rx="3.4" ry="9.5" />
    </svg>
  );
}

export const Logo = forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { variant = 'full', size = 32, tone = 'brand', tagline, title = 'Nekkora', className, style, ...rest },
  ref,
) {
  const tag = tagline === true ? DEFAULT_TAGLINE : tagline || null;

  return (
    <span
      ref={ref}
      role="img"
      aria-label={title}
      className={cx('nk-logo', `nk-logo--${variant}`, `nk-logo--${tone}`, className)}
      style={{ ['--nk-logo-size' as string]: `${size}px`, ...style }}
      {...rest}
    >
      {variant === 'app' ? (
        <span className="nk-logo__app">
          <LogoSymbol height={size * 0.5} />
        </span>
      ) : (
        <>
          {variant !== 'wordmark' && <LogoSymbol height={size} />}
          {variant !== 'symbol' && (
            <span className="nk-logo__text">
              <Wordmark height={variant === 'wordmark' ? size : size * 0.92} />
              {variant === 'full' && tag && <span className="nk-logo__tagline">{tag}</span>}
            </span>
          )}
        </>
      )}
    </span>
  );
});
