import { IconBox, Stack, Text } from 'nekkora-lib';

const tones = ['accent', 'primary', 'success', 'info', 'warning', 'danger'] as const;

export default function IconBoxVariants() {
  return (
    <Stack gap={3}>
      {(['solid', 'soft', 'outline'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap={3} align="center" wrap>
          <Text variant="caption" color="secondary" style={{ width: 56 }}>{variant}</Text>
          {tones.map((tone) => (
            <IconBox key={tone} icon="box" tone={tone} variant={variant} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
