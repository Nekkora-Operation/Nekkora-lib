import { useState } from 'react';
import { Icon, iconNames, Input, Text, type IconName } from 'nekkora-lib';
import { Example } from '../ui/Example';
import { PageHeader, Section } from '../ui/Page';
import { PropsTable } from '../ui/PropsTable';

const SIZE = ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamanho do controle.'] as const;
const ICON_PROP = "IconName | ReactNode";

export function TypographyPage() {
  return (
    <>
      <PageHeader title="Tipografia" description="Text e Heading aplicam a escala tipográfica (Inter) e as cores do tema." />
      <Example name="typography/Variants" title="Variantes" />
      <Example name="typography/Colors" title="Cores" description="Cores semânticas: mudam conforme o tema." />
      <Example name="typography/Modifiers" title="Modificadores" />
      <PropsTable
        title="Text"
        rows={[
          ['variant', "'display' | 'h1'…'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'overline' | 'code'", "'body'", 'Estilo tipográfico.'],
          ['color', "'default' | 'secondary' | 'muted' | 'accent' | 'highlight' | 'success' | 'info' | 'warning' | 'danger' | 'inherit'", "'default'", 'Cor do texto.'],
          ['weight', "'regular' | 'medium' | 'semibold' | 'bold'", '', 'Peso da fonte.'],
          ['align', "'left' | 'center' | 'right'", '', 'Alinhamento.'],
          ['truncate', 'boolean', 'false', 'Corta em uma linha com reticências.'],
          ['gradient', 'boolean', 'false', 'Degradê accent → highlight.'],
          ['as', 'ElementType', 'depende da variante', 'Elemento HTML renderizado.'],
        ]}
      />
      <PropsTable title="Heading" rows={[['level', '1 | 2 | 3 | 4', '2', 'Atalho para variant="h{level}". Aceita as demais props de Text.']]} />
    </>
  );
}

export function IconsPage() {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState<IconName | null>(null);
  const list = iconNames.filter((n) => n.includes(filter.toLowerCase()));
  const copy = (name: IconName) => {
    navigator.clipboard?.writeText(`<Icon name="${name}" />`).catch(() => {});
    setCopied(name);
    setTimeout(() => setCopied(null), 1200);
  };
  return (
    <>
      <PageHeader
        title="Ícones"
        description={`${iconNames.length} ícones duotone 24×24. Qualquer prop leftIcon/rightIcon/icon aceita o nome do ícone ou um ReactNode. Para o ícone numa tag preenchida, use IconBox.`}
      />
      <Example name="icons/Sizes" title="Tamanhos" />
      <Example
        name="icons/Styles"
        title="Duotone, outline e 2 cores"
        description="O estilo padrão é duotone: traço + uma camada preenchida translúcida. secondaryColor pinta essa camada com outra cor."
      />
      <Example name="icons/Colors" title="Cor, traço e animação" />
      <Section title="Galeria">
        <div style={{ maxWidth: 360 }}>
          <Input placeholder="Filtrar ícones..." leftIcon="search" value={filter} clearable onValueChange={setFilter} />
        </div>
        <Text variant="caption" color="secondary">Clique para copiar o código.</Text>
        <div className="doc-icons">
          {list.map((name) => (
            <button key={name} className="doc-icon" onClick={() => copy(name)}>
              <Icon name={copied === name ? 'check' : name} size="lg" />
              <span>{copied === name ? 'copiado!' : name}</span>
            </button>
          ))}
        </div>
      </Section>
      <PropsTable
        title="Icon"
        rows={[
          ['name', 'IconName', '', 'Nome do ícone (obrigatório).'],
          ['variant', "'duotone' | 'outline'", "'duotone'", 'Traço + camada preenchida, ou só traço.'],
          ['secondaryColor', 'string', 'cor do traço', 'Cor da camada preenchida do duotone.'],
          ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", "'md'", '12 · 16 · 20 · 24 · 32 px ou valor em px.'],
          ['color', 'string', "'currentColor'", 'Qualquer cor CSS (ex.: var(--nk-color-accent)).'],
          ['strokeWidth', 'number', '1.75', 'Espessura do traço.'],
          ['spin', 'boolean', 'false', 'Animação de rotação.'],
          ['label', 'string', '', 'Rótulo acessível; sem ele o ícone é decorativo.'],
        ]}
      />
    </>
  );
}

