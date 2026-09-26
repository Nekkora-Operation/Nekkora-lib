# nekkora-lib

Design system do **Nekkora** em React — tema dark *"Sofisticado, imersivo e focado em produtividade"* e um tema claro com a mesma identidade.
Foco em componentes visuais configuráveis por props: tamanho, variante, ícones, máscaras, estados.

| Token | Dark (principal) | Light | Uso |
|---|---|---|---|
| `--nk-color-bg` | `#180C1A` | `#F8F3F5` | Fundo |
| `--nk-color-surface` | `#20222F` | `#FFFFFF` | Superfície |
| `--nk-color-card` | `#48213B` | `#F6E9EE` | Card |
| `--nk-color-primary` | `#603C52` | `#603C52` | Primário |
| `--nk-color-secondary` | `#765067` | `#765067` | Secundário |
| `--nk-color-highlight` | `#FADCD5` | `#48213B` | Destaque |
| `--nk-color-text` | `#E8E2E7` | `#2A1A28` | Texto |
| `--nk-color-text-secondary` | `#94A3B8` | `#64566A` | Texto secundário |
| `--nk-color-accent` | `#F29BB2` | `#C2466D` | CTA / gráficos |

No tema claro o acento rosa é mais profundo para manter contraste AA sobre fundo branco.

Também há tokens de status (`success`, `info`, `warning`, `danger`), tipografia (Inter), espaçamento (base 4px), raios, sombras e alturas de controle — todos em `src/tokens/tokens.css`.

## Instalação e uso

```bash
npm i github:Nekkora-Operation/Nekkora-lib   # o script prepare gera o dist/ na instalação
```

```tsx
import 'nekkora-lib/styles.css';
import { Button, Input } from 'nekkora-lib';

// Aplique a classe nk-root no <body> (ou num wrapper) para fonte, cor e fundo base.
<Input label="CPF" mask="cpf" leftIcon="id-card" />
<Button leftIcon="plus">Nova automação</Button>
```

## Temas (dark / light)

Os componentes leem apenas CSS vars; trocar o tema é só mudar `data-nk-theme` — nenhum componente precisa de prop.

```tsx
import { ThemeProvider, useTheme } from 'nekkora-lib';

// Aplica no <html>, lembra a escolha no localStorage e aceita "system" (prefers-color-scheme)
<ThemeProvider target="document" defaultTheme="dark" storageKey="nk-theme">
  <App />
</ThemeProvider>

// Alternar em qualquer lugar
const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
<Button variant="ghost" icon={resolvedTheme === 'dark' ? 'sun' : 'moon'} onClick={toggleTheme} aria-label="Alternar tema" />

// Temas aninhados: uma área clara dentro do app escuro
<ThemeProvider theme="light"><Card>...</Card></ThemeProvider>
```

Sem React: `<html data-nk-theme="light" class="nk-root">`. Os hex de cada tema também estão em JS: `darkColors`, `lightColors`, `themes`.

## Desenvolvimento

```bash
npm install
npm run dev              # playground com todos os componentes e seletor de tema (http://localhost:5173)
npm test                 # testes (vitest)
npm run typecheck
npm run build            # gera dist/ (ESM + CJS + CSS + tipos)
```

## Componentes

### Font / Tipografia — `Text`, `Heading`
```tsx
<Text variant="display|h1|h2|h3|h4|body-lg|body|body-sm|caption|overline|code"
      color="default|secondary|muted|accent|highlight|success|info|warning|danger"
      weight="regular|medium|semibold|bold" align="left|center|right" truncate gradient as="span" />
<Heading level={2}>Execuções recentes</Heading>
```

### Ícones — `Icon`
```tsx
<Icon name="search" size="xs|sm|md|lg|xl" /> // ou size={28}
<Icon name="loader" spin />
<Icon name="alert" color="var(--nk-color-warning)" strokeWidth={2} label="Atenção" />
```
Lista completa em `iconNames`. Todas as props `leftIcon`/`rightIcon`/`icon` aceitam o **nome** do ícone ou qualquer `ReactNode`.

### Button
```tsx
<Button variant="primary|secondary|outline|ghost|danger" size="sm|md|lg"
        leftIcon="plus" rightIcon="arrow-right" loading fullWidth pill disabled>Salvar</Button>
<Button icon="more-horizontal" aria-label="Ações" variant="ghost" />   // somente ícone
```

