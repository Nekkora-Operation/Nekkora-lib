import { AppShell, Logo, Text, UserMenu, type AppNavGroup } from 'nekkora-lib';

const nav: AppNavGroup[] = [
  {
    id: 'principal',
    items: [
      { id: 'inicio', label: 'Início', href: '#inicio', icon: 'home', active: true },
      { id: 'organizacoes', label: 'Organizações', href: '#organizacoes', icon: 'building' },
    ],
  },
  {
    id: 'conta',
    label: 'Conta',
    items: [
      { id: 'configuracoes', label: 'Configurações', href: '#configuracoes', icon: 'settings' },
      { id: 'ajuda', label: 'Ajuda', href: '#ajuda', icon: 'help' },
    ],
  },
];

// Topo de largura total com a marca; o menu fica abaixo dele, recolhido, e expande ao passar o mouse.
export default function AppShellHeaderExample() {
  return (
    <AppShell
      layout="header"
      brand={<Logo size={24} />}
      nav={nav}
      header={<Text variant="h4" as="h1">Início</Text>}
      actions={<UserMenu name="Ana Souza" accountLevel="Administrador" onSignOut={() => {}} />}
      sidebarFooter={<Text variant="body-sm" color="secondary">Nekkora Platform 2.2.1 · © 2026 Nekkora</Text>}
      sidebarFooterCompact={<>v2.2.1<br />© 2026</>}
    >
      <Text>Passe o mouse sobre o menu (ou navegue com Tab) para ver os rótulos. Clique no círculo para abrir a conta.</Text>
    </AppShell>
  );
}