export function IconBoxPage() {
  return (
    <>
      <PageHeader
        title="IconBox"
        description="O ícone dentro de uma tag colorida. No estilo solid, o fundo é preenchido e o ícone fica branco."
      />
      <Example name="iconbox/Solid" title="Tag preenchida" />
      <Example name="iconbox/Variants" title="Variantes" description="solid (padrão), soft e outline em cada tom." />
      <Example name="iconbox/Sizes" title="Tamanhos e formas" />
      <Example name="iconbox/List" title="Em uma lista" />
      <PropsTable
        rows={[
          ['icon', ICON_PROP, '', 'Nome do ícone Nekkora ou ReactNode (obrigatório).'],
          ['tone', "'accent' | 'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'danger'", "'accent'", 'Cor da caixa.'],
          ['variant', "'solid' | 'soft' | 'outline'", "'solid'", 'Preenchida com ícone branco, translúcida ou só borda.'],
          ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'", "'md'", '24 · 32 · 40 · 48 · 56 px.'],
          ['shape', "'rounded' | 'circle' | 'square'", "'rounded'", 'Formato.'],
          ['label', 'string', '', 'Rótulo acessível; sem ele a caixa é decorativa.'],
        ]}
      />
    </>
  );
}

export function ButtonPage() {
  return (
    <>
      <PageHeader title="Button" description="Ações principais e secundárias, com ícones, estados de carregamento e versão somente-ícone." />
      <Example name="button/Variants" title="Variantes" />
      <Example name="button/Sizes" title="Tamanhos" />
      <Example name="button/Icons" title="Ícones" description="leftIcon, rightIcon ou icon (somente ícone — informe aria-label)." />
      <Example name="button/States" title="Estados e largura" description="Clique no primeiro botão para ver o loading." />
      <PropsTable
        rows={[
          ['variant', "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", "'primary'", 'Estilo visual.'],
          [...SIZE],
          ['leftIcon', ICON_PROP, '', 'Ícone antes do texto.'],
          ['rightIcon', ICON_PROP, '', 'Ícone depois do texto.'],
          ['icon', ICON_PROP, '', 'Botão quadrado somente com ícone.'],
          ['loading', 'boolean', 'false', 'Mostra spinner e desabilita.'],
          ['fullWidth', 'boolean', 'false', 'Ocupa 100% da largura.'],
          ['pill', 'boolean', 'false', 'Bordas totalmente arredondadas.'],
          ['...rest', 'ButtonHTMLAttributes', '', 'onClick, disabled, type, aria-*...'],
        ]}
      />
    </>
  );
}

export function LinkPage() {
  return (
    <>
      <PageHeader title="Link" description="Links de navegação, com seta, ícones e suporte a componentes de roteamento." />
      <Example name="link/Variants" title="Variantes" />
      <Example name="link/Icons" title="Ícones e tamanhos" />
      <PropsTable
        rows={[
          ['variant', "'accent' | 'default' | 'subtle'", "'accent'", 'Cor do link.'],
          [...SIZE],
          ['underline', "'always' | 'hover' | 'none'", "'hover'", 'Quando sublinhar.'],
          ['arrow', 'boolean', 'false', 'Seta → à direita (ex.: "Ver todas").'],
          ['external', 'boolean', 'false', 'Abre em nova aba com rel seguro.'],
          ['leftIcon / rightIcon', ICON_PROP, '', 'Ícones.'],
          ['disabled', 'boolean', 'false', 'Desabilita a navegação.'],
          ['as', 'ElementType', "'a'", 'Ex.: Link do react-router.'],
        ]}
      />
    </>
  );
}

