import { Card, Grid, Text } from 'nekkora-lib';

export default function GridExample() {
  return (
    <Grid minColumnWidth="160px" gap={3}>
      {['Automações', 'Execuções', 'Sucesso', 'Agentes', 'Processos'].map((label) => (
        <Card key={label} padding="sm">
          <Text variant="body-sm" color="secondary">{label}</Text>
        </Card>
      ))}
    </Grid>
  );
}
