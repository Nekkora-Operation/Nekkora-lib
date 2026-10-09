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

export function LogoPage() {
  return (
    <>
      <PageHeader
        title="Logo"
        description="O símbolo Cat-Eye são óculos com orelhas de gato: Neko (猫) + Observability. No logotipo, o “o” é uma lente com pupila de gato. As cores seguem o tema."
      />
      <Example name="logo/Variants" title="Variantes" description="full (símbolo + nome), symbol, wordmark e app (ícone)." />
      <Example name="logo/Tones" title="Tons" description="brand usa as cores do tema; inverse é branco, para fundos preenchidos; mono usa uma cor só." />
      <Example name="logo/Themes" title="Nos 6 temas" />
      <Example name="logo/Sizes" title="Tamanhos" description="O símbolo continua legível a 16 px." />
      <PropsTable
        rows={[
          ['variant', "'full' | 'symbol' | 'wordmark' | 'app'", "'full'", 'O que mostrar.'],
          ['size', 'number', '32', 'Altura do símbolo em px (o nome acompanha).'],
          ['tone', "'brand' | 'mono' | 'inverse'", "'brand'", 'Cores do tema, uma cor (currentColor) ou branco.'],
          ['tagline', 'boolean | ReactNode', '', 'Tagline abaixo do nome (full). true = AUTOMATE · OBSERVE · EVOLVE.'],
          ['title', 'string', "'Nekkora'", 'Nome acessível.'],
        ]}
      />
      <Section title="Arquivos da marca">
        <Text color="secondary" variant="body-sm">
          Para usar fora do React (apresentações, redes, e-mail), os SVGs estão em <Text variant="code">brand/</Text>:
          símbolo, logotipo e assinatura (versões para fundo escuro e claro) e o ícone de app.
        </Text>
      </Section>
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
      <Example name="badge/Solid" title="Preenchido (solid)" description="Fundo colorido com texto branco, contraste AA em todos os temas. Recomendado para a coluna de status das tabelas." />
      <Example name="badge/Tones" title="Suave (soft)" description="Variante padrão: mais discreta, para rótulos secundários." />
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
      <PageHeader
        title="Select & Options"
        description="SelectMenu tem a lista de opções inteiramente estilizada: ícones, descrições, badges, grupos, busca e seleção múltipla. O Select nativo usa a lista do sistema operacional e continua disponível para formulários simples e celular."
      />
      <Section title="SelectMenu — modelos de opções">
        <Example name="selectmenu/Basic" title="Simples" description="Lista com a opção selecionada marcada e opção desabilitada." />
        <Example name="selectmenu/Icons" title="Com ícones" />
        <Example name="selectmenu/Rich" title="Com IconBox, descrição e badge" description='optionIcon="box", description e meta.' />
        <Example name="selectmenu/Groups" title="Grupos e busca" description="searchable filtra enquanto digita; clearable limpa a seleção." />
        <Example name="selectmenu/Multiple" title="Seleção múltipla" description="Os selecionados aparecem como chips preenchidos; clique no × para remover." />
        <Example name="selectmenu/States" title="Tamanhos e estados" />
      </Section>
      <PropsTable
        title="SelectMenu"
        rows={[
          ['options', 'Array<SelectMenuOption | { label, options }>', '', 'Opções ou grupos.'],
          ['value / defaultValue', 'string | null · string[] (multiple)', '', 'Valor controlado ou inicial.'],
          ['onChange', '(value, option) => void', '', 'Recebe o valor e a(s) opção(ões) selecionada(s).'],
          ['multiple', 'boolean', 'false', 'Seleção múltipla com chips.'],
          ['searchable', 'boolean', 'false', 'Campo de busca no topo da lista.'],
          ['optionIcon', "'plain' | 'box'", "'plain'", 'Ícone simples ou dentro de IconBox.'],
          ['clearable', 'boolean', 'false', 'Botão para limpar a seleção.'],
          ['placeholder', 'string', "'Selecione'", 'Texto sem seleção.'],
          ['label / hint / error', 'ReactNode', '', 'Como no Input.'],
          [...SIZE],
          ['variant', "'default' | 'filled' | 'ghost'", "'default'", 'Estilo do gatilho.'],
          ['leftIcon', ICON_PROP, '', 'Ícone fixo no gatilho.'],
          ['maxHeight', 'number', '280', 'Altura máxima da lista (px).'],
          ['maxChips', 'number', '3', 'Chips visíveis antes de "+N" (multiple).'],
          ['name', 'string', '', 'Gera input hidden para envio em <form>.'],
          ['emptyMessage', 'ReactNode', "'Nenhuma opção encontrada.'", 'Texto quando a busca não encontra nada.'],
        ]}
      />
      <PropsTable
        title="SelectMenuOption"
        rows={[
          ['value', 'string', '', 'Valor da opção.'],
          ['label', 'string', '', 'Texto principal (usado na busca).'],
          ['description', 'ReactNode', '', 'Texto secundário.'],
          ['icon', ICON_PROP, '', 'Ícone à esquerda.'],
          ['iconTone', 'Tone', "'accent'", 'Cor do IconBox (optionIcon="box").'],
          ['meta', 'ReactNode', '', 'Conteúdo à direita (badge, contagem...).'],
          ['disabled', 'boolean', 'false', 'Desabilita a opção.'],
        ]}
      />
      <Section title="Teclado">
        <Text color="secondary" variant="body-sm">
          ↑ ↓ navegam · Enter/Espaço selecionam · Home/End vão ao início/fim · Esc fecha · digitar uma letra pula para a
          opção correspondente.
        </Text>
      </Section>

      <Section title="Select nativo">
        <Example name="select/Options" title="Prop options" />
        <Example name="select/Children" title="Option e OptionGroup" />
        <Example name="select/States" title="Tamanhos e estados" />
      </Section>
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

export function BlocksPage() {
  return (
    <>
      <PageHeader
        title="Blocos de página"
        description="Componentes para páginas comerciais e institucionais: navegação, cabeçalhos de seção, jornadas, formulários e botão flutuante."
      />
      <Example name="blocks/NavbarEx" title="Navbar" description="Âncoras, link ativo, ações e menu recolhível no mobile (abaixo de 960 px)." />
      <Example name="blocks/SectionHeaderEx" title="SectionHeader" />
      <Example name="blocks/StepsEx" title="Steps" description="Horizontal no desktop; vira vertical em telas estreitas." />
      <Example name="blocks/FormEx" title="Textarea, sucesso e Button como link" />
      <PropsTable
        title="Navbar"
        rows={[
          ['brand / brandHref', 'ReactNode / string', "'#'", 'Marca à esquerda e seu link.'],
          ['links', '{ label, href }[]', '[]', 'Itens de navegação (âncoras ou rotas).'],
          ['activeHref', 'string', '', 'Link marcado como ativo.'],
          ['actions', 'ReactNode', '', 'Ações à direita (no mobile, dentro do menu).'],
          ['sticky / blur', 'boolean', 'true / true', 'Fixa no topo; fundo translúcido.'],
        ]}
      />
      <PropsTable
        title="FloatingButton"
        rows={[
          ['href', 'string', '', 'Destino (ex.: link do WhatsApp).'],
          ['icon', ICON_PROP, '', 'Ícone do botão.'],
          ['label', 'string', '', 'Rótulo acessível e tooltip.'],
          ['tone', "Tone | 'whatsapp'", "'accent'", 'Cor de fundo.'],
          ['position', "'bottom-right' | 'bottom-left'", "'bottom-right'", 'Canto da tela.'],
          ['pulse', 'boolean', 'false', 'Anel pulsando (respeita reduced-motion).'],
        ]}
      />
      <PropsTable
        title="Steps / SectionHeader / Textarea"
        rows={[
          ['Steps.items', '{ title, description?, icon? }[]', '', 'Etapas; sem ícone mostra o número.'],
          ['Steps.orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Direção.'],
          ['SectionHeader', 'eyebrow, title, description, align, size, titleId', '', 'Cabeçalho de seção.'],
          ['Textarea', 'label, hint, error, success, showCount, resize', '', 'Mesmo visual e estados do Input.'],
          ['Input.success / Button.href', 'boolean | ReactNode / string', '', 'Estado de sucesso; botão renderizado como link.'],
        ]}
      />
    </>
  );
}

export function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Feedback"
        description="Alert (mensagem em linha), StateView (carregando/sucesso/erro/vazio) e Spinner. Sempre ícone + texto, com anúncio para leitores de tela."
      />
      <Example name="feedback/Alerts" title="Alert" description="danger usa role=alert (anuncia imediatamente); os demais role=status." />
      <Example name="feedback/States" title="StateView e Spinner" />
      <PropsTable
        title="Alert"
        rows={[
          ['tone', "'info' | 'success' | 'warning' | 'danger'", "'info'", 'Tom semântico (ícone e cor).'],
          ['title', 'ReactNode', '', 'Título em destaque.'],
          ['action', 'ReactNode', '', 'Ação abaixo da mensagem.'],
          ['live', "'assertive' | 'polite' | 'off'", 'por tom', 'Como leitores de tela anunciam.'],
        ]}
      />
      <PropsTable
        title="StateView"
        rows={[
          ['status', "'loading' | 'success' | 'error' | 'warning' | 'info' | 'neutral'", '', 'Estado exibido.'],
          ['title', 'ReactNode', '', 'Título.'],
          ['description', 'ReactNode', '', 'Texto de apoio.'],
          ['actions', 'ReactNode', '', 'Botões/links.'],
          ['meta', 'ReactNode', '', 'Detalhe técnico discreto (ex.: código de correlação).'],
        ]}
      />
    </>
  );
}