export function BadgePage() {
  return (
    <>
      <PageHeader title="Badge" description="Rótulos de status — usados nas tabelas de execuções e automações." />
      <Example name="badge/Solid" title="Preenchido (solid)" description="Fundo colorido com texto branco. Os fundos sólidos são calibrados para contraste AA em todos os temas." />
      <Example name="badge/Tones" title="Suave (soft)" description="Variante padrão, usada nas tabelas." />
      <Example name="badge/Variants" title="Dot, ícone e outline" />
      <PropsTable
        rows={[
          ['tone', "'neutral' | 'primary' | 'accent' | 'success' | 'info' | 'warning' | 'danger'", "'neutral'", 'Cor semântica.'],
          ['variant', "'soft' | 'solid' | 'outline'", "'soft'", 'solid = fundo colorido e texto branco.'],
          ['size', "'sm' | 'md'", "'md'", 'Tamanho.'],
          ['dot', 'boolean', 'false', 'Ponto de status à esquerda.'],
          ['icon', ICON_PROP, '', 'Ícone à esquerda.'],
        ]}
      />
    </>
  );
}

export function InputPage() {
  return (
    <>
      <PageHeader title="Input" description="Campo de texto com label, ajuda, erro, ícones, adornos e máscaras." />
      <Example name="input/Masks" title="Máscaras prontas" description="cpf, cnpj, cpfCnpj (alterna pelo tamanho), phone (fixo ↔ celular), cep e date." />
      <Example name="input/CustomMask" title="Máscara customizada" description="9 = dígito · A = letra · * = alfanumérico." />
      <Example name="input/Controlled" title="Controlado" description="onValueChange entrega o valor mascarado e o valor bruto." />
      <Example name="input/Sizes" title="Tamanhos" />
      <Example name="input/Addons" title="Ícones e adornos" />
      <Example name="input/States" title="Estados e variantes" />
      <PropsTable
        rows={[
          ['label', 'ReactNode', '', 'Rótulo do campo.'],
          ['hint', 'ReactNode', '', 'Texto de ajuda.'],
          ['error', 'ReactNode', '', 'Mensagem de erro (pinta de vermelho).'],
          ['mask', "'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | string", '', 'Preset ou padrão customizado.'],
          [...SIZE],
          ['variant', "'default' | 'filled' | 'ghost'", "'default'", 'Estilo do campo.'],
          ['leftIcon / rightIcon', ICON_PROP, '', 'Ícones.'],
          ['prefix / suffix', 'ReactNode', '', 'Texto fixo antes/depois (ex.: R$, kg).'],
          ['shortcut', 'string', '', 'Atalho exibido à direita (ex.: Ctrl K).'],
          ['clearable', 'boolean', 'false', 'Botão para limpar.'],
          ['passwordToggle', 'boolean', 'true', 'Mostrar/ocultar senha em type="password".'],
          ['fullWidth', 'boolean', 'false', '100% da largura.'],
          ['onValueChange', '(masked, raw) => void', '', 'Valor com e sem máscara.'],
          ['...rest', 'InputHTMLAttributes', '', 'value, defaultValue, onChange, disabled, required...'],
        ]}
      />
    </>
  );
}

export function MasksPage() {
  return (
    <>
      <PageHeader title="Máscaras" description="As mesmas funções usadas pelo Input, disponíveis para formatar valores em qualquer lugar (tabelas, textos, APIs)." />
      <Example name="masks/Functions" title="Funções" />
      <PropsTable
        title="API"
        rows={[
          ['formatWithMask(v, mask)', "(string, MaskPreset | string) => string", '', 'Formata com preset ou padrão.'],
          ['formatCPF / formatCNPJ / formatPhone', '(string) => string', '', 'Atalhos dos presets.'],
          ['applyMask(v, pattern)', '(string, string) => string', '', 'Aplica um padrão (9, A, *).'],
          ['unmask(v)', '(string) => string', '', 'Remove tudo que não é letra ou dígito.'],
          ['maskMaxLength(mask)', '(mask) => number', '', 'Tamanho máximo formatado.'],
          ['MASK_PATTERNS', 'Record<string, string>', '', 'Padrões dos presets.'],
        ]}
      />
    </>
  );
}

