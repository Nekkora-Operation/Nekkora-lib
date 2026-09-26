import { Button, Logo, Navbar } from 'nekkora-lib';

export default function NavbarEx() {
  return (
    <div style={{ border: '1px solid var(--nk-color-border)', borderRadius: 12, overflow: 'hidden' }}>
      <Navbar
        sticky={false}
        brand={<Logo size={24} />}
        links={[
          { label: 'Início', href: '#inicio' },
          { label: 'Studio', href: '#studio' },
          { label: 'Contato', href: '#contato' },
        ]}
        activeHref="#studio"
        actions={<Button size="sm" leftIcon="whatsapp" href="https://wa.me/">Falar no WhatsApp</Button>}
      />
    </div>
  );
}
