import { SelectMenu } from 'nekkora-lib';

export default function SelectMenuIcons() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SelectMenu
        fullWidth
        label="Gatilho da automação"
        placeholder="Como a automação inicia?"
        options={[
          { value: 'agenda', label: 'Agendamento', icon: 'calendar' },
          { value: 'email', label: 'Novo e-mail recebido', icon: 'mail' },
          { value: 'arquivo', label: 'Arquivo na pasta', icon: 'folder' },
          { value: 'webhook', label: 'Webhook', icon: 'link' },
          { value: 'manual', label: 'Execução manual', icon: 'play' },
        ]}
      />
    </div>
  );
}
