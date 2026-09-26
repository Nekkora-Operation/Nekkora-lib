import { Grid, SelectMenu } from 'nekkora-lib';

const status = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'pausada', label: 'Pausada' },
];

export default function SelectMenuStates() {
  return (
    <Grid minColumnWidth="200px" gap={4}>
      <SelectMenu size="sm" aria-label="Small" options={status} placeholder="size sm" />
      <SelectMenu size="md" aria-label="Medium" options={status} placeholder="size md" />
      <SelectMenu size="lg" aria-label="Large" options={status} placeholder="size lg" />
      <SelectMenu label="Com erro" required options={status} error="Selecione um status" />
      <SelectMenu label="Desabilitado" disabled options={status} defaultValue="pausada" />
      <SelectMenu label="Variant filled" variant="filled" options={status} />
    </Grid>
  );
}
