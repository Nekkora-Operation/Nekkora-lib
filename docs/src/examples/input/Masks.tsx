import { Grid, Input } from 'nekkora-lib';

export default function InputMasks() {
  return (
    <Grid minColumnWidth="240px" gap={4}>
      <Input label="CPF" mask="cpf" placeholder="000.000.000-00" leftIcon="id-card" />
      <Input label="CNPJ" mask="cnpj" placeholder="00.000.000/0000-00" leftIcon="building" />
      <Input label="CPF ou CNPJ" mask="cpfCnpj" placeholder="Digite o documento" />
      <Input label="Telefone / Celular" mask="phone" placeholder="(00) 00000-0000" leftIcon="phone" />
      <Input label="CEP" mask="cep" placeholder="00000-000" />
      <Input label="Data" mask="date" placeholder="dd/mm/aaaa" rightIcon="calendar" />
    </Grid>
  );
}
