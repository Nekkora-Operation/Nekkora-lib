import { Link, Stack } from 'nekkora-lib';

export default function LinkIcons() {
  return (
    <Stack direction="row" gap={6} align="center" wrap>
      <Link href="#" arrow>Ver todas</Link>
      <Link href="#" leftIcon="file" variant="default">Documentação</Link>
      <Link href="https://github.com" external>Link externo</Link>
      <Link href="#" size="sm">Small</Link>
      <Link href="#" size="lg" arrow>Large</Link>
    </Stack>
  );
}
