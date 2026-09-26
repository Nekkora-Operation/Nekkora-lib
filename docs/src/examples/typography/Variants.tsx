import { Stack, Text } from 'nekkora-lib';

export default function TypographyVariants() {
  return (
    <Stack gap={2}>
      <Text variant="display">Bem-vinda, Ana</Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="body-lg">Body large — estado das suas automações.</Text>
      <Text>Body — estado das suas automações e agentes.</Text>
      <Text variant="body-sm">Body small — 2 aguardando revisão</Text>
      <Text variant="caption">Caption — Segunda-feira, 28 de Abril</Text>
      <Text variant="overline">Automate · Observe · Evolve</Text>
      <Text>
        Instale com <Text variant="code">npm i nekkora-lib</Text>
      </Text>
    </Stack>
  );
}
