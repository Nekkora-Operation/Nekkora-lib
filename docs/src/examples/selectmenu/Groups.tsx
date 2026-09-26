import { SelectMenu } from 'nekkora-lib';

export default function SelectMenuGroups() {
  return (
    <div style={{ maxWidth: 340 }}>
      <SelectMenu
        fullWidth
        label="Processo"
        placeholder="Buscar processo"
        searchable
        searchPlaceholder="Digite para filtrar..."
        clearable
        options={[
          {
            label: 'Financeiro',
            options: [
              { value: 'faturas', label: 'Download de Faturas', icon: 'download', meta: '35%' },
              { value: 'conciliacao', label: 'Conciliação Bancária', icon: 'building', meta: '12%' },
            ],
          },
          {
            label: 'Comercial',
            options: [{ value: 'cadastro', label: 'Atualização de Cadastro', icon: 'users', meta: '22%' }],
          },
          {
            label: 'Operações',
            options: [
              { value: 'emails', label: 'Leitura de E-mails', icon: 'mail', meta: '18%' },
              { value: 'relatorios', label: 'Envio de Relatórios', icon: 'file', meta: '8%' },
            ],
          },
        ]}
      />
    </div>
  );
}
