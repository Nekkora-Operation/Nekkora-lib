import { Grid, Input } from 'nekkora-lib';

export default function InputStates() {
  return (
    <Grid minColumnWidth="240px" gap={4}>
      <Input label="Obrigatório" required placeholder="Nome completo" hint="Como aparece no documento" />
      <Input label="Com erro" mask="cpf" defaultValue="123456" error="CPF incompleto" />
      <Input label="Desabilitado" defaultValue="AGT-01" disabled />
      <Input label="Variant filled" variant="filled" placeholder="Filled" />
      <Input label="Variant ghost" variant="ghost" placeholder="Ghost" />
    </Grid>
  );
}