export function CheckboxPage() {
  return (
    <>
      <PageHeader
        title="Checkbox & CodeInput"
        description="Checkbox nativo com visual Nekkora. CodeInput: código de verificação (OTP) com casas visuais sobre um único input — colar, autocomplete one-time-code e leitores de tela funcionam."
      />
      <Example name="checkbox/Checkbox" title="Exemplos" />
      <PropsTable
        title="CodeInput"
        rows={[
          ['length', 'number', '', 'Quantidade de caracteres.'],
          ['mode', "'numeric' | 'alphanumeric'", "'numeric'", 'Dígitos (teclado numérico) ou letras e dígitos em maiúsculas.'],
          ['onValueChange', '(value) => void', '', 'Valor saneado.'],
          ['onComplete', '(value) => void', '', 'Chamado ao atingir length.'],
        ]}
      />
    </>
  );
}

export function AuthPage() {
  return (
    <>
      <PageHeader
        title="AuthLayout & QrCode"
        description="Estrutura única das telas de autenticação (marca, contexto da organização, card com título/descrição/conteúdo/ações, rodapé e painel institucional opcional). QrCode desenha o QR no navegador, sem serviço externo."
      />
      <Example name="auth/Login" title="Login" />
      <PropsTable
        title="AuthLayout"
        rows={[
          ['title', 'ReactNode', '', 'Título da etapa (h1).'],
          ['description', 'ReactNode', '', 'Texto de apoio.'],
          ['icon', 'IconName', '', 'Ícone da etapa.'],
          ['context', 'ReactNode', '', 'Contexto não editável (use AuthContextBadge).'],
          ['actions', 'ReactNode', '', 'Links secundários abaixo do conteúdo.'],
          ['footer', 'ReactNode', '', 'Rodapé.'],
          ['aside', 'ReactNode', '', 'Painel institucional (some abaixo de 900px).'],
          ['focusTitle / stepKey', 'boolean / string', 'false', 'Move o foco para o título a cada etapa.'],
        ]}
      />
    </>
  );
}

