import { Badge, DescriptionList } from 'nekkora-lib';

export default function DescriptionListExample() {
  return (
    <DescriptionList
      items={[
        { term: 'Status', description: <Badge tone="success">Concluída</Badge> },
        { term: 'Origem', description: 'Agendada' },
        { term: 'Início', description: '03/10/2026 06:00:05' },
        { term: 'Duração', description: '1 min 0 s' },
        { term: 'Solicitante', description: null },
        { term: 'Nova tentativa de', description: undefined },
        { term: 'Automação', description: 'Conciliação bancária diária · versão 3', wide: true },
      ]}
    />
  );
}
