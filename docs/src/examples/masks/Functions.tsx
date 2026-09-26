import { applyMask, formatCNPJ, formatCPF, formatPhone, formatWithMask, Stack, Text, unmask } from 'nekkora-lib';

const rows = [
  ["formatCPF('12345678909')", formatCPF('12345678909')],
  ["formatCNPJ('11222333000181')", formatCNPJ('11222333000181')],
  ["formatPhone('1133334444')", formatPhone('1133334444')],
  ["formatPhone('11987654321')", formatPhone('11987654321')],
  ["formatWithMask('01310100', 'cep')", formatWithMask('01310100', 'cep')],
  ["applyMask('abc1d23', 'AAA-9*99')", applyMask('abc1d23', 'AAA-9*99')],
  ["unmask('(11) 98765-4321')", unmask('(11) 98765-4321')],
];

export default function MaskFunctions() {
  return (
    <Stack gap={2}>
      {rows.map(([call, result]) => (
        <Text key={call}>
          <Text variant="code">{call}</Text> <Text as="span" color="muted">→</Text>{' '}
          <Text as="span" color="accent" weight="medium">'{result}'</Text>
        </Text>
      ))}
    </Stack>
  );
}
