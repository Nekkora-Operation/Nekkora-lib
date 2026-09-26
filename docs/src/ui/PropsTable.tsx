import { Table, Text, type TableColumn } from 'nekkora-lib';

/** [nome, tipo, padrão, descrição] */
export type PropRow = [name: string, type: string, defaultValue: string, description: string];

type Row = { name: string; type: string; def: string; desc: string };

const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Prop', width: '18%', render: (r) => <Text variant="code">{r.name}</Text> },
  {
    key: 'type',
    header: 'Tipo',
    width: '32%',
    render: (r) => <code className="doc-type">{r.type}</code>,
  },
  { key: 'def', header: 'Padrão', width: '12%', render: (r) => (r.def ? <code className="doc-type">{r.def}</code> : '—') },
  { key: 'desc', header: 'Descrição', render: (r) => <Text variant="body-sm" color="secondary">{r.desc}</Text> },
];

export function PropsTable({ title = 'Props', rows }: { title?: string; rows: PropRow[] }) {
  return (
    <section className="doc-props">
      <Text variant="h4" as="h3">{title}</Text>
      <Table
        bordered
        size="sm"
        hoverable={false}
        columns={columns}
        data={rows.map(([name, type, def, desc]) => ({ name, type, def, desc }))}
        rowKey="name"
      />
    </section>
  );
}