export function SelectPage() {
  return (
    <>
      <PageHeader title="Select & Options" description="Seleção com o mesmo visual do Input. Opções via prop options (com grupos) ou via children." />
      <Example name="select/Options" title="Prop options" />
      <Example name="select/Children" title="Option e OptionGroup" />
      <Example name="select/States" title="Tamanhos e estados" />
      <PropsTable
        title="Select"
        rows={[
          ['options', 'Array<{ value, label, disabled? } | { label, options }>', '', 'Opções ou grupos.'],
          ['placeholder', 'string', '', 'Opção inicial desabilitada.'],
          ['label / hint / error', 'ReactNode', '', 'Como no Input.'],
          [...SIZE],
          ['variant', "'default' | 'filled' | 'ghost'", "'default'", 'Estilo.'],
          ['leftIcon', ICON_PROP, '', 'Ícone à esquerda.'],
          ['...rest', 'SelectHTMLAttributes', '', 'value, defaultValue, onChange, disabled...'],
        ]}
      />
      <PropsTable
        title="Option / OptionGroup"
        rows={[
          ['value', 'string | number', '', 'Valor da opção.'],
          ['disabled', 'boolean', 'false', 'Desabilita a opção ou o grupo.'],
          ['label (OptionGroup)', 'string', '', 'Título do grupo.'],
        ]}
      />
    </>
  );
}

