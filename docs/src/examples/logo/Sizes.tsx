import { Logo, Stack } from 'nekkora-lib';

export default function LogoSizes() {
  return (
    <Stack gap={5}>
      <Stack direction="row" gap={5} align="center">
        <Logo variant="symbol" size={16} />
        <Logo variant="symbol" size={24} />
        <Logo variant="symbol" size={32} />
        <Logo variant="symbol" size={48} />
        <Logo variant="symbol" size={72} />
      </Stack>
      <Stack direction="row" gap={4} align="center">
        <Logo variant="app" size={24} />
        <Logo variant="app" size={32} />
        <Logo variant="app" size={48} />
        <Logo variant="app" size={72} />
      </Stack>
    </Stack>
  );
}
