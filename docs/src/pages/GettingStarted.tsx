import { Card, CardHeader, Grid, Link, Logo, Stack, Text } from 'nekkora-lib';
import { CodeBlock } from '../ui/CodeBlock';
import { PageHeader, Section } from '../ui/Page';

export function GettingStarted() {
  return (
    <>
      <Logo size={56} tagline />
      <PageHeader
        title="nekkora-lib"
        tag="v0.1"
        description="Design system do Nekkora em React: componentes visuais configuráveis por props, com 6 temas de cor."
      />

      <Section title="Instalação">
        <CodeBlock title="terminal" code="npm i github:Nekkora-Operation/Nekkora-lib" />
        <Text color="secondary">
          O script <Text variant="code">prepare</Text> gera o <Text variant="code">dist/</Text> automaticamente na
          instalação. <Text variant="code">react</Text> e <Text variant="code">react-dom</Text> (18+) são peer dependencies.
        </Text>
      </Section>

      <Section title="Uso">
        <CodeBlock
          title="main.tsx"
          code={`import 'nekkora-lib/styles.css';
import { ThemeProvider } from 'nekkora-lib';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider target="document" defaultTheme="dark" storageKey="nk-theme">
    <App />
  </ThemeProvider>,
);`}
        />
        <CodeBlock
          title="App.tsx"
          code={`import { Button, Input } from 'nekkora-lib';

export function App() {
  return (
    <>
      <Input label="CPF" mask="cpf" leftIcon="id-card" />
      <Button leftIcon="plus">Nova automação</Button>
    </>
  );
}`}
        />
      </Section>

      <Section title="Princípios">
        <Grid minColumnWidth="220px" gap={4}>
          <Card>
            <CardHeader icon="edit" title="Configurável por props" />
            <Text variant="body-sm" color="secondary">
              Tamanho, variante, ícones, máscaras e estados são todos parâmetros — sem CSS extra.
            </Text>
          </Card>
          <Card>
            <CardHeader icon="layers" title="Tokens em CSS vars" />
            <Text variant="body-sm" color="secondary">
              Cores, espaço, raios e tipografia em variáveis <Text variant="code">--nk-*</Text>, fáceis de sobrescrever.
            </Text>
          </Card>
          <Card>
            <CardHeader icon="sakura" title="6 temas" />
            <Text variant="body-sm" color="secondary">
              Troque o tema sem tocar nos componentes. <Link href="#/temas" arrow>Ver temas</Link>
            </Text>
          </Card>
        </Grid>
      </Section>

      <Section title="Desenvolvimento">
        <CodeBlock
          title="terminal"
          code={`npm install
npm run dev          # esta documentação em http://localhost:5173
npm test             # testes (vitest)
npm run build        # dist/ (ESM + CJS + CSS + tipos)
npm run build:docs   # documentação estática em docs/dist`}
        />
        <Stack gap={1}>
          <Text color="secondary">
            Cada exemplo desta documentação é um arquivo em <Text variant="code">docs/src/examples/</Text>: o
            código exibido é exatamente o que está rodando.
          </Text>
        </Stack>
      </Section>
    </>
  );
}
