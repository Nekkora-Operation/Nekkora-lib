import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Divider.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Texto central opcional (ex.: "ou"). */
  label?: ReactNode;
}

/** Divisória horizontal de 1px, com rótulo central opcional. */
export function Divider({ label, className, ...rest }: DividerProps) {
  return (
    <div role="separator" className={cx('nk-divider', label != null && 'nk-divider--labeled', className)} {...rest}>
      {label != null && <span className="nk-divider__label">{label}</span>}
    </div>
  );
}
