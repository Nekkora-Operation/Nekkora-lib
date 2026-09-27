import { useMemo, type SVGAttributes } from 'react';
import QRCode from 'qrcode';
import { cx } from '../../utils/cx';
import './QrCode.css';

export interface QrCodeProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Conteúdo codificado (ex.: um URI otpauth:// recebido do servidor). Gerado localmente, sem serviço externo. */
  value: string;
  /** Lado em px. Padrão 184. */
  size?: number;
  /** Nome acessível da imagem. */
  label: string;
  /** Nível de correção de erro. Padrão "M". */
  level?: 'L' | 'M' | 'Q' | 'H';
}

/** QR Code em SVG, desenhado no navegador (o valor nunca sai da página). Fundo claro para leitura por câmeras. */
export function QrCode({ value, size = 184, label, level = 'M', className, ...rest }: QrCodeProps) {
  const { cells, count } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: level });
    const n = qr.modules.size;
    const out: string[] = [];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (qr.modules.get(x, y)) out.push(`M${x + 4} ${y + 4}h1v1h-1z`);
      }
    }
    return { cells: out.join(''), count: n + 8 };
  }, [value, level]);

  return (
    <svg
      role="img"
      aria-label={label}
      className={cx('nk-qrcode', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${count} ${count}`}
      shapeRendering="crispEdges"
      {...rest}
    >
      <rect width={count} height={count} fill="#ffffff" />
      <path d={cells} fill="#1b0c1a" />
    </svg>
  );
}
