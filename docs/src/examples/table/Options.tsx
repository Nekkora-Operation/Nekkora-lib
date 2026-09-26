import { useState } from 'react';
import { Button, Stack, Table } from 'nekkora-lib';

const data = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  agente: `AGT-0${(i % 3) + 1}`,
  cpu: `${10 + ((i * 7) % 40)}%`,
}));

const columns = [
  { key: 'id', header: '#', width: 60 },
  { key: 'agente', header: 'Agente' },
  { key: 'cpu', header: 'CPU', align: 'right' as const, muted: true },
];

export default function TableOptions() {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2}>
        <Button size="sm" variant="secondary" onClick={() => setLoading((v) => !v)}>Alternar loading</Button>
        <Button size="sm" variant="secondary" onClick={() => setEmpty((v) => !v)}>Alternar vazio</Button>
      </Stack>
      <Table
        columns={columns}
        data={empty ? [] : data}
        rowKey="id"
        size="sm"
        striped
        bordered
        stickyHeader
        maxHeight={220}
        loading={loading}
        emptyMessage="Nenhum agente encontrado."
        onRowClick={(row) => setSelected(row.id)}
        caption={selected ? `Linha clicada: #${selected}` : 'Clique em uma linha'}
      />
    </Stack>
  );
}
