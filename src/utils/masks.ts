/**
 * Máscaras genéricas.
 *
 * Padrão de máscara (string):
 *   9 → dígito (0-9)
 *   A → letra (a-z, A-Z)
 *   * → letra ou dígito
 *   qualquer outro caractere é literal (ex.: ".", "-", "/", "(", ")", " ").
 */
export type MaskPreset = 'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date';

export const MASK_PATTERNS = {
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  landline: '(99) 9999-9999',
  cellphone: '(99) 99999-9999',
  cep: '99999-999',
  date: '99/99/9999',
} as const;

const TOKENS: Record<string, RegExp> = {
  '9': /\d/,
  A: /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/,
};

/** Remove tudo que não for letra ou dígito. */
export function unmask(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

/** Aplica um padrão de máscara ao valor informado. */
export function applyMask(value: string, pattern: string): string {
  const raw = unmask(value);
  let out = '';
  let r = 0;

  for (let p = 0; p < pattern.length && r < raw.length; p++) {
    const token = TOKENS[pattern[p]];
    if (token) {
      // Avança no valor bruto até achar um caractere compatível com o token.
      while (r < raw.length && !token.test(raw[r])) r++;
      if (r >= raw.length) break;
      out += raw[r++];
    } else {
      out += pattern[p];
    }
  }
  return out;
}

/** Quantidade de posições editáveis de um padrão. */
export function maskCapacity(pattern: string): number {
  return pattern.split('').filter((c) => c in TOKENS).length;
}

/** Resolve o padrão efetivo de um preset, considerando o valor atual (máscaras dinâmicas). */
export function resolvePattern(mask: MaskPreset | string, value: string): string {
  const digits = unmask(value).replace(/\D/g, '');
  switch (mask) {
    case 'cpf':
      return MASK_PATTERNS.cpf;
    case 'cnpj':
      return MASK_PATTERNS.cnpj;
    case 'cpfCnpj':
      return digits.length <= 11 ? MASK_PATTERNS.cpf : MASK_PATTERNS.cnpj;
    case 'phone':
      // Fixo: 10 dígitos / Celular: 11 dígitos
      return digits.length <= 10 ? MASK_PATTERNS.landline : MASK_PATTERNS.cellphone;
    case 'cep':
      return MASK_PATTERNS.cep;
    case 'date':
      return MASK_PATTERNS.date;
    default:
      return mask;
  }
}

/** Formata um valor usando um preset ('cpf', 'cnpj', 'phone'...) ou um padrão customizado. */
export function formatWithMask(value: string, mask: MaskPreset | string): string {
  return applyMask(value, resolvePattern(mask, value));
}

export const formatCPF = (v: string) => formatWithMask(v, 'cpf');
export const formatCNPJ = (v: string) => formatWithMask(v, 'cnpj');
export const formatPhone = (v: string) => formatWithMask(v, 'phone');

/** Maior quantidade de caracteres possível para a máscara (usado em maxLength). */
export function maskMaxLength(mask: MaskPreset | string): number {
  switch (mask) {
    case 'cpfCnpj':
      return MASK_PATTERNS.cnpj.length;
    case 'phone':
      return MASK_PATTERNS.cellphone.length;
    default:
      return resolvePattern(mask, '').length;
  }
}

/** Sugestão de inputMode para teclados mobile. */
export function maskInputMode(mask: MaskPreset | string): 'numeric' | 'tel' | 'text' {
  if (mask === 'phone') return 'tel';
  const pattern = resolvePattern(mask, '');
  return /[A*]/.test(pattern) ? 'text' : 'numeric';
}
