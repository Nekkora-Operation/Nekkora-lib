import { IconBox, Stack } from 'nekkora-lib';

// Tag preenchida: fundo colorido + ícone branco
export default function IconBoxSolid() {
  return (
    <Stack direction="row" gap={3} wrap>
      <IconBox icon="sakura" tone="accent" />
      <IconBox icon="layers" tone="primary" />
      <IconBox icon="check-circle" tone="success" />
      <IconBox icon="play" tone="info" />
      <IconBox icon="clock" tone="warning" />
      <IconBox icon="alert" tone="danger" />
      <IconBox icon="robot" tone="neutral" />
    </Stack>
  );
}
