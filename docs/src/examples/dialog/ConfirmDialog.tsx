import { useRef, useState } from 'react';
import { Badge, Button, ConfirmDialog, Stack, StatusRegion, Text } from 'nekkora-lib';

type Estado = 'ativa' | 'suspensa';

export default function ConfirmDialogExample() {
  const [estado, setEstado] = useState<Estado>('ativa');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; n: number } | null>(null);
  const linha = useRef<HTMLDivElement>(null);

  const confirmar = () => {
    setBusy(true);
    // simulação do envio: durante ele, nenhuma forma de fechar tem efeito
    window.setTimeout(() => {
      setBusy(false);
      setEstado('suspensa');
      setOpen(false);
      setAviso((a) => ({ texto: 'Conta de Carla suspensa.', n: (a?.n ?? 0) + 1 }));
    }, 1200);
  };

  return (
    <Stack gap={3}>
      <div ref={linha} tabIndex={-1}>
        <Stack direction="row" gap={2} align="center" wrap>
          <Text>Carla Operadora</Text>
          <Badge tone={estado === 'ativa' ? 'success' : 'warning'}>{estado === 'ativa' ? 'Ativa' : 'Suspensa'}</Badge>
          {estado === 'ativa' ? (
            <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
              Suspender
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setEstado('ativa')}>
              Reativar
            </Button>
          )}
        </Stack>
      </div>
      <StatusRegion message={aviso?.texto} announceKey={aviso?.n} />
      <ConfirmDialog
        open={open}
        title="Suspender Carla Operadora?"
        confirmLabel="Suspender"
        tone="danger"
        busy={busy}
        onConfirm={confirmar}
        onCancel={() => setOpen(false)}
        // o botão "Suspender" some depois da ação: o foco volta para a linha
        returnFocus={() => (estado === 'ativa' ? null : linha.current)}
        fallbackFocus={linha}
      >
        <Text>As sessões abertas serão encerradas. Reativar depois não restaura sessões.</Text>
      </ConfirmDialog>
    </Stack>
  );
}
