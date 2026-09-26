import { Button, Grid, Input, Textarea } from 'nekkora-lib';

export default function FormEx() {
  return (
    <Grid minColumnWidth="260px" gap={4}>
      <Input label="E-mail" defaultValue="ana@empresa.com" success="E-mail válido" leftIcon="mail" />
      <Input label="Nome" error="Informe seu nome" leftIcon="user" />
      <Textarea label="Mensagem" placeholder="Conte o que você precisa" maxLength={300} showCount />
      <Textarea label="Observação" defaultValue="Recebido" success disabled />
      <Button href="https://wa.me/" leftIcon="whatsapp">Button como link (href)</Button>
    </Grid>
  );
}
