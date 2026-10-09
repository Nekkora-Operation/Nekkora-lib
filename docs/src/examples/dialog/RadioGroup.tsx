import { useState } from 'react';
import { RadioGroup } from 'nekkora-lib';

export default function RadioGroupExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <RadioGroup
      legend="Motivo da redefinição"
      required
      value={value}
      onChange={setValue}
      error={value ? undefined : 'Escolha um motivo.'}
      options={[
        { value: 'DISPOSITIVO_PERDIDO', label: 'Dispositivo perdido' },
        { value: 'DISPOSITIVO_TROCADO', label: 'Dispositivo trocado', description: 'A pessoa trocou de celular e não migrou o autenticador.' },
        { value: 'SUSPEITA_COMPROMETIMENTO', label: 'Suspeita de comprometimento' },
        { value: 'OUTRO', label: 'Outro' },
      ]}
    />
  );
}
