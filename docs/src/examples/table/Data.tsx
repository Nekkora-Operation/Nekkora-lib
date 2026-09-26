import { Badge, Button, Card, CardHeader, Link, Table, type TableColumn } from 'nekkora-lib';

type Execucao = {
  id: number;
  processo: string;
  status: 'Concluído' | 'Em execução' | 'Falhou';
  inicio: string;
  duracao: string;
  agente: string;
};

const TONE = { Concluído: 'success', 'Em execução': 'info', Falhou: 'danger' } as const;

const data: Execucao[] = [
  { id: 1, processo: 'Download de Faturas', status: 'Concluído', inicio: '10:24', duracao: '2m 14s', agente: 'AGT-01' },
  { id: 2, processo: 'Conciliação Bancária', status: 'Concluído', inicio: '09:17', duracao: '4m 31s', agente: 'AGT-01' },
  { id: 3, processo: 'Envio de Relatórios', status: 'Em execução', inicio: '11:02', duracao: '—', agente: 'AGT-02' },
  { id: 4, processo: 'Atualização de Cadastro', status: 'Falhou', inicio: '08:43', duracao: '1m 12s', agente: 'AGT-01' },
];

const columns: TableColumn<Execucao>[] = [
  { key: 'processo', header: 'Processo' },
  { key: 'status', header: 'Status', render: (r) => <Badge tone={TONE[r.status]} size="sm">{r.status}</Badge> },
  { key: 'inicio', header: 'Início', muted: true },
  { key: 'duracao', header: 'Duração', muted: true },
  { key: 'agente', header: 'Agente' },
  {
    key: 'acoes',
    header: '',
    align: 'right',
    width: 56,
    render: () => <Button variant="ghost" size="sm" icon="more-horizontal" aria-label="Ações" />,
  },
];

export default function TableData() {
  return (
    <Card padding="none">
      <CardHeader title="Execuções recentes" action={<Link href="#" arrow>Ver todas</Link>} />
      <Table columns={columns} data={data} rowKey="id" />
    </Card>
  );
}
