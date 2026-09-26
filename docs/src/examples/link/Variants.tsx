import { Link, Stack } from 'nekkora-lib';

export default function LinkVariants() {
  return (
    <Stack direction="row" gap={6} align="center" wrap>
      <Link href="#">Accent (padrão)</Link>
      <Link href="#" variant="default">Default</Link>
      <Link href="#" variant="subtle">Subtle</Link>
      <Link href="#" underline="always">Sempre sublinhado</Link>
      <Link href="#" disabled>Desabilitado</Link>
    </Stack>
  );
}
