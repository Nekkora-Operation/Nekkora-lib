import { useState, type ReactNode } from 'react';
import { Button, Text, useTheme } from 'nekkora-lib';
import { CodeBlock, CopyButton } from './CodeBlock';
import { examples } from './examples';

export interface ExampleProps {
  /** Caminho do exemplo em src/examples, sem extensão (ex.: "button/Variants"). */
  name: string;
  title?: string;
  description?: ReactNode;
  /**
   * Exemplo de página inteira: roda num iframe (frame.html), com documento próprio e largura real do quadro, em vez de
   * ser montado dentro desta página (evita landmarks aninhados, como dois <main>).
   */
  frame?: { height: number; title: string };
}

export function Example({ name, title, description, frame }: ExampleProps) {
  const [showCode, setShowCode] = useState(true);
  const [width, setWidth] = useState<'desktop' | 'celular'>('desktop');
  const { theme, mode } = useTheme();
  const frameTheme = theme === 'system' ? (mode === 'light' ? 'light' : 'dark') : theme;
  const entry = examples[name];
  if (!entry) return <Text color="danger">Exemplo não encontrado: {name}</Text>;
  const { Component, source } = entry;

  return (
    <section className="doc-example">
      {(title || description) && (
        <div className="doc-example__head">
          {title && <Text variant="h4" as="h3">{title}</Text>}
          {description && <Text color="secondary" variant="body-sm">{description}</Text>}
        </div>
      )}
      <div className="doc-example__box">
        <div className="doc-example__preview">
          {frame ? (
            <div className="doc-example__frame">
              <div className="doc-example__frame-bar" role="group" aria-label="Largura do quadro">
                <Button size="sm" variant={width === 'desktop' ? 'secondary' : 'ghost'} aria-pressed={width === 'desktop'} onClick={() => setWidth('desktop')}>
                  Desktop
                </Button>
                <Button size="sm" variant={width === 'celular' ? 'secondary' : 'ghost'} aria-pressed={width === 'celular'} onClick={() => setWidth('celular')}>
                  Celular (390 px)
                </Button>
              </div>
              <iframe
                className="doc-example__iframe"
                title={frame.title}
                src={`./frame.html?ex=${encodeURIComponent(name)}&theme=${encodeURIComponent(frameTheme)}`}
                style={{ height: frame.height, width: width === 'celular' ? 390 : '100%' }}
              />
            </div>
          ) : (
            <Component />
          )}
        </div>
        <div className="doc-code__bar doc-example__toolbar">
          <span className="doc-code__title">examples/{name}.tsx</span>
          <div>
            <CopyButton text={source.trim()} />
            <Button
              size="sm"
              variant="ghost"
              leftIcon={showCode ? 'chevron-up' : 'code'}
              onClick={() => setShowCode((v) => !v)}
            >
              {showCode ? 'Ocultar código' : 'Ver código'}
            </Button>
          </div>
        </div>
        {showCode && <CodeBlock code={source} bare />}
      </div>
    </section>
  );
}
