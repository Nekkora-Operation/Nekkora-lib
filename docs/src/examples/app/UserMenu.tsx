import { useState } from 'react';
import { Avatar, Stack, Text, UserMenu } from 'nekkora-lib';

export default function UserMenuExample() {
  const [saidas, setSaidas] = useState(0);
  return (
    <Stack gap={5}>
      <Stack direction="row" gap={3} align="center">
        <Avatar name="Ana Souza" size="sm" />
        <Avatar name="Ana Souza" />
        <Avatar name="Ana Souza" size="lg" />
        <Avatar name="Bruno" initials="BR" />
      </Stack>
      <Stack direction="row" gap={4} align="center" justify="end">
        <Text variant="body-sm" color="secondary">Sair foi acionado {saidas}×</Text>
        <UserMenu name="Ana Souza" accountLevel="Desenvolvedor" onSignOut={() => setSaidas((n) => n + 1)} />
      </Stack>
    </Stack>
  );
}