export function LayoutPage() {
  return (
    <>
      <PageHeader title="Container & Layout" description="Container limita a largura; Stack e Grid organizam o espaçamento com os tokens." />
      <Example name="layout/Container" title="Container" />
      <Example name="layout/Stack" title="Stack" />
      <Example name="layout/Grid" title="Grid responsivo" description='minColumnWidth cria colunas automáticas; columns aceita número ou template ("2fr 1fr").' />
      <PropsTable
        title="Container"
        rows={[
          ['size', "'sm' | 'md' | 'lg' | 'xl' | 'fluid'", "'lg'", '640 · 960 · 1200 · 1440 px · 100%.'],
          ['padding', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Espaçamento interno.'],
          ['centered', 'boolean', 'true', 'Centraliza horizontalmente.'],
          ['as', 'ElementType', "'div'", 'Elemento renderizado.'],
        ]}
      />
      <PropsTable
        title="Stack"
        rows={[
          ['direction', "'column' | 'row'", "'column'", 'Direção.'],
          ['gap', '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12', '4', 'Espaço (1 = 4px).'],
          ['align / justify', 'CSS', '', 'align-items / justify-content.'],
          ['wrap', 'boolean', 'false', 'Quebra de linha.'],
        ]}
      />
      <PropsTable
        title="Grid"
        rows={[
          ['columns', 'number | string', '2', 'Número de colunas ou template.'],
          ['minColumnWidth', 'string', '', 'Grid auto-fit (ignora columns).'],
          ['gap', 'Space', '4', 'Espaço entre itens.'],
        ]}
      />
    </>
  );
}

export function CardPage() {
  return (
    <>
      <PageHeader title="Card" description="Painéis do dashboard. Compose com CardHeader, CardBody e CardFooter." />
      <Example name="card/Stats" title="Cards de indicadores" />
      <Example name="card/Composition" title="Header, body e footer" />
      <Example name="card/Variants" title="Variantes" />
      <PropsTable
        title="Card"
        rows={[
          ['variant', "'surface' | 'raised' | 'outlined' | 'glow'", "'surface'", 'Estilo do painel.'],
          ['padding', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Espaçamento interno.'],
          ['interactive', 'boolean', 'false', 'Efeito de hover para cards clicáveis.'],
          ['as', 'ElementType', "'section'", 'Elemento renderizado.'],
        ]}
      />
      <PropsTable
        title="CardHeader"
        rows={[
          ['title / subtitle', 'ReactNode', '', 'Título e subtítulo.'],
          ['icon', ICON_PROP, '', 'Ícone em destaque à esquerda (IconBox).'],
          ['iconVariant', "'solid' | 'soft' | 'outline'", "'soft'", 'Estilo da caixa do ícone.'],
          ['iconTone', 'Tone', "'accent'", 'Cor da caixa do ícone.'],
          ['action', 'ReactNode', '', 'Conteúdo à direita (link, select...).'],
          ['divider', 'boolean', 'false', 'Linha abaixo do cabeçalho.'],
        ]}
      />
    </>
  );
}

export function FieldsetPage() {
  return (
    <>
      <PageHeader title="Fieldset" description="Agrupa campos relacionados em colunas, com título, descrição e ações." />
      <Example name="fieldset/Default" title="Padrão" />
      <Example name="fieldset/Variants" title="Divided e desabilitado" />
      <PropsTable
        rows={[
          ['legend', 'ReactNode', '', 'Título do grupo (nome acessível).'],
          ['description', 'ReactNode', '', 'Texto abaixo do título.'],
          ['icon', ICON_PROP, '', 'Ícone ao lado do título.'],
          ['variant', "'default' | 'plain' | 'divided'", "'default'", 'Caixa, sem caixa ou linha superior.'],
          ['columns', '1 | 2 | 3 | 4', '1', 'Colunas (1 em telas pequenas).'],
          ['action', 'ReactNode', '', 'Ações à direita do título.'],
          ['disabled', 'boolean', 'false', 'Desabilita todos os campos internos.'],
        ]}
      />
    </>
  );
}

export function TablePage() {
  return (
    <>
      <PageHeader title="Tabelas" description="Table orientada a dados (columns + data) ou primitivos para montagens livres." />
      <Example name="table/Data" title="Colunas e render customizado" />
      <Example name="table/Options" title="Opções" description="size, striped, bordered, stickyHeader, loading, emptyMessage e onRowClick." />
      <Example name="table/Primitives" title="Composição livre" />
      <PropsTable
        title="Table"
        rows={[
          ['columns', 'TableColumn<T>[]', '', '{ key, header, render?, align?, width?, muted? }'],
          ['data', 'T[]', '', 'Linhas.'],
          ['rowKey', 'keyof T | (row, i) => key', 'índice', 'Chave única da linha.'],
          ['size', "'sm' | 'md' | 'lg'", "'md'", 'Densidade.'],
          ['striped / hoverable / bordered', 'boolean', 'false / true / false', 'Aparência.'],
          ['stickyHeader + maxHeight', 'boolean + number | string', '', 'Cabeçalho fixo com rolagem.'],
          ['loading', 'boolean', 'false', 'Linhas esqueleto.'],
          ['emptyMessage', 'ReactNode', "'Nenhum registro encontrado.'", 'Estado vazio.'],
          ['onRowClick', '(row, i) => void', '', 'Linhas clicáveis.'],
          ['caption', 'ReactNode', '', 'Legenda da tabela.'],
        ]}
      />
      <PropsTable
        title="Primitivos"
        rows={[
          ['TableRoot', 'size, striped, hoverable, stickyHeader, maxHeight, bordered', '', 'A <table> e seu wrapper.'],
          ['TableRow', 'selected, clickable', '', 'Linha.'],
          ['TableHeaderCell / TableCell', "align, muted (TableCell)", '', 'Células.'],
        ]}
      />
    </>
  );
}
