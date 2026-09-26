import { Badge, SelectMenu } from 'nekkora-lib';

// Opções com IconBox, descrição e badge à direita
export default function SelectMenuRich() {
  return (
    <div style={{ maxWidth: 380 }}>
      <SelectMenu
        fullWidth
        label="Agente"
        optionIcon="box"
        defaultValue="agt-01"
        options={[
          {
            value: 'agt-01',
            label: 'AGT-01',
            description: 'Windows Server 2022 · CPU 24%',
            icon: 'monitor',
            iconTone: 'accent',
            meta: <Badge tone="success" variant="solid" size="sm" dot>Online</Badge>,
          },
          {
            value: 'agt-02',
            label: 'AGT-02',
            description: 'Windows 11 · CPU 18%',
            icon: 'monitor',
            iconTone: 'info',
            meta: <Badge tone="success" variant="solid" size="sm" dot>Online</Badge>,
          },
          {
            value: 'agt-04',
            label: 'AGT-04',
            description: 'Sem sinal há 2 horas',
            icon: 'monitor',
            iconTone: 'neutral',
            meta: <Badge tone="danger" variant="solid" size="sm" dot>Offline</Badge>,
            disabled: true,
          },
        ]}
      />
    </div>
  );
}
