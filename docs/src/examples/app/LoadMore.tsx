import { useState } from 'react';
import { Button, LoadMore, Stack, Text } from 'nekkora-lib';

const PAGE = 10;
const TOTAL = 34; // a API não informa o total: só o componente de exemplo sabe

export default function LoadMoreExample() {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'normal' | 'erro' | 'cursor'>('normal');

  const more = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'erro') return;
      setCount((c) => Math.min(TOTAL, c + PAGE));
    }, 500);
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} wrap>
        <Button size="sm" variant={mode === 'normal' ? 'primary' : 'ghost'} onClick={() => setMode('normal')}>Normal</Button>
        <Button size="sm" variant={mode === 'erro' ? 'primary' : 'ghost'} onClick={() => setMode('erro')}>Falha ao carregar</Button>
        <Button size="sm" variant={mode === 'cursor' ? 'primary' : 'ghost'} onClick={() => setMode('cursor')}>Cursor recusado</Button>
      </Stack>
      <Text variant="body-sm" color="secondary">Itens 1–{count} da lista…</Text>
      <LoadMore
        hasMore={mode !== 'cursor' && count < TOTAL}
        loading={loading}
        onLoadMore={more}
        count={count}
        itemLabel="execuções"
        error={mode === 'erro' ? 'Não foi possível carregar mais. A lista exibida continua válida.' : undefined}
        stale={mode === 'cursor' ? 'A lista mudou desde a última página.' : undefined}
        onRestart={() => {
          setMode('normal');
          setCount(PAGE);
        }}
      />
    </Stack>
  );
}
