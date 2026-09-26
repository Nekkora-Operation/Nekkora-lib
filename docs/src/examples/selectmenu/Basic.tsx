import { SelectMenu } from 'nekkora-lib';

export default function SelectMenuBasic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SelectMenu
        fullWidth
        label="Período"
        leftIcon="calendar"
        defaultValue="7"
        options={[
          { value: 'hoje', label: 'Hoje' },
          { value: '7', label: 'Últimos 7 dias' },
          { value: '30', label: 'Últimos 30 dias' },
          { value: '90', label: 'Últimos 90 dias' },
          { value: 'custom', label: 'Personalizado...', disabled: true },
        ]}
      />
    </div>
  );
}
