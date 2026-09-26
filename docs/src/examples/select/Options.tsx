import { Grid, Select } from 'nekkora-lib';

export default function SelectOptions() {
  return (
    <Grid minColumnWidth="240px" gap={4}>
      <Select
        label="Período"
        leftIcon="calendar"
        defaultValue="7"
        options={[
          { value: 'today', label: 'Hoje' },
          { value: '7', label: 'Últimos 7 dias' },
          { value: '30', label: 'Últimos 30 dias' },
        ]}
      />
      <Select
        label="Processo (grupos)"
        placeholder="Selecione"
        options={[
          { label: 'Financeiro', options: [{ value: 'faturas', label: 'Download de Faturas' }] },
          { label: 'Operações', options: [{ value: 'emails', label: 'Leitura de E-mails' }] },
        ]}
      />
    </Grid>
  );
}
