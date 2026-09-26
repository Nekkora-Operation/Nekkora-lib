import { Badge, Button, Card, CardHeader, Grid, Stack, ThemeProvider } from 'nekkora-lib';

function Preview() {
  return (
    <Card>
      <CardHeader icon="chart" title="Taxa de sucesso" subtitle="98,1% · ↑ 2%" />
      <Stack direction="row" gap={2} wrap>
        <Button size="sm" leftIcon="plus">Nova</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
        <Badge tone="success">Concluído</Badge>
      </Stack>
    </Card>
  );
}

export default function ThemesNested() {
  return (
    <Grid minColumnWidth="260px" gap={4}>
      <ThemeProvider theme="midnight-blue" style={{ padding: 16, borderRadius: 12 }}>
        <Preview />
      </ThemeProvider>
      <ThemeProvider theme="sage-light" style={{ padding: 16, borderRadius: 12 }}>
        <Preview />
      </ThemeProvider>
    </Grid>
  );
}
