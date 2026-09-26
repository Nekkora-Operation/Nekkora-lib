# nekkora-lib

Design system do **Nekkora** em React — tema dark *"Sofisticado, imersivo e focado em produtividade"* com tema claro e templates de cor (Sakura Dark, Midnight Blue, Porcelain Light, Sage Light).
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

Também há tokens de status (`success`, `info`, `warning`, `danger`), tipografia (Inter), espaçamento (base 4px), raios, sombras e alturas de controle — em `src/tokens/`. Veja também os templates de cor em [Temas](#temas-e-templates-de-cor).

## Marca

O símbolo **Cat-Eye** são óculos com orelhas de gato: *Neko* (猫, gato em japonês) + **O**bservability.
No logotipo, o "o" é uma lente com pupila de gato. NEKKORA = **N**etworked · **E**xecution · **K**nowledge ·
**K**ernel · **O**bservability · **R**eliability · **A**utomation.

```tsx
<Logo />                               // símbolo + nome, nas cores do tema
<Logo variant="symbol" size={24} />    // só o gato de óculos
<Logo variant="wordmark" />            // só o nome
<Logo variant="app" size={48} />       // ícone de app (fundo preenchido)
<Logo tone="inverse" />                // branco, para fundos preenchidos
<Logo tone="mono" />                   // uma cor (currentColor)
<Logo tagline />                       // AUTOMATE · OBSERVE · EVOLVE
```

SVGs para uso fora do React (fundo escuro e claro): `brand/nekkora-symbol-*.svg`, `brand/nekkora-wordmark-*.svg`,
`brand/nekkora-lockup-*.svg` e `brand/nekkora-app-icon.svg`.

## Documentação

A documentação mostra cada componente funcionando ao vivo, com o código aplicado ao lado e a tabela de props.

```bash
npm run dev          # http://localhost:5173
npm run build:docs   # site estático em docs/dist
```

A documentação roda só no ambiente local (não há publicação em nuvem). Para ver a versão de produção:
`npm run build:docs && npm run preview:docs`.

Cada exemplo é um arquivo em `docs/src/examples/<componente>/<Exemplo>.tsx`: o mesmo arquivo é renderizado e exibido
como código, então o código da documentação é sempre o que está rodando. Para documentar algo novo, crie o arquivo e
referencie com `<Example name="componente/Exemplo" />` na página em `docs/src/pages/`.

## Instalação e uso

Uso local, em outro projeto na mesma máquina (o script `prepare` gera o `dist/` na instalação):

```bash
# a partir da pasta do projeto que vai usar a lib
npm i ../Nekkora-lib            # instala direto da pasta local

# ou, para acompanhar alterações da lib sem reinstalar:
cd ../Nekkora-lib && npm run build && npm link
cd ../meu-projeto && npm link nekkora-lib
```

```tsx
import 'nekkora-lib/styles.css';
import { Button, Input } from 'nekkora-lib';

// Aplique a classe nk-root no <body> (ou num wrapper) para fonte, cor e fundo base.
<Input label="CPF" mask="cpf" leftIcon="id-card" />
<Button leftIcon="plus">Nova automação</Button>
```

## Temas e templates de cor

| Tema (`data-nk-theme`) | Modo | Perfil | bg · surface · card | primary · secondary | highlight · text | accent |
|---|---|---|---|---|---|---|
| `dark` (padrão) | escuro | Nekkora — principal | `#180C1A` `#20222F` `#48213B` | `#603C52` `#765067` | `#FADCD5` `#E8E2E7` | `#F29BB2` |
| `light` | claro | Nekkora sobre fundo claro | `#F8F3F5` `#FFFFFF` `#F6E9EE` | `#603C52` `#765067` | `#48213B` `#2A1A28` | `#C2466D` |
| `sakura-dark` | escuro | Identidade/autoral, rosa elegante | `#1B0C1A` `#2D222F` `#4B2138` | `#6D3C52` `#765D67` | `#FADCD5` `#F8F2F7` | `#F0A3B8` |
| `midnight-blue` | escuro | Técnico/profissional | `#0D1117` `#161B22` `#212936` | `#526D9E` `#7189B5` | `#AFC8F2` `#F2F5F8` | `#8FB0EA` |
| `porcelain-light` | claro | Neutro/institucional | `#F7F6F4` `#FFFFFF` `#ECEAE6` | `#4E5D78` `#76839A` | `#D7CBBF` `#24262B` | `#4E5D78` |
| `sage-light` | claro | Calmo/diferente | `#F4F6F1` `#FFFFFF` `#E6EAE2` | `#506B62` `#80958D` | `#C7D6CE` `#202724` | `#506B62` |

Os componentes leem apenas CSS vars, então trocar de tema não exige nenhuma prop. Cada tema declara só a
**paleta**; os tokens semânticos (bordas, hover, sombras, foco, badges, cards, texto secundário...) são
derivados dela pelo **modo** (escuro/claro) com `color-mix()`. As cores de status (sucesso, info, alerta, erro)
são as mesmas em todos os temas de um mesmo modo.

```tsx
import { ThemeProvider, useTheme, themeList } from 'nekkora-lib';

// Aplica no <html>, lembra a escolha no localStorage
<ThemeProvider target="document" defaultTheme="sakura-dark" storageKey="nk-theme">
  <App />
</ThemeProvider>

// "system" segue o SO usando o par escolhido; toggleTheme() alterna dentro do par
<ThemeProvider theme="system" pair={{ dark: 'midnight-blue', light: 'porcelain-light' }}>...</ThemeProvider>

const { theme, resolvedTheme, mode, setTheme, toggleTheme } = useTheme();
setTheme('sage-light');

// Montar um seletor
themeList.map((t) => ({ value: t.name, label: t.label, mode: t.mode, palette: t.palette }));

// Temas aninhados: uma área com outro tema dentro do app
<ThemeProvider theme="porcelain-light"><Card>...</Card></ThemeProvider>
```

Sem React: `<html data-nk-theme="midnight-blue" class="nk-root">`.

**Criar um tema novo:** em `src/tokens/themes.css`, adicione o seletor `[data-nk-theme='meu-tema']` à lista do
modo (escuro ou claro) e declare a paleta (`--nk-color-bg`, `surface`, `card`, `primary`, `secondary`,
`highlight`, `text`, `accent`, `accent-hover`, `accent-active`). Depois registre o tema em `themes` (`src/tokens/tokens.ts`).

## Desenvolvimento

```bash
npm install
npm run dev              # documentação com todos os componentes e seletor de tema (http://localhost:5173)
npm test                 # testes (vitest)
npm run typecheck
npm run build            # gera dist/ (ESM + CJS + CSS + tipos)
npm run check            # validação completa antes de juntar uma branch: tipos, testes e builds
```

## Componentes

### Font / Tipografia — `Text`, `Heading`
```tsx
<Text variant="display|h1|h2|h3|h4|body-lg|body|body-sm|caption|overline|code"
      color="default|secondary|muted|accent|highlight|success|info|warning|danger"
      weight="regular|medium|semibold|bold" align="left|center|right" truncate gradient as="span" />
<Heading level={2}>Execuções recentes</Heading>
```

### Ícones — `Icon` e `IconBox`
Estilo **duotone** por padrão: traço + uma camada preenchida translúcida.
```tsx
<Icon name="search" size="xs|sm|md|lg|xl" /> // ou size={28}
<Icon name="home" variant="outline" />        // só o traço
<Icon name="bell" secondaryColor="var(--nk-color-accent)" /> // duotone em 2 cores
<Icon name="loader" spin />
<Icon name="alert" color="var(--nk-color-warning)" strokeWidth={2} label="Atenção" />

// Ícone numa tag preenchida (fundo colorido + ícone branco)
<IconBox icon="chart" tone="accent|primary|neutral|success|info|warning|danger"
         variant="solid|soft|outline" size="xs|sm|md|lg|xl" shape="rounded|circle|square" />
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

### SelectMenu (lista de opções customizada)
Lista 100% estilizada — ícones, descrições, badges, grupos, busca e múltipla seleção, com navegação por teclado.
```tsx
<SelectMenu label="Agente" optionIcon="box" searchable clearable
  options={[
    { value: 'agt-01', label: 'AGT-01', description: 'Windows Server 2022', icon: 'monitor',
      meta: <Badge tone="success" variant="solid" size="sm" dot>Online</Badge> },
    { label: 'Offline', options: [{ value: 'agt-04', label: 'AGT-04', disabled: true }] },
  ]}
  onChange={(value, option) => {}} />

<SelectMenu multiple label="Agentes" value={ids} onChange={setIds} maxChips={3} options={...} />
```

### Select / Option / OptionGroup (nativo)
Usa a lista do sistema operacional — ideal para formulários simples e celular.
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
      <CardHeader icon="chart" iconVariant="solid" title="Execuções" subtitle="Hoje" action={<Link arrow>Ver todas</Link>} divider />
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
    { key: 'status', header: 'Status', render: (r) => <Badge tone="success" variant="solid" size="sm">{r.status}</Badge> },
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
<Badge tone="success|info|danger|warning|accent|primary|neutral" variant="soft|solid|outline" size="sm|md" dot icon="star">Concluído</Badge>
<Badge variant="solid" tone="success">Concluído</Badge>   // tag preenchida: fundo colorido + texto branco
```

## Estrutura

```
src/
  tokens/        foundation.css (tipografia, espaço, raios), themes.css (modos + paletas) e tokens.ts (registro dos temas)
  utils/         máscaras, cx, renderIcon
  components/    ThemeProvider, Logo, Icon, IconBox, Typography, Button, Link, Badge, Field, Input, Select, SelectMenu,
                 Container, Card, Layout (Stack/Grid), Fieldset, Table
brand/           SVGs da marca (símbolo, logotipo, assinatura, ícone de app)
docs/            site de documentação (páginas, exemplos ao vivo e código)
```
