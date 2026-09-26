import { Icon, Stack } from 'nekkora-lib';

export default function IconSizes() {
  return (
    <Stack direction="row" gap={4} align="center">
      <Icon name="sakura" size="xs" />
      <Icon name="sakura" size="sm" />
      <Icon name="sakura" size="md" />
      <Icon name="sakura" size="lg" />
      <Icon name="sakura" size="xl" />
      <Icon name="sakura" size={40} />
    </Stack>
  );
}
