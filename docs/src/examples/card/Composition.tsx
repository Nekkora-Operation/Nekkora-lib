import { Button, Card, CardBody, CardFooter, CardHeader, Link, Text } from 'nekkora-lib';

export default function CardComposition() {
  return (
    <Card style={{ maxWidth: 560 }}>
      <CardHeader
        icon="executions"
        title="Execuções recentes"
        subtitle="Últimas 24 horas"
        action={<Link href="#" arrow>Ver todas</Link>}
      />
      <CardBody>
        <Text color="secondary">Conteúdo do card: tabelas, gráficos, formulários...</Text>
      </CardBody>
      <CardFooter>
        <Button variant="ghost">Cancelar</Button>
        <Button leftIcon="check">Confirmar</Button>
      </CardFooter>
    </Card>
  );
}
