import { describe, expect, it } from 'vitest';
import { applyMask, formatWithMask, maskInputMode, maskMaxLength, unmask } from './masks';

describe('masks', () => {
  it('formata CPF progressivamente', () => {
    expect(formatWithMask('123', 'cpf')).toBe('123');
    expect(formatWithMask('1234', 'cpf')).toBe('123.4');
    expect(formatWithMask('12345678909', 'cpf')).toBe('123.456.789-09');
    expect(formatWithMask('123456789099999', 'cpf')).toBe('123.456.789-09');
  });

  it('formata CNPJ', () => {
    expect(formatWithMask('11222333000181', 'cnpj')).toBe('11.222.333/0001-81');
  });

  it('alterna CPF/CNPJ automaticamente', () => {
    expect(formatWithMask('12345678909', 'cpfCnpj')).toBe('123.456.789-09');
    expect(formatWithMask('112223330001', 'cpfCnpj')).toBe('11.222.333/0001');
  });

  it('alterna telefone fixo/celular', () => {
    expect(formatWithMask('1133334444', 'phone')).toBe('(11) 3333-4444');
    expect(formatWithMask('11987654321', 'phone')).toBe('(11) 98765-4321');
  });

  it('aceita padrões customizados e ignora caracteres inválidos', () => {
    expect(applyMask('abc1234', 'AAA-9999')).toBe('abc-1234');
    expect(applyMask('12ab', '99/99')).toBe('12/');
    expect(formatWithMask('ab-12x', '**.**')).toBe('ab.12');
  });

  it('reformata valores já mascarados', () => {
    expect(formatWithMask('123.456.789-09', 'cpf')).toBe('123.456.789-09');
    expect(unmask('(11) 98765-4321')).toBe('11987654321');
  });

  it('calcula maxLength e inputMode', () => {
    expect(maskMaxLength('cpf')).toBe(14);
    expect(maskMaxLength('phone')).toBe(15);
    expect(maskMaxLength('cpfCnpj')).toBe(18);
    expect(maskInputMode('phone')).toBe('tel');
    expect(maskInputMode('cnpj')).toBe('numeric');
    expect(maskInputMode('AAA-9999')).toBe('text');
  });
});
