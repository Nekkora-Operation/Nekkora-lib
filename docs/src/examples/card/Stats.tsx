import { Card, Grid, Icon, Stack, Text, type IconName } from 'nekkora-lib';

const stats: [IconName, string, string, string, string][] = [
  ['box', 'Automações', '24', '↑ 20%', 'vs. mês anterior'],
  ['play', 'Execuções (hoje)', '156', '↑ 12%', 'vs. ontem'],
  ['chart', 'Taxa de sucesso', '98,1%', '↑ 2%', 'vs. mês anterior'],
  ['monitor', 'Agentes online', '3 / 3', '', 'Todos operacionais'],
];

export default function CardStats() {
  return (
    <Grid minColumnWidth="200px" gap={4}>
      {stats.map(([icon, label, value, delta, caption]) => (
        <Card key={label} interactive>
          <Stack direction="row" gap={4} align="flex-start">
            <span
              style={{
                display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 8,
                background: 'var(--nk-color-icon-bg)', color: 'var(--nk-color-accent)',
              }}
            >
              <Icon name={icon} />
            </span>
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
