import { useState } from 'react';
import { Input, Stack, Text } from 'nekkora-lib';

export default function InputControlled() {
  const [phone, setPhone] = useState('');

  return (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <Input
        label="Celular"
        mask="phone"
        value={phone}
        onValueChange={(_masked, raw) => setPhone(raw)}
        clearable
      />
      <Text variant="caption" color="secondary">
        Estado (sem máscara): {phone || '—'} · {phone.length <= 10 ? 'fixo' : 'celular'}
      </Text>
    </Stack>
  );
}
