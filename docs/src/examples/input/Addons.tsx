import { Grid, Input } from 'nekkora-lib';

export default function InputAddons() {
  return (
    <Grid minColumnWidth="240px" gap={4}>
      <Input placeholder="Buscar automações..." leftIcon="search" shortcut="Ctrl K" />
      <Input label="E-mail" type="email" placeholder="voce@nekkora.com" leftIcon="mail" />
      <Input label="Senha" type="password" placeholder="••••••••" leftIcon="lock" />
      <Input label="Valor" prefix="R$" suffix="BRL" placeholder="0,00" />
      <Input label="Limpável" defaultValue="Download de Faturas" clearable />
      <Input label="Site" prefix="https://" placeholder="nekkora.com" rightIcon="external-link" />
    </Grid>
  );
}
