import { Badge, Button, Stack, Text } from 'nekkora-lib';

export default function StackExample() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} align="center">
        <Text weight="semibold">AGT-01</Text>
        <Badge tone="success" dot variant="outline">Online</Badge>
      </Stack>
      <Stack direction="row" justify="space-between" align="center" wrap gap={3}>
        <Text color="secondary">justify="space-between"</Text>
        <Stack direction="row" gap={2}>
          <Button variant="ghost">Cancelar</Button>
          <Button>Salvar</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
