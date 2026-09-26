import { Logo, Stack } from 'nekkora-lib';

export default function LogoVariants() {
  return (
    <Stack direction="row" gap={8} align="center" wrap>
      <Logo variant="full" size={40} tagline />
      <Logo variant="symbol" size={48} />
      <Logo variant="wordmark" size={32} />
      <Logo variant="app" size={56} />
    </Stack>
  );
}
