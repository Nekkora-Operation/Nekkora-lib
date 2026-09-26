import { Input, Stack } from 'nekkora-lib';

export default function InputSizes() {
  return (
    <Stack gap={3} style={{ maxWidth: 360 }}>
      <Input size="sm" placeholder="size sm" leftIcon="search" />
      <Input size="md" placeholder="size md" leftIcon="search" />
      <Input size="lg" placeholder="size lg" leftIcon="search" />
    </Stack>
  );
}
