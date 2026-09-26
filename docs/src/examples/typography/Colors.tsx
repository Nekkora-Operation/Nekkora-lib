import { Stack, Text } from 'nekkora-lib';

export default function TypographyColors() {
  return (
    <Stack direction="row" gap={5} wrap>
      <Text>default</Text>
      <Text color="secondary">secondary</Text>
      <Text color="muted">muted</Text>
      <Text color="accent">accent</Text>
      <Text color="highlight">highlight</Text>
      <Text color="success" weight="semibold">↑ 20% success</Text>
      <Text color="info">info</Text>
      <Text color="warning">warning</Text>
      <Text color="danger">danger</Text>
    </Stack>
  );
}
