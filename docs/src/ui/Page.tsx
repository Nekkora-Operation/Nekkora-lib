import type { ReactNode } from 'react';
import { Badge, Stack, Text } from 'nekkora-lib';

export function PageHeader({ title, description, tag }: { title: string; description: ReactNode; tag?: string }) {
  return (
    <header className="doc-page__header">
      <Stack direction="row" gap={3} align="center">
        <Text variant="h1">{title}</Text>
        {tag && <Badge tone="accent">{tag}</Badge>}
      </Stack>
      <Text variant="body-lg" color="secondary">{description}</Text>
    </header>
  );
}

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="doc-section">
      {title && <Text variant="h3" as="h2">{title}</Text>}
      {children}
    </section>
  );
}