### Link
```tsx
<Link href="/execucoes" arrow>Ver todas</Link>
<Link variant="accent|default|subtle" size="sm|md|lg" underline="always|hover|none"
      leftIcon="file" external disabled as={RouterLink} />
```

### Input (com máscaras)
```tsx
<Input label="CPF" mask="cpf" />
<Input label="CNPJ" mask="cnpj" />
<Input label="Documento" mask="cpfCnpj" />          // alterna CPF/CNPJ pelo tamanho
<Input label="Telefone" mask="phone" />             // (99) 9999-9999 ↔ (99) 99999-9999
<Input label="CEP" mask="cep" />  <Input mask="date" />
<Input label="Placa" mask="AAA-9*99" />             // padrão livre: 9 dígito · A letra · * alfanumérico

<Input size="sm|md|lg" variant="default|filled|ghost"
       leftIcon="search" rightIcon="calendar" prefix="R$" suffix="kg" shortcut="Ctrl K"
       clearable type="password" hint="Ajuda" error="Mensagem de erro" required disabled
       onValueChange={(masked, raw) => {}} />
```
As funções também estão disponíveis avulsas: `formatWithMask`, `formatCPF`, `formatCNPJ`, `formatPhone`, `applyMask`, `unmask`.

### Select / Option / OptionGroup
```tsx
<Select label="Período" leftIcon="calendar" size="sm|md|lg" placeholder="Selecione"
        options={[{ value: '7', label: 'Últimos 7 dias' }, { label: 'Grupo', options: [...] }]} />

<Select label="Agente" error="Obrigatório">
  <OptionGroup label="Windows">
    <Option value="agt-01">AGT-01</Option>
    <Option value="agt-02" disabled>AGT-02</Option>
  </OptionGroup>
</Select>
```

### Containers — `Container`, `Card` (+ `CardHeader`, `CardBody`, `CardFooter`), `Stack`, `Grid`
```tsx
<Container size="sm|md|lg|xl|fluid" padding="none|sm|md|lg">
  <Grid minColumnWidth="220px" gap={4}>           // ou columns={3} / columns="2fr 1fr"
    <Card variant="surface|raised|outlined|glow" padding="none|sm|md|lg" interactive>
      <CardHeader icon="chart" title="Execuções" subtitle="Hoje" action={<Link arrow>Ver todas</Link>} divider />
      <CardBody>...</CardBody>
      <CardFooter><Button>OK</Button></CardFooter>
    </Card>
  </Grid>
  <Stack direction="row" gap={3} align="center" justify="space-between" wrap>...</Stack>
</Container>
```

### Fieldset
```tsx
<Fieldset legend="Dados da empresa" description="..." icon="building"
          variant="default|plain|divided" columns={1|2|3|4} action={<Button size="sm">Editar</Button>} disabled>
  <Input label="CNPJ" mask="cnpj" />
  <Input label="Telefone" mask="phone" />
</Fieldset>
```

### Tabelas — `Table` (orientada a dados) ou primitivos
```tsx
<Table
  columns={[
    { key: 'processo', header: 'Processo' },
    { key: 'status', header: 'Status', render: (r) => <Badge tone="success">{r.status}</Badge> },
    { key: 'inicio', header: 'Início', muted: true, align: 'right', width: 100 },
  ]}
  data={rows} rowKey="id"
  size="sm|md|lg" striped hoverable stickyHeader maxHeight={320} bordered
  loading emptyMessage="Nenhuma execução" onRowClick={(row) => {}} />

<TableRoot bordered>
  <TableHead><TableRow><TableHeaderCell>Tipo</TableHeaderCell></TableRow></TableHead>
  <TableBody><TableRow selected><TableCell muted>Financeiro</TableCell></TableRow></TableBody>
</TableRoot>
```

### Badge (status)
```tsx
<Badge tone="success|info|danger|warning|accent|neutral" variant="soft|solid|outline" size="sm|md" dot icon="star">Concluído</Badge>
```

## Estrutura

```
src/
  tokens/        tokens.css (CSS vars dos temas dark e light) e tokens.ts
  utils/         máscaras, cx, renderIcon
  components/    ThemeProvider, Icon, Typography, Button, Link, Badge, Field, Input, Select,
                 Container, Card, Layout (Stack/Grid), Fieldset, Table
playground/      app Vite que demonstra todos os componentes e props
```
