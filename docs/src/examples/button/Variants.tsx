import { Button, Stack } from 'nekkora-lib';

export default function ButtonVariants() {
  return (
    <Stack direction="row" gap={3} wrap>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Stack>
  );
}
