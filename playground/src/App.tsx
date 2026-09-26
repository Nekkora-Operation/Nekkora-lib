import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  darkColors,
  lightColors,
  ThemeProvider,
  useTheme,
  type ThemePreference,
  Container,
  Fieldset,
  Grid,
  Heading,
  Icon,
  iconNames,
  Input,
  Link,
  Option,
  OptionGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  Text,
  type TableColumn,
} from 'nekkora-lib';

const SECTIONS = [
  ['tokens', 'Cores & Temas', 'layers'],
  ['font', 'Tipografia', 'file'],
  ['icons', 'Ícones', 'sakura'],
  ['buttons', 'Buttons', 'box'],
  ['links', 'Links', 'link'],
  ['badges', 'Badges', 'check-circle'],
  ['inputs', 'Inputs & Máscaras', 'edit'],
  ['selects', 'Select & Options', 'chevron-down'],
  ['containers', 'Containers', 'monitor'],
  ['fieldsets', 'Fieldsets', 'workspace'],
  ['tables', 'Tabelas', 'chart'],
] as const;

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="pg-section">
      <div>
        <Heading level={2}>{title}</Heading>
        {description && (
          <Text color="secondary" style={{ marginTop: 4 }}>
            {description}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pg-demo">
      <span className="pg-label">{label}</span>
      {children}
    </div>
  );
}

type Execucao = { id: number; processo: string; status: 'Concluído' | 'Em execução' | 'Falhou'; inicio: string; duracao: string; agente: string };

const EXECUCOES: Execucao[] = [
  { id: 1, processo: 'Download de Faturas', status: 'Concluído', inicio: '10:24', duracao: '2m 14s', agente: 'AGT-01' },
  { id: 2, processo: 'Conciliação Bancária', status: 'Concluído', inicio: '09:17', duracao: '4m 31s', agente: 'AGT-01' },
  { id: 3, processo: 'Envio de Relatórios', status: 'Em execução', inicio: '11:02', duracao: '—', agente: 'AGT-02' },
  { id: 4, processo: 'Atualização de Cadastro', status: 'Falhou', inicio: '08:43', duracao: '1m 12s', agente: 'AGT-01' },
  { id: 5, processo: 'Leitura de E-mails', status: 'Concluído', inicio: '08:12', duracao: '3m 03s', agente: 'AGT-03' },
];

const STATUS_TONE = { Concluído: 'success', 'Em execução': 'info', Falhou: 'danger' } as const;

const COLUMNS: TableColumn<Execucao>[] = [
  {
    key: 'processo',
    header: 'Processo',
    render: (r) => (
      <>
        <span className="pg-row-icon">
          <Icon name="robot" size={13} />
        </span>
        {r.processo}
      </>
    ),
  },
  { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status]} size="sm">{r.status}</Badge> },
  { key: 'inicio', header: 'Início', muted: true },
  { key: 'duracao', header: 'Duração', muted: true },
  { key: 'agente', header: 'Agente' },
  {
    key: 'acoes',
    header: <span className="nk-visually-hidden">Ações</span>,
    align: 'right',
    width: 56,
    render: () => <Button variant="ghost" size="sm" icon="more-horizontal" aria-label="Ações" />,
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <Select
      aria-label="Tema"
      size="sm"
      leftIcon={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'monitor'}
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemePreference)}
      options={[
        { value: 'dark', label: 'Tema escuro' },
        { value: 'light', label: 'Tema claro' },
        { value: 'system', label: 'Seguir o sistema' },
      ]}
    />
  );
}

function Palette({ title, palette }: { title: string; palette: Record<string, string> }) {
  return (
    <>
      <Text variant="h4">{title}</Text>
      <div className="pg-row pg-row--top">
        {Object.entries(palette).map(([name, hex]) => (
          <div key={name} className="pg-swatch">
            <div className="pg-swatch__color" style={{ background: hex }} />
            <Text variant="caption" weight="medium">{name}</Text>
            <Text variant="caption" color="secondary">{hex}</Text>
          </div>
        ))}
      </div>
    </>
  );
}

