import { TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from 'nekkora-lib';

const tipos = [
  ['Financeiro', 35],
  ['Comercial', 22],
  ['Operações', 18],
] as const;

export default function TablePrimitives() {
  return (
    <TableRoot bordered size="lg">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Tipo de processo</TableHeaderCell>
          <TableHeaderCell align="right">%</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tipos.map(([tipo, pct]) => (
          <TableRow key={tipo} selected={tipo === 'Comercial'}>
            <TableCell>{tipo}</TableCell>
            <TableCell align="right" muted>{pct}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
