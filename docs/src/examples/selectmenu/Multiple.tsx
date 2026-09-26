import { useState } from 'react';
import { SelectMenu, Text } from 'nekkora-lib';

export default function SelectMenuMultiple() {
  const [agentes, setAgentes] = useState(['agt-01', 'agt-03']);

  return (
    <div style={{ maxWidth: 380 }}>
      <SelectMenu
        fullWidth
        multiple
        label="Executar nos agentes"
        placeholder="Selecione um ou mais"
        value={agentes}
        onChange={setAgentes}
        clearable
        maxChips={3}
        options={[
          { value: 'agt-01', label: 'AGT-01', description: 'Windows Server 2022' },
          { value: 'agt-02', label: 'AGT-02', description: 'Windows 11' },
          { value: 'agt-03', label: 'AGT-03', description: 'Windows Server 2019' },
          { value: 'agt-04', label: 'AGT-04', description: 'Offline', disabled: true },
        ]}
      />
      <Text variant="caption" color="secondary" style={{ marginTop: 8 }}>
        value: {JSON.stringify(agentes)}
      </Text>
    </div>
  );
}
