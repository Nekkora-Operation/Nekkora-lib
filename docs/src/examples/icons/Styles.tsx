import { Icon, Stack } from 'nekkora-lib';

export default function IconStyles() {
  return (
    <Stack direction="row" gap={4} align="center">
      <Icon name="loader" spin />
      <Icon name="check-circle" color="var(--nk-color-success)" />
      <Icon name="alert" color="var(--nk-color-warning)" strokeWidth={2.5} />
      <Icon name="x-circle" color="var(--nk-color-danger)" />
      <Icon name="bell" label="Notificações" />
    </Stack>
  );
}
