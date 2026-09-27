import { AuthContextBadge, AuthLayout, Button, Input, Link, QrCode, Text } from 'nekkora-lib';

export default function AuthExample() {
  return (
    <div style={{ height: 760, overflow: 'auto', borderRadius: 12 }}>
      <AuthLayout
        title="Bem-vinda de volta"
        description="Acesse sua conta para continuar."
        context={<AuthContextBadge label="Acessando" value="Nekkora Demo" />}
        actions={<Link href="#">Esqueci minha senha</Link>}
        footer="© Nekkora"
        aside={
          <Text variant="h2" color="secondary">
            Automação com clareza, operação com confiança.
          </Text>
        }
        style={{ minHeight: 760 }}
      >
        <Input label="E-mail" type="email" placeholder="voce@empresa.com" fullWidth />
        <Input label="Senha" type="password" fullWidth />
        <Button fullWidth>Entrar</Button>
        <QrCode value="otpauth://totp/Nekkora:exemplo?secret=JBSWY3DPEHPK3PXP&issuer=Nekkora" label="QR de exemplo" size={120} />
      </AuthLayout>
    </div>
  );
}
