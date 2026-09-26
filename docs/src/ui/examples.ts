import type { ComponentType } from 'react';

// Cada exemplo é um arquivo real: o mesmo módulo é renderizado e seu código-fonte é exibido.
const modules = import.meta.glob<ComponentType>('../examples/**/*.tsx', { eager: true, import: 'default' });
const sources = import.meta.glob<string>('../examples/**/*.tsx', { eager: true, query: '?raw', import: 'default' });

const key = (path: string) => path.replace('../examples/', '').replace(/\.tsx$/, '');

export const examples: Record<string, { Component: ComponentType; source: string }> = {};
for (const path of Object.keys(modules)) {
  examples[key(path)] = { Component: modules[path], source: sources[path] };
}
