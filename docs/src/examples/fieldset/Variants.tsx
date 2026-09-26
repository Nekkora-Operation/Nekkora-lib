import { Fieldset, Input, Select, Stack } from 'nekkora-lib';

export default function FieldsetVariants() {
  return (
    <Stack gap={6}>
      <Fieldset legend="Responsável" variant="divided" columns={3}>
        <Input label="Nome" placeholder="Ana Martins" leftIcon="user" />
        <Input label="CPF" mask="cpf" placeholder="000.000.000-00" />
        <Input label="Celular" mask="phone" placeholder="(00) 00000-0000" />
      </Fieldset>

      <Fieldset legend="Desabilitado" description="disabled propaga para todos os campos." disabled columns={2}>
        <Input label="Agente" defaultValue="AGT-02" />
        <Select label="Status" options={[{ value: 'a', label: 'Ativa' }]} />
      </Fieldset>
    </Stack>
  );
}
