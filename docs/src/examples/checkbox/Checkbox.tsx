import { Checkbox, CodeInput, Stack } from 'nekkora-lib';

export default function CheckboxAndCode() {
  return (
    <Stack gap={5} style={{ maxWidth: 360 }}>
      <Checkbox label="Guardei meus códigos de recuperação em um local seguro." />
      <Checkbox label="Receber avisos por e-mail" hint="Você pode mudar depois." defaultChecked />
      <CodeInput label="Código de autenticação" length={6} hint="6 dígitos do aplicativo autenticador." />
      <CodeInput label="Código com erro" length={6} defaultValue="12345" error="Código inválido ou expirado." />
    </Stack>
  );
}
