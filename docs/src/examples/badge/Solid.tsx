import { Badge, Stack } from 'nekkora-lib';

// Tag preenchida: fundo colorido + texto branco
export default function BadgeSolid() {
  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} wrap>
        <Badge variant="solid" tone="success">Concluído</Badge>
        <Badge variant="solid" tone="info">Em execução</Badge>
        <Badge variant="solid" tone="danger">Falhou</Badge>
        <Badge variant="solid" tone="warning">Pausada</Badge>
        <Badge variant="solid" tone="accent">Novo</Badge>
        <Badge variant="solid" tone="primary">Financeiro</Badge>
        <Badge variant="solid">Rascunho</Badge>
      </Stack>
      <Stack direction="row" gap={2} wrap>
        <Badge variant="solid" tone="success" dot>Online</Badge>
        <Badge variant="solid" tone="accent" icon="star">Favorito</Badge>
        <Badge variant="solid" tone="info" icon="clock" size="sm">Agendada</Badge>
      </Stack>
    </Stack>
  );
}
