import { Heading, Stack, Text } from 'nekkora-lib';

export default function TypographyModifiers() {
  return (
    <Stack gap={3}>
      <Heading level={2} gradient>Texto com gradiente</Heading>
      <Text weight="bold">weight="bold"</Text>
      <Text align="center" color="secondary">align="center"</Text>
      <div style={{ maxWidth: 240 }}>
        <Text truncate>truncate — um texto bem longo que não cabe na linha</Text>
      </div>
      <Text variant="h4" as="span">variant h4 renderizado como span</Text>
    </Stack>
  );
}
