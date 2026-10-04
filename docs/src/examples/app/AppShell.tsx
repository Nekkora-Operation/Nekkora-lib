import { AppShell, Badge, DescriptionList, Logo, Stack, Text, ThemeToggle, type AppNavGroup } from 'nekkora-lib';

const nav: AppNavGroup[] = [
  {
    id: 'produto',
    label: 'Produto',
    items: [
      { id: 'execucoes', label: 'Execuções', href: '#execucoes', icon: 'executions', active: true },
      { id: 'workspaces', label: 'Workspaces', href: '#workspaces', icon: 'workspace' },
      { id: 'automacoes', label: 'Automações', href: '#automacoes', icon: 'workflow' },
    ],
  },
  {
    id: 'admin',
    label: 'Administração',
    items: [{ id: 'membros', label: 'Membros', href: '#membros', icon: 'users' }],
  },
];

// Página inteira: na aplicação, o AppShell é a página (aqui ele roda num quadro próprio da documentação).
export default function AppShellExample() {
  return (
    <AppShell
      brand={<Logo size={24} />}
      nav={nav}
      header={<Text variant="h4" as="h1">Execuções</Text>}
      actions={<ThemeToggle size="sm" />}
      sidebarFooter={<Text variant="body-sm" color="secondary">Organização de desenvolvimento</Text>}
    >
      <Stack gap={4}>
        <Text>O menu mostra só os itens que a aplicação entregar; quem decide o acesso é a API.</Text>
        <DescriptionList
          items={[
            { term: 'Status', description: <Badge tone="success">Concluída</Badge> },
            { term: 'Solicitante', description: null },
          ]}
        />
      </Stack>
    </AppShell>
  );
}
