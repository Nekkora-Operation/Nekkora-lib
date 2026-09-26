import { Grid, Select } from 'nekkora-lib';

const status = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'pausada', label: 'Pausada' },
];

export default function SelectStates() {
  return (
    <Grid minColumnWidth="200px" gap={4}>
      <Select size="sm" aria-label="Small" options={status} />
      <Select size="md" aria-label="Medium" options={status} />
      <Select size="lg" aria-label="Large" options={status} />
      <Select label="Com erro" placeholder="Obrigatório" error="Selecione um status" required options={status} />
      <Select label="Desabilitado" disabled options={status} />
      <Select label="Variant filled" variant="filled" options={status} />
    </Grid>
  );
}