export function AppPage() {
  return (
    <>
      <PageHeader
        title="Aplicação"
        description="Estrutura da área logada (AppShell), paginação por cursor (LoadMore) e lista de detalhes (DescriptionList). Feitos para listas sem total e para telas de consulta da Nekkora Platform."
      />
      <Example name="app/AppShell" title="AppShell" frame={{ height: 560, title: 'Demonstração do AppShell em página inteira' }} description="Menu lateral com grupos e item ativo (aria-current), topo com título e ações e link para pular ao conteúdo. Até 900 px o menu vira painel modal: o foco entra no painel, Tab circula dentro dele e o resto fica inativo (inert); Esc, “Fechar menu” ou o fundo devolvem o foco ao botão; escolher um item leva o foco ao conteúdo. Roda num quadro próprio (página inteira, um único main); use “Celular” para ver o painel." />
      <PropsTable
        title="AppShell"
        rows={[
          ['nav', 'AppNavGroup[]', '', 'Grupos { id, label?, items: { id, label, href, icon?, active?, badge? }[] }. O menu mostra só o que receber: quem decide permissões é a aplicação/API.'],
          ['linkAs', 'ElementType', '<a>', 'Componente de roteamento (ex.: Link do react-router); recebe `to`.'],
          ['brand / brandHref', 'ReactNode / string', "'#'", 'Marca no topo do menu.'],
          ['header', 'ReactNode', '', 'Título da página ou trilha, à esquerda do topo.'],
          ['actions', 'ReactNode', '', 'Ações à direita do topo (ex.: ThemeToggle, conta).'],
          ['sidebarFooter', 'ReactNode', '', 'Rodapé do menu (ex.: organização).'],
          ['navLabel / menuLabel / skipLabel / mainId', 'string', '', 'Rótulo da navegação, do painel (diálogo no celular), texto do link de pular e id do <main>.'],
        ]}
      />
      <Example name="app/LoadMore" title="LoadMore" description="Sem total e sem número de página: mostra quantos itens estão exibidos e o fim da lista. Em falha mantém a lista; com cursor recusado oferece recomeçar (nunca repete sozinho)." />
      <PropsTable
        title="LoadMore"
        rows={[
          ['hasMore', 'boolean', '', 'Há próxima página (nextCursor não nulo).'],
          ['loading', 'boolean', 'false', 'Carregando a próxima página.'],
          ['onLoadMore', '() => void', '', 'Pede a próxima página.'],
          ['count / itemLabel', 'number / string', "— / 'itens'", 'Itens exibidos, anunciados em região viva.'],
          ['error', 'ReactNode', '', 'Falha ao carregar mais; o botão vira "Tentar novamente".'],
          ['stale / onRestart', 'ReactNode / () => void', '', 'Continuação inválida (cursor recusado): aviso e "Recomeçar a lista".'],
          ['unavailable', 'ReactNode', '', 'Continuar indisponível agora (motivo do consumidor): mostra o motivo, sem botão.'],
          ['endLabel / loadLabel', 'ReactNode / string', "'Fim da lista' / 'Carregar mais'", 'Textos.'],
        ]}
      />
      <Example name="app/DescriptionList" title="DescriptionList" description="Pares termo–valor em <dl>. Valor ausente aparece como “—” (lido como “não informado”), para o campo nunca sumir." />
      <PropsTable
        title="DescriptionList"
        rows={[
          ['items', '{ key?, term, description?, wide? }[]', '', 'Pares; wide ocupa a linha inteira.'],
          ['columns', '1 | 2 | 3', '2', 'Colunas no desktop (celular: 1).'],
          ['emptyLabel', 'ReactNode', '—', 'Marcador de valor ausente.'],
        ]}
      />
    </>
  );
}

