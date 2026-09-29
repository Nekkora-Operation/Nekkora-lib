import { Badge, Button, Stack, Text, ThemeProvider, themeList, useTheme, type ThemeDefinition } from 'nekkora-lib';
import { CodeBlock } from '../ui/CodeBlock';
import { Example } from '../ui/Example';
import { PageHeader, Section } from '../ui/Page';
import { PropsTable } from '../ui/PropsTable';

function ThemeCard({ theme }: { theme: ThemeDefinition }) {
  const { resolvedTheme, setTheme } = useTheme();
  const active = resolvedTheme === theme.name;
  return (
    <ThemeProvider theme={theme.name} className="doc-theme-card">
      <Stack gap={4}>
        <Stack direction="row" justify="space-between" align="flex-start" gap={3}>
          <div>
            <Stack direction="row" gap={2} align="center">
              <Text variant="h4" as="h3">{theme.label}</Text>
              <Badge size="sm">{theme.mode === 'dark' ? 'escuro' : 'claro'}</Badge>
            </Stack>
            <Text variant="body-sm" color="secondary" style={{ marginTop: 4 }}>{theme.description}</Text>
            <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
              data-nk-theme="{theme.name}"
            </Text>
          </div>
          <Button size="sm" variant={active ? 'primary' : 'outline'} leftIcon={active ? 'check' : undefined} onClick={() => setTheme(theme.name)}>
            {active ? 'Em uso' : 'Usar'}
          </Button>
        </Stack>
        <div className="doc-swatches">
          {Object.entries(theme.palette).map(([name, hex]) => (
            <div key={name} className="doc-swatch" title={`${name} ${hex}`}>
              <div style={{ background: hex }} />
              <Text variant="caption" color="secondary">{name}</Text>
              <Text variant="caption" weight="medium">{hex}</Text>
            </div>
          ))}
        </div>
        <Stack direction="row" gap={2} align="center" wrap>
          <Button size="sm" leftIcon="plus">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Badge tone="success">Concluído</Badge>
          <Badge tone="info">Em execução</Badge>
          <Badge tone="danger">Falhou</Badge>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

export function Themes() {
  return (
    <>
      <PageHeader
        title="Temas"
        description="Seis templates de cor. Cada tema declara só a paleta; bordas, hovers, sombras, foco e status são derivados pelo modo (escuro/claro)."
      />
      <Section title="Templates">
        <div className="doc-themes">
          {themeList.map((t) => (
            <ThemeCard key={t.name} theme={t} />
          ))}
        </div>
      </Section>

      <Section title="Aplicando um tema">
        <CodeBlock
          title="main.tsx"
          code={`<ThemeProvider target="document" defaultTheme="sakura-dark" storageKey="nk-theme">
  <App />
</ThemeProvider>

// "system" segue o SO; toggleTheme() alterna dentro do par
<ThemeProvider theme="system" pair={{ dark: 'midnight-blue', light: 'porcelain-light' }}>
  <App />
</ThemeProvider>`}
        />
        <Text color="secondary">
          Sem React, basta o atributo: <Text variant="code">{'<html data-nk-theme="midnight-blue" class="nk-root">'}</Text>
        </Text>
      </Section>

      <Example name="themes/Hook" title="Hook useTheme" description="Lê e altera o tema atual — este seletor muda o tema desta documentação." />
      <Example name="themes/Toggle" title="ThemeToggle" description="Botão de ícone para alternar entre os temas escuro e claro do par do ThemeProvider (sol no escuro, lua no claro)." />
      <Example name="themes/Nested" title="Temas aninhados" description="Um ThemeProvider dentro de outro aplica um tema só naquela área." />

      <PropsTable
        title="ThemeProvider"
        rows={[
          ['theme', "ThemeName | 'system'", '', 'Tema controlado.'],
          ['defaultTheme', "ThemeName | 'system'", "'dark'", 'Tema inicial no modo não controlado.'],
          ['onThemeChange', '(theme) => void', '', 'Chamado quando o tema muda.'],
          ['storageKey', 'string', '', 'Persiste a escolha no localStorage.'],
          ['pair', '{ dark: ThemeName; light: ThemeName }', "{ dark: 'dark', light: 'light' }", 'Temas usados por "system" e por toggleTheme().'],
          ['target', "'wrapper' | 'document'", "'wrapper'", 'Renderiza uma div com o tema ou aplica no <html>.'],
        ]}
      />
      <PropsTable
        title="useTheme()"
        rows={[
          ['theme', "ThemeName | 'system'", '', 'Preferência escolhida.'],
          ['resolvedTheme', 'ThemeName', '', 'Tema efetivamente aplicado.'],
          ['mode', "'dark' | 'light'", '', 'Modo do tema aplicado.'],
          ['setTheme', '(theme) => void', '', 'Troca o tema.'],
          ['toggleTheme', '() => void', '', 'Alterna entre os temas de pair.'],
        ]}
      />

      <Section title="Criando um tema">
        <Text color="secondary">
          Em <Text variant="code">src/tokens/themes.css</Text>, adicione o seletor à lista do modo e declare a paleta.
          Depois registre o tema em <Text variant="code">themes</Text> (<Text variant="code">src/tokens/tokens.ts</Text>).
        </Text>
        <CodeBlock
          title="themes.css"
          code={`[data-nk-theme='meu-tema'] {
  --nk-color-bg: #0f1412;
  --nk-color-surface: #17201c;
  --nk-color-card: #22302a;
  --nk-color-primary: #3f6b5a;
  --nk-color-secondary: #5c8a78;
  --nk-color-highlight: #bfe3d3;
  --nk-color-text: #eef5f2;
  --nk-color-accent: #7fd1b0;
  --nk-color-accent-hover: #9adcc1;
  --nk-color-accent-active: #66bf9c;
}`}
        />
      </Section>
    </>
  );
}
