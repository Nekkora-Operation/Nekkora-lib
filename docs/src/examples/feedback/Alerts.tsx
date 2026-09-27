import { Alert, Link, Stack } from 'nekkora-lib';

export default function Alerts() {
  return (
    <Stack gap={3}>
      <Alert tone="info" title="Confira seu e-mail">
        Se existir uma conta elegível para esse endereço, enviaremos as instruções.
      </Alert>
      <Alert tone="success" title="Senha alterada">Agora você pode entrar usando sua nova senha.</Alert>
      <Alert tone="warning" title="Muitas tentativas">Aguarde alguns minutos e tente novamente.</Alert>
      <Alert tone="danger" action={<Link href="#">Tentar novamente</Link>}>E-mail ou senha incorretos.</Alert>
    </Stack>
  );
}
