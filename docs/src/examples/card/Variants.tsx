import { Card, CardHeader, Grid, Text } from 'nekkora-lib';

export default function CardVariants() {
  return (
    <Grid minColumnWidth="200px" gap={4}>
      <Card variant="surface"><Text>surface</Text></Card>
      <Card variant="raised">
        <CardHeader icon="sakura" iconVariant="solid" title="raised" subtitle="que vão mais longe." />
      </Card>
      <Card variant="outlined"><Text>outlined</Text></Card>
      <Card variant="glow"><Text weight="medium">glow (item ativo)</Text></Card>
    </Grid>
  );
}
