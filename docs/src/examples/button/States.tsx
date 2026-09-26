import { useState } from 'react';
import { Button, Stack } from 'nekkora-lib';

export default function ButtonStates() {
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={3} wrap>
        <Button loading={loading} onClick={save} leftIcon="check">
          {loading ? 'Salvando' : 'Clique para salvar'}
        </Button>
        <Button disabled>Desabilitado</Button>
        <Button variant="primary" pill leftIcon="sakura">Pill</Button>
      </Stack>
      <div style={{ maxWidth: 360 }}>
        <Button fullWidth rightIcon="arrow-right">Entrar na plataforma</Button>
      </div>
    </Stack>
  );
}
