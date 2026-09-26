import { useState } from 'react';
import { Grid, Input, Text } from 'nekkora-lib';

// 9 = dígito · A = letra · * = letra ou dígito
export default function InputCustomMask() {
  const [raw, setRaw] = useState('');

  return (
    <Grid minColumnWidth="240px" gap={4}>
      <Input
        label="Placa Mercosul"
        mask="AAA-9*99"
        placeholder="ABC-1D23"
        onValueChange={(_masked, unmasked) => setRaw(unmasked)}
        hint={<Text variant="caption" color="secondary">valor bruto: {raw || '—'}</Text>}
      />
      <Input label="Com valor inicial" mask="cpf" defaultValue="12345678909" />
    </Grid>
  );
}
