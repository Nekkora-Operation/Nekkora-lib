import { IconBox, Stack } from 'nekkora-lib';

export default function IconBoxSizes() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3} align="center">
        <IconBox icon="monitor" size="xs" />
        <IconBox icon="monitor" size="sm" />
        <IconBox icon="monitor" size="md" />
        <IconBox icon="monitor" size="lg" />
        <IconBox icon="monitor" size="xl" />
      </Stack>
      <Stack direction="row" gap={3} align="center">
        <IconBox icon="user" shape="circle" tone="primary" size="lg" />
        <IconBox icon="user" shape="rounded" tone="primary" size="lg" />
        <IconBox icon="user" shape="square" tone="primary" size="lg" />
      </Stack>
    </Stack>
  );
}
