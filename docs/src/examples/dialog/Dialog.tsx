import { useState } from 'react';
import { Button, CodeInput, Dialog, RadioGroup, Stack } from 'nekkora-lib';

const motivos = [
  { value: 'DISPOSITIVO_PERDIDO', label: 'Dispositivo perdido' },
  { value: 'DISPOSITIVO_TROCADO', label: 'Dispositivo trocado' },
  { value: 'SUSPEITA_COMPROMETIMENTO', label: 'Suspeita de comprometimento' },
  { value: 'OUTRO', label: 'Outro' },
];

export default function DialogExample() {
  const [open, setOpen] = useState(false);
  const [etapa, setEtapa] = useState<'motivo' | 'codigo'>('motivo');
  const [motivo, setMotivo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');

  const fechar = () => {
    setOpen(false);
    setEtapa('motivo');
    setMotivo(null);
    setCodigo('');
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Redefinir MFA
      </Button>
      <Dialog
        open={open}
        onClose={fechar}
        title="Redefinir MFA de Davi Leitor"
        description={etapa === 'motivo' ? 'Etapa 1 de 2: motivo.' : 'Etapa 2 de 2: confirme sua identidade.'}
        footer={
          <>
            <Button variant="ghost" onClick={fechar}>
              Cancelar
            </Button>
            {etapa === 'motivo' ? (
              <Button disabled={!motivo} onClick={() => setEtapa('codigo')}>
                Continuar
              </Button>
            ) : (
              <Button variant="danger" disabled={codigo.length < 6} onClick={fechar}>
                Redefinir
              </Button>
            )}
          </>
        }
      >
        {etapa === 'motivo' ? (
          <RadioGroup legend="Motivo" options={motivos} value={motivo} onChange={setMotivo} required />
        ) : (
          <Stack gap={2}>
            <CodeInput length={6} label="Código do seu aplicativo autenticador" value={codigo} onValueChange={setCodigo} />
          </Stack>
        )}
      </Dialog>
    </>
  );
}
