import { Badge, Stack } from 'nekkora-lib';

export default function BadgeTones() {
  return (
    <Stack direction="row" gap={2} wrap>
      <Badge tone="success">Concluído</Badge>
      <Badge tone="info">Em execução</Badge>
      <Badge tone="danger">Falhou</Badge>
      <Badge tone="warning">Pausada</Badge>
      <Badge tone="accent">Novo</Badge>
      <Badge>Neutral</Badge>
    </Stack>
  );
}
