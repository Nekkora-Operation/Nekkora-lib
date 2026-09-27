import { Button, Grid, Spinner, StateView } from 'nekkora-lib';

export default function States() {
  return (
    <Grid minColumnWidth="220px" gap={4}>
      <StateView status="loading" title="Validando link…" />
      <StateView status="success" title="E-mail confirmado" description="Você já pode entrar." actions={<Button>Ir para o login</Button>} />
      <StateView status="error" title="Este link não é mais válido" description="Solicite uma nova redefinição." meta="Código: 3f2a…91c0" />
      <StateView status="info" title="Spinner avulso" description={<Spinner />} />
    </Grid>
  );
}
