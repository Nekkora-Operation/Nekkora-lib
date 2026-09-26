import { Button, Stack } from 'nekkora-lib';

export default function ButtonSizes() {
  return (
    <Stack direction="row" gap={3} align="center" wrap>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Stack>
  );
}
