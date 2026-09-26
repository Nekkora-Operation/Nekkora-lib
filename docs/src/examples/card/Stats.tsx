import { Card, Grid, IconBox, Stack, Text, type IconName, type Tone } from 'nekkora-lib';

const stats: [IconName, Tone, string, string, string, string][] = [
  ['box', 'accent', 'Automações', '24', '↑ 20%', 'vs. mês anterior'],
  ['play', 'info', 'Execuções (hoje)', '156', '↑ 12%', 'vs. ontem'],
  ['chart', 'success', 'Taxa de sucesso', '98,1%', '↑ 2%', 'vs. mês anterior'],
  ['monitor', 'primary', 'Agentes online', '3 / 3', '', 'Todos operacionais'],
];

export default function CardStats() {
  return (
    <Grid minColumnWidth="200px" gap={4}>
      {stats.map(([icon, tone, label, value, delta, caption]) => (
        <Card key={label} interactive>
          <Stack direction="row" gap={4} align="flex-start">
            <IconBox icon={icon} tone={tone} size="lg" />
            <Stack gap={1}>
              <Text variant="body-sm" color="secondary">{label}</Text>
              <Text variant="h2" as="div">{value}</Text>
              <Text variant="caption" color="secondary">
                {delta && <Text as="span" variant="caption" color="success" weight="semibold">{delta} </Text>}
                {caption}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Grid>
  );
}
