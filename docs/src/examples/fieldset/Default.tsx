import { Button, Fieldset, Input, Select } from 'nekkora-lib';

export default function FieldsetDefault() {
  return (
    <Fieldset
      legend="Dados da empresa"
      description="Informações usadas no cadastro do workspace."
      icon="building"
      columns={2}
      action={<Button variant="ghost" size="sm" leftIcon="edit">Editar</Button>}
    >
      <Input label="Razão social" placeholder="Nekkora Ltda." required />
      <Input label="CNPJ" mask="cnpj" placeholder="00.000.000/0000-00" required />
      <Input label="Telefone" mask="phone" leftIcon="phone" placeholder="(00) 0000-0000" />
      <Select
        label="Segmento"
        placeholder="Selecione"
        options={[
          { value: 'fin', label: 'Financeiro' },
          { value: 'op', label: 'Operações' },
        ]}
      />
    </Fieldset>
  );
}
