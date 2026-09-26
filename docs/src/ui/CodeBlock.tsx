import { useMemo, useState } from 'react';
import { highlight } from 'sugar-high';
import { Button } from 'nekkora-lib';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível */
    }
  };
  return (
    <Button size="sm" variant="ghost" leftIcon={copied ? 'check' : 'copy'} onClick={copy}>
      {copied ? 'Copiado' : 'Copiar'}
    </Button>
  );
}

export interface CodeBlockProps {
  code: string;
  /** Título exibido na barra (ex.: nome do arquivo). */
  title?: string;
  /** Sem barra superior e sem botão de copiar. */
  bare?: boolean;
}

export function CodeBlock({ code, title, bare }: CodeBlockProps) {
  const trimmed = code.trim();
  const html = useMemo(() => highlight(trimmed), [trimmed]);
  return (
    <div className="doc-code">
      {!bare && (
        <div className="doc-code__bar">
          <span className="doc-code__title">{title ?? 'tsx'}</span>
          <CopyButton text={trimmed} />
        </div>
      )}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
