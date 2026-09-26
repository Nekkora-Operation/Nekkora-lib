import { SectionHeader, Stack } from 'nekkora-lib';

export default function SectionHeaderEx() {
  return (
    <Stack gap={8}>
      <SectionHeader
        eyebrow="Monitoramento"
        title="Não basta executar. É preciso acompanhar."
        description="Acompanhamos execuções, falhas e eventos da sua automação."
      />
      <SectionHeader align="center" size="lg" eyebrow="Contato" title="Vamos conversar?" />
    </Stack>
  );
}
