import { Icon, Stack, Text } from 'nekkora-lib';

const names = ['home', 'search', 'bell', 'calendar', 'robot', 'sakura'] as const;

export default function IconStyles() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={5} align="center">
        <Text variant="caption" color="secondary" style={{ width: 70 }}>duotone</Text>
        {names.map((n) => <Icon key={n} name={n} size="lg" />)}
      </Stack>
      <Stack direction="row" gap={5} align="center">
        <Text variant="caption" color="secondary" style={{ width: 70 }}>outline</Text>
        {names.map((n) => <Icon key={n} name={n} size="lg" variant="outline" />)}
      </Stack>
      <Stack direction="row" gap={5} align="center">
        <Text variant="caption" color="secondary" style={{ width: 70 }}>2 cores</Text>
        {names.map((n) => (
          <Icon key={n} name={n} size="lg" secondaryColor="var(--nk-color-accent)" />
        ))}
      </Stack>
    </Stack>
  );
}
