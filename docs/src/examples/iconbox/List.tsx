import { Badge, IconBox, Stack, Text, type IconName, type Tone } from 'nekkora-lib';

const processos: { nome: string; area: string; icon: IconName; tone: Tone; status: string; statusTone: Tone }[] = [
  { nome: 'Download de Faturas', area: 'Financeiro', icon: 'download', tone: 'accent', status: 'Ativa', statusTone: 'success' },
  { nome: 'Conciliação Bancária', area: 'Financeiro', icon: 'building', tone: 'primary', status: 'Ativa', statusTone: 'success' },
  { nome: 'Atualização de Cadastro', area: 'Comercial', icon: 'users', tone: 'info', status: 'Pausada', statusTone: 'warning' },
  { nome: 'Leitura de E-mails', area: 'Operações', icon: 'mail', tone: 'success', status: 'Falhou', statusTone: 'danger' },
];

export default function IconBoxList() {
  return (
    <Stack gap={3} style={{ maxWidth: 480 }}>
      {processos.map((p) => (
        <Stack key={p.nome} direction="row" gap={3} align="center">
          <IconBox icon={p.icon} tone={p.tone} size="sm" />
          <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
            <Text weight="medium" truncate>{p.nome}</Text>
            <Text variant="caption" color="secondary">{p.area}</Text>
          </Stack>
          <Badge tone={p.statusTone} variant="solid" size="sm">{p.status}</Badge>
        </Stack>
      ))}
    </Stack>
  );
}