export function DialogsPage() {
  return (
    <>
      <PageHeader
        title="Diálogos, opções e anúncios"
        description="Dialog e ConfirmDialog (modais com foco preso, página inert e regra única de fechamento durante o envio), RadioGroup (opções exclusivas com rádios nativos) e StatusRegion (região viva persistente para anunciar resultados)."
      />
      <Example name="dialog/ConfirmDialog" title="ConfirmDialog" description="Confirmação com consequências. O foco começa em Cancelar. Confirmar vale uma vez por confirmação (cliques repetidos são ignorados). Durante o envio (busy), Cancelar, Esc, “Fechar” e o fundo não têm efeito. Aqui o botão “Suspender” some depois da ação, então o foco volta para a linha (returnFocus/fallbackFocus), nunca para o body; o resultado é anunciado pela StatusRegion." />
      <PropsTable
        title="ConfirmDialog"
        rows={[
          ['open / title / children', 'boolean / ReactNode / ReactNode', '', 'Aberto, título e consequências da ação.'],
          ['confirmLabel / cancelLabel', 'ReactNode', "— / 'Cancelar'", 'Textos dos botões.'],
          ['tone', "'primary' | 'danger'", "'primary'", 'danger para ações destrutivas.'],
          ['onConfirm', '() => void | Promise', '', 'Chamado uma vez por confirmação; com promessa, trava até ela terminar; busy true→false também libera.'],
          ['onCancel', '(reason) => void', '', 'Cancelar, Esc, “Fechar” ou fundo. Nunca durante busy.'],
          ['busy', 'boolean', 'false', 'Envio em curso: Confirmar carregando; todas as formas de fechar sem efeito.'],
          ['confirmDisabled / error', 'boolean / ReactNode', '', 'Impede confirmar (ex.: resultado anterior incerto); erro dentro do diálogo, como alerta.'],
          ['initialFocus / returnFocus / fallbackFocus', 'FocusTarget', 'Cancelar / quem abriu / <main>', 'Destinos de foco (elemento, ref ou função).'],
        ]}
      />
      <Example name="dialog/Dialog" title="Dialog" description="Diálogo modal genérico, aqui em duas etapas (motivo e código). Renderizado em portal no body; o resto da página fica inert; Tab circula dentro; Esc, “Fechar” e o fundo pedem fechamento por onClose." />
      <PropsTable
        title="Dialog"
        rows={[
          ['open / onClose', 'boolean / (reason) => void', '', "Pedido de fechamento: 'escape' | 'close-button' | 'backdrop' | 'cancel'. Não é chamado durante busy."],
          ['title / description', 'ReactNode', '', 'Rótulo (aria-labelledby) e descrição (aria-describedby).'],
          ['footer / children', 'ReactNode', '', 'Ações e conteúdo.'],
          ['busy', 'boolean', 'false', 'Bloqueia todas as formas de fechamento; aria-busy; se o controle com foco ficar desabilitado, o foco vai ao diálogo.'],
          ['role', "'dialog' | 'alertdialog'", "'dialog'", 'alertdialog para confirmações.'],
          ['initialFocus', 'FocusTarget', 'primeiro controle', 'Foco ao abrir.'],
          ['returnFocus / fallbackFocus', 'FocusTarget', 'quem abriu / <main>', 'Foco ao fechar. Se o destino sumiu ou está inativo, vai ao fallback e depois ao <main> (focável só por programa) — nunca ao body.'],
          ['closeOnBackdrop / showCloseButton / closeLabel', 'boolean / boolean / string', "true / true / 'Fechar'", 'Comportamento e texto do fechamento.'],
          ['size', "'sm' | 'md' | 'lg'", "'md'", 'Largura máxima. No celular, o diálogo vira folha inferior.'],
        ]}
      />
      <Example name="dialog/RadioGroup" title="RadioGroup" description="Opções exclusivas com rádios nativos: Tab entra no grupo, setas trocam a opção. A legenda rotula o grupo; descrição por opção; erro e dica associados ao grupo." />
      <PropsTable
        title="RadioGroup"
        rows={[
          ['legend', 'ReactNode', '', 'Pergunta do grupo (<legend>).'],
          ['options', '{ value, label, description?, disabled? }[]', '', 'Opções.'],
          ['value / onChange', 'string | null / (value) => void', '', 'Controlado; null = nenhuma marcada.'],
          ['required / hint / error', 'boolean / ReactNode / ReactNode', '', 'Obrigatório (marca * visual), dica ou erro (aria-invalid nas opções).'],
          ['orientation / disabled / name', "'vertical' | 'horizontal' / boolean / string", "'vertical'", 'Layout, desabilitar o grupo e nome no formulário.'],
        ]}
      />
      <Section title="StatusRegion">
        <Text color="secondary">
          Região role=&quot;status&quot; (educada, atômica) que fica sempre no documento; só o conteúdo muda, para que o leitor de tela anuncie
          o resultado sem mover o foco. Use announceKey para repetir uma mensagem igual e visuallyHidden quando o resultado já estiver
          visível. Veja o uso no exemplo do ConfirmDialog acima.
        </Text>
      </Section>
      <PropsTable
        title="StatusRegion"
        rows={[
          ['message / title / tone', "ReactNode / ReactNode / AlertTone", "— / — / 'success'", 'Mensagem atual (vazia = região vazia, ainda presente).'],
          ['announceKey', 'string | number', '', 'Muda a cada anúncio para repetir uma mensagem igual.'],
          ['visuallyHidden', 'boolean', 'false', 'Só anuncia, sem mostrar.'],
        ]}
      />
    </>
  );
}