function ThemePreview() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3} align="center" wrap>
        <Button leftIcon="plus">Nova automação</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Link href="#tokens" arrow>Ver todas</Link>
      </Stack>
      <Stack direction="row" gap={2} wrap>
        <Badge tone="success">Concluído</Badge>
        <Badge tone="info">Em execução</Badge>
        <Badge tone="danger">Falhou</Badge>
        <Badge tone="warning">Pausada</Badge>
      </Stack>
      <Grid columns={2} gap={3}>
        <Input label="CPF" mask="cpf" defaultValue="12345678909" leftIcon="id-card" />
        <Select label="Período" leftIcon="calendar" options={[{ value: 7, label: 'Últimos 7 dias' }]} />
      </Grid>
      <Card padding="sm">
        <CardHeader icon="chart" title="Taxa de sucesso" subtitle="98,1% · ↑ 2% vs. mês anterior" />
      </Card>
    </Stack>
  );
}

export function App() {
  const [phone, setPhone] = useState({ masked: '', raw: '' });
  const [emptyTable, setEmptyTable] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  return (
    <div className="pg-layout">
      <aside className="pg-sidebar">
        <div className="pg-brand">
          <Icon name="sakura" size={30} />
          <div>
            <Text variant="h3" as="div">Nekkora</Text>
            <Text variant="overline" color="secondary" style={{ letterSpacing: '0.16em', fontSize: 9 }}>
              Design System
            </Text>
          </div>
        </div>
        <nav className="pg-nav">
          {SECTIONS.map(([id, label, icon]) => (
            <a key={id} href={`#${id}`}>
              <Icon name={icon} size="sm" />
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="pg-main">
        <div className="pg-hero">
          <div>
          <Text variant="overline" color="accent">Automation meets clarity</Text>
          <Text variant="h1" gradient style={{ marginTop: 8 }}>nekkora-lib</Text>
          <Text color="secondary" style={{ marginTop: 6 }}>
            Componentes React Nekkora — temas escuro e claro, sofisticados e focados em produtividade.
          </Text>
          </div>
          <ThemeSwitcher />
        </div>

        <Section
          id="tokens"
          title="Cores & Temas"
          description='Dois temas com a mesma identidade. Use <ThemeProvider theme="dark | light | system"> ou data-nk-theme em qualquer elemento — temas podem ser aninhados.'
        >
          <div className="pg-palettes">
            <div className="pg-palette" data-nk-theme="dark">
              <Palette title="Tema escuro (principal)" palette={darkColors} />
            </div>
            <div className="pg-palette" data-nk-theme="light">
              <Palette title="Tema claro" palette={lightColors} />
            </div>
          </div>
          <Heading level={4}>Lado a lado (temas aninhados)</Heading>
          <div className="pg-compare">
            <ThemeProvider theme="dark"><ThemePreview /></ThemeProvider>
            <ThemeProvider theme="light"><ThemePreview /></ThemeProvider>
          </div>
        </Section>

        <Section id="font" title="Tipografia" description="Fonte Inter. <Text variant color weight align truncate gradient /> e <Heading level />.">
          <Card>
            <Stack gap={3}>
              <Text variant="display">Display — Bem-vinda, Ana</Text>
              <Text variant="h1">Heading 1</Text>
              <Text variant="h2">Heading 2</Text>
              <Text variant="h3">Heading 3</Text>
              <Text variant="h4">Heading 4</Text>
              <Text variant="body-lg">Body large — Aqui está o estado das suas automações e agentes.</Text>
              <Text>Body — Aqui está o estado das suas automações e agentes.</Text>
              <Text variant="body-sm" color="secondary">Body small secondary — 2 aguardando revisão</Text>
              <Text variant="caption" color="muted">Caption muted — Segunda-feira, 28 de Abril de 2025</Text>
              <Text variant="overline" color="accent">Overline — Automate · Observe · Evolve</Text>
              <Text>Inline <Text variant="code" as="code">npm i nekkora-lib</Text> code</Text>
              <div className="pg-row">
                <Text color="success" weight="semibold">↑ 20% success</Text>
                <Text color="info" weight="semibold">info</Text>
                <Text color="warning" weight="semibold">warning</Text>
                <Text color="danger" weight="semibold">danger</Text>
                <Text color="highlight" weight="semibold">highlight</Text>
              </div>
              <Text variant="h2" gradient>Texto com gradiente</Text>
            </Stack>
          </Card>
        </Section>

        <Section id="icons" title="Ícones" description={`${iconNames.length} ícones outline. <Icon name size color strokeWidth spin label />`}>
          <div className="pg-row">
            <Demo label='size="xs|sm|md|lg|xl"'>
              <div className="pg-row">
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => <Icon key={s} name="sakura" size={s} color="var(--nk-color-accent)" />)}
              </div>
            </Demo>
            <Demo label="spin / color / strokeWidth">
              <div className="pg-row">
                <Icon name="loader" spin />
                <Icon name="check-circle" color="var(--nk-color-success)" />
                <Icon name="alert" color="var(--nk-color-warning)" strokeWidth={2.5} />
              </div>
            </Demo>
          </div>
          <div className="pg-icons">
            {iconNames.map((name) => (
              <div key={name} className="pg-icon-cell">
                <Icon name={name} size="lg" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="buttons" title="Buttons" description="variant · size · leftIcon · rightIcon · icon (icon-only) · loading · fullWidth · pill · disabled">
          <Demo label="variant">
            <div className="pg-row">
              <Button variant="primary" leftIcon="plus">Nova automação</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" leftIcon="trash">Excluir</Button>
            </div>
          </Demo>
          <Demo label='size="sm|md|lg"'>
            <div className="pg-row">
              <Button size="sm" leftIcon="play">Small</Button>
              <Button size="md" leftIcon="play">Medium</Button>
              <Button size="lg" leftIcon="play">Large</Button>
            </div>
          </Demo>
          <Demo label="leftIcon / rightIcon / icon-only / pill">
            <div className="pg-row">
              <Button variant="secondary" leftIcon="download">Exportar</Button>
              <Button variant="outline" rightIcon="arrow-right">Continuar</Button>
              <Button variant="primary" icon="plus" aria-label="Adicionar" />
              <Button variant="secondary" icon="bell" aria-label="Notificações" />
              <Button variant="ghost" icon="more-horizontal" aria-label="Mais" size="sm" />
              <Button variant="primary" pill leftIcon="sakura">Pill</Button>
            </div>
          </Demo>
          <Demo label="loading / disabled / fullWidth">
            <div className="pg-row">
              <Button loading>Salvando</Button>
              <Button variant="secondary" loading>Processando</Button>
              <Button disabled>Desabilitado</Button>
              <Button variant="outline" disabled>Desabilitado</Button>
            </div>
            <div style={{ maxWidth: 360 }}>
              <Button fullWidth rightIcon="arrow-right">Entrar na plataforma</Button>
            </div>
          </Demo>
        </Section>

        <Section id="links" title="Links" description="variant · size · underline · arrow · external · leftIcon · disabled · as (router)">
          <div className="pg-row" style={{ gap: 28 }}>
            <Link href="#links" arrow>Ver todas</Link>
            <Link href="#links" variant="default" leftIcon="file">Documentação</Link>
            <Link href="#links" variant="subtle" underline="always">Sublinhado</Link>
            <Link href="https://github.com" external>Externo</Link>
            <Link href="#links" size="lg" arrow>Large</Link>
            <Link href="#links" size="sm">Small</Link>
            <Link href="#links" disabled>Desabilitado</Link>
          </div>
        </Section>

        <Section id="badges" title="Badges" description="tone · variant (soft | solid | outline) · size · dot · icon — usados nas tabelas de status.">
          <div className="pg-row">
            <Badge tone="success">Concluído</Badge>
            <Badge tone="info">Em execução</Badge>
            <Badge tone="danger">Falhou</Badge>
            <Badge tone="success" size="sm">Ativa</Badge>
            <Badge tone="warning" size="sm">Pausada</Badge>
            <Badge tone="accent">Novo</Badge>
            <Badge>Neutral</Badge>
          </div>
          <div className="pg-row">
            <Badge tone="success" dot variant="outline">Online</Badge>
            <Badge tone="danger" dot variant="outline">Offline</Badge>
            <Badge tone="accent" variant="solid" icon="star">Favorito</Badge>
            <Badge tone="info" variant="solid">Solid</Badge>
          </div>
        </Section>

        <Section id="inputs" title="Inputs & Máscaras" description="mask: 'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | padrão livre (9 dígito, A letra, * alfanumérico).">
          <Grid minColumnWidth="260px" gap={5}>
            <Input label="CPF" mask="cpf" placeholder="000.000.000-00" leftIcon="id-card" />
            <Input label="CNPJ" mask="cnpj" placeholder="00.000.000/0000-00" leftIcon="building" />
            <Input label="CPF ou CNPJ" mask="cpfCnpj" placeholder="Digite o documento" hint="Alterna automaticamente pelo tamanho" />
            <Input
              label="Telefone / Celular"
              mask="phone"
              placeholder="(00) 00000-0000"
              leftIcon="phone"
              onValueChange={(masked, raw) => setPhone({ masked, raw })}
              hint={phone.raw ? `raw: ${phone.raw} (${phone.raw.length <= 10 ? 'fixo' : 'celular'})` : 'Fixo (10) ou celular (11 dígitos)'}
            />
            <Input label="CEP" mask="cep" placeholder="00000-000" leftIcon="building" />
            <Input label="Data" mask="date" placeholder="dd/mm/aaaa" rightIcon="calendar" />
            <Input label="Placa (padrão custom)" mask="AAA-9*99" placeholder="ABC-1D23" hint='mask="AAA-9*99"' />
            <Input label="Com valor inicial" mask="cpf" defaultValue="12345678909" />
          </Grid>

          <Heading level={4} style={{ marginTop: 12 }}>Tamanhos, ícones e estados</Heading>
          <Grid minColumnWidth="260px" gap={5}>
            <Input size="sm" placeholder="size sm" leftIcon="search" />
            <Input size="md" placeholder="size md" leftIcon="search" />
            <Input size="lg" placeholder="size lg" leftIcon="search" />
            <Input placeholder="Buscar automações, execuções, agentes..." leftIcon="search" shortcut="Ctrl K" />
            <Input label="E-mail" type="email" placeholder="voce@nekkora.com" leftIcon="mail" required />
            <Input label="Senha" type="password" placeholder="••••••••" leftIcon="lock" />
            <Input label="Valor" prefix="R$" suffix="BRL" placeholder="0,00" />
            <Input label="Limpável" defaultValue="Download de Faturas" clearable />
            <Input label="Com erro" defaultValue="123.456" mask="cpf" error="CPF incompleto" />
            <Input label="Desabilitado" defaultValue="AGT-01" disabled />
            <Input label="variant filled" variant="filled" placeholder="Filled" />
            <Input label="variant ghost" variant="ghost" placeholder="Ghost" />
          </Grid>
        </Section>

        <Section id="selects" title="Select & Options" description="options (array/grupos) ou children <Option>/<OptionGroup> · size · leftIcon · placeholder · error · disabled">
          <Grid minColumnWidth="240px" gap={5}>
            <Select
              label="Período"
              leftIcon="calendar"
              defaultValue="7"
              options={[
                { value: 'today', label: 'Hoje' },
                { value: '7', label: 'Últimos 7 dias' },
                { value: '30', label: 'Últimos 30 dias' },
              ]}
            />
            <Select label="Agente" placeholder="Selecione um agente" leftIcon="monitor">
              <Option value="agt-01">AGT-01 · Windows Server 2022</Option>
              <Option value="agt-02">AGT-02 · Windows 11</Option>
              <Option value="agt-03">AGT-03 · Windows Server 2019</Option>
              <Option value="agt-04" disabled>AGT-04 · Offline</Option>
            </Select>
            <Select label="Processo (grupos)" placeholder="Selecione">
              <OptionGroup label="Financeiro">
                <Option value="faturas">Download de Faturas</Option>
                <Option value="conciliacao">Conciliação Bancária</Option>
              </OptionGroup>
              <OptionGroup label="Operações">
                <Option value="emails">Leitura de E-mails</Option>
              </OptionGroup>
            </Select>
            <Select
              label="Grupos via options"
              options={[
                { label: 'Comercial', options: [{ value: 'cad', label: 'Atualização de Cadastro' }] },
                { label: 'Gestão', options: [{ value: 'rel', label: 'Envio de Relatórios' }] },
              ]}
            />
            <Select size="sm" options={[{ value: 1, label: 'size sm' }]} />
            <Select size="lg" options={[{ value: 1, label: 'size lg' }]} />
            <Select label="Com erro" placeholder="Obrigatório" error="Selecione um status" required options={[{ value: 'a', label: 'Ativa' }]} />
            <Select label="Desabilitado" disabled options={[{ value: 'p', label: 'Pausada' }]} />
          </Grid>
        </Section>

        <Section id="containers" title="Containers" description="Container (largura máx.), Card (+Header/Body/Footer), Stack e Grid.">
          <Grid minColumnWidth="200px">
            {[
              ['box', 'Automações', '24', '↑ 20%', 'vs. mês anterior'],
              ['play', 'Execuções (hoje)', '156', '↑ 12%', 'vs. ontem'],
              ['chart', 'Taxa de sucesso', '98,1%', '↑ 2%', 'vs. mês anterior'],
              ['monitor', 'Agentes online', '3 / 3', '', 'Todos operacionais'],
            ].map(([icon, label, value, delta, caption]) => (
              <Card key={label} variant="surface" interactive>
                <Stack direction="row" gap={4} align="flex-start">
                  <span className="pg-stat-icon"><Icon name={icon as 'box'} size="md" /></span>
                  <Stack gap={1}>
                    <Text variant="body-sm" color="secondary">{label}</Text>
                    <Text variant="h2" as="div">{value}</Text>
                    <Text variant="caption" color="secondary">
                      {delta && <Text as="span" variant="caption" color="success" weight="semibold">{delta} </Text>}
                      {caption}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>

          <Grid columns="2fr 1fr" gap={4} style={{ alignItems: 'start' }}>
            <Card>
              <CardHeader title="Execuções recentes" subtitle="Card com header, ação e footer" action={<Link href="#tables" arrow>Ver todas</Link>} />
              <CardBody>
                <Text color="secondary">Conteúdo do card. Use padding="none | sm | md | lg" e variant="surface | raised | outlined | glow".</Text>
              </CardBody>
              <CardFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button leftIcon="check">Confirmar</Button>
              </CardFooter>
            </Card>
            <Stack gap={4}>
              <Card variant="raised">
                <CardHeader icon="sakura" title="Sistemas" subtitle="que vão mais longe." />
              </Card>
              <Card variant="glow" padding="sm">
                <Stack direction="row" gap={3} align="center">
                  <Icon name="home" color="var(--nk-color-accent)" />
                  <Text weight="medium">variant="glow"</Text>
                </Stack>
              </Card>
              <Card variant="outlined" padding="sm">
                <Text variant="body-sm" color="secondary">variant="outlined"</Text>
              </Card>
            </Stack>
          </Grid>

          <Demo label='<Container size="sm" /> dentro de uma área tracejada'>
            <div style={{ border: '1px dashed var(--nk-color-border-strong)', borderRadius: 12 }}>
              <Container size="sm" padding="md">
                <Card variant="outlined" padding="sm">
                  <Text align="center" color="secondary">max-width: 640px, centralizado</Text>
                </Card>
              </Container>
            </div>
          </Demo>
        </Section>

        <Section id="fieldsets" title="Fieldsets" description="legend · description · icon · variant (default | plain | divided) · columns (1–4) · action · disabled">
          <Fieldset
            legend="Dados da empresa"
            description="Informações usadas no cadastro do workspace."
            icon="building"
            columns={2}
            action={<Button variant="ghost" size="sm" leftIcon="edit">Editar</Button>}
          >
            <Input label="Razão social" placeholder="Nekkora Ltda." required />
            <Input label="CNPJ" mask="cnpj" placeholder="00.000.000/0000-00" required />
            <Input label="Telefone" mask="phone" leftIcon="phone" placeholder="(00) 0000-0000" />
            <Select label="Segmento" placeholder="Selecione" options={[{ value: 'fin', label: 'Financeiro' }, { value: 'op', label: 'Operações' }]} />
          </Fieldset>

          <Fieldset legend="Responsável" variant="divided" columns={3}>
            <Input label="Nome" placeholder="Ana Martins" leftIcon="user" />
            <Input label="CPF" mask="cpf" placeholder="000.000.000-00" />
            <Input label="Celular" mask="phone" placeholder="(00) 00000-0000" />
          </Fieldset>

          <Fieldset legend="Fieldset desabilitado" description="disabled propaga para todos os campos." disabled columns={2}>
            <Input label="Agente" defaultValue="AGT-02" />
            <Select label="Status" options={[{ value: 'a', label: 'Ativa' }]} />
          </Fieldset>
        </Section>

        <Section id="tables" title="Tabelas" description="<Table columns data /> com render customizado, size, striped, hoverable, stickyHeader, bordered, loading, emptyMessage, onRowClick — ou composição livre com TableRoot/TableRow/TableCell.">
          <div className="pg-row">
            <Button size="sm" variant={emptyTable ? 'primary' : 'secondary'} onClick={() => setEmptyTable((v) => !v)}>Alternar vazio</Button>
            <Button size="sm" variant={loadingTable ? 'primary' : 'secondary'} onClick={() => setLoadingTable((v) => !v)}>Alternar loading</Button>
          </div>
          <Card padding="none">
            <CardHeader title="Execuções recentes" action={<Link href="#tables" arrow>Ver todas</Link>} />
            <Table
              columns={COLUMNS}
              data={emptyTable ? [] : EXECUCOES}
              rowKey="id"
              loading={loadingTable}
              emptyMessage="Nenhuma execução encontrada."
            />
          </Card>

          <Grid minColumnWidth="320px">
            <Demo label='size="sm" striped bordered stickyHeader maxHeight={180}'>
              <Table
                columns={COLUMNS.slice(0, 3)}
                data={[...EXECUCOES, ...EXECUCOES.map((e) => ({ ...e, id: e.id + 10 }))]}
                rowKey="id"
                size="sm"
                striped
                bordered
                stickyHeader
                maxHeight={180}
              />
            </Demo>
            <Demo label="Composição livre (TableRoot + TableRow + TableCell)">
              <TableRoot bordered size="lg">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Tipo de processo</TableHeaderCell>
                    <TableHeaderCell align="right">%</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[['Financeiro', 35], ['Comercial', 22], ['Operações', 18]].map(([t, p]) => (
                    <TableRow key={t} selected={t === 'Comercial'}>
                      <TableCell>{t}</TableCell>
                      <TableCell align="right" muted>{p}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableRoot>
            </Demo>
          </Grid>
        </Section>
      </main>
    </div>
  );
}
