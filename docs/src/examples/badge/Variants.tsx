import { Badge, Stack } from 'nekkora-lib';

export default function BadgeVariants() {
  return (
    <Stack direction="row" gap={2} align="center" wrap>
      <Badge tone="success" dot variant="outline">Online</Badge>
      <Badge tone="danger" dot variant="outline">Offline</Badge>
      <Badge tone="accent" icon="star">Com ícone</Badge>
      <Badge tone="info" variant="outline">Outline</Badge>
      <Badge tone="success" size="sm">Ativa</Badge>
    </Stack>
  );
}
