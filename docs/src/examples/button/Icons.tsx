import { Button, Stack } from 'nekkora-lib';

export default function ButtonIcons() {
  return (
    <Stack direction="row" gap={3} align="center" wrap>
      <Button leftIcon="plus">Nova automação</Button>
      <Button variant="secondary" leftIcon="download">Exportar</Button>
      <Button variant="outline" rightIcon="arrow-right">Continuar</Button>
      <Button icon="plus" aria-label="Adicionar" />
      <Button variant="secondary" icon="bell" aria-label="Notificações" />
      <Button variant="ghost" size="sm" icon="more-horizontal" aria-label="Mais ações" />
    </Stack>
  );
}
