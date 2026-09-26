import { Card, Container, Text } from 'nekkora-lib';

export default function ContainerExample() {
  return (
    <div style={{ border: '1px dashed var(--nk-color-border-strong)', borderRadius: 12 }}>
      <Container size="sm" padding="md">
        <Card variant="outlined" padding="sm">
          <Text align="center" color="secondary">size="sm" · max-width 640px, centralizado</Text>
        </Card>
      </Container>
    </div>
  );
}
