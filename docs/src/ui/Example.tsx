import { useState, type ReactNode } from 'react';
import { Button, Text } from 'nekkora-lib';
import { CodeBlock, CopyButton } from './CodeBlock';
import { examples } from './examples';

export interface ExampleProps {
  /** Caminho do exemplo em src/examples, sem extensão (ex.: "button/Variants"). */
  name: string;
  title?: string;
  description?: ReactNode;
}

export function Example({ name, title, description }: ExampleProps) {
  const [showCode, setShowCode] = useState(true);
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
          <Component />
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
